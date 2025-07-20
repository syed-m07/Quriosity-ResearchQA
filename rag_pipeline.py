import os
import uuid
import re
import torch
import requests
import json
from typing import List, Dict, Optional
from datetime import datetime
from huggingface_hub import InferenceClient
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from sentence_transformers import SentenceTransformer
import chromadb
import numpy as np
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

class RAGPipeline:

    def __init__(
        self,
        embedding_model_name: str = "sentence-transformers/all-mpnet-base-v2",
        llm_model_name: str = "deepseek-ai/DeepSeek-R1-0528",
        chunk_size: int = 1000,
        chunk_overlap: int = 250,
        top_k: int = 5,
        use_hf_inference: bool = True,
        hf_api_key: Optional[str] = None,
        **kwargs
    ):
        # Initialize configuration
        self.use_hf_inference = use_hf_inference
        self.hf_api_key = hf_api_key or os.getenv("HF_API_KEY")
        print(f"Loaded HF API Key: {self.hf_api_key}")
        
        if self.use_hf_inference:
            if not self.hf_api_key:
                raise ValueError("HF_API_KEY is required for Hugging Face inference")
            self.hf_client = InferenceClient(
                model="deepseek-ai/DeepSeek-R1-0528",
                token=self.hf_api_key
            )

        # Initialize ChromaDB
        self.chroma_client = chromadb.PersistentClient(path="./chroma_db")
        
        # Initialize embedding model
        self.embedding_model = SentenceTransformer(embedding_model_name)
        
        # Text splitter configuration
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ". ", "! ", "? ", "; ", ", ", " "],
            keep_separator=True
        )
        
        # Configuration
        self.top_k = top_k
        self.collections = {}
        self.llm_model_name = llm_model_name
        
        # Initialize LLM-related attributes (loaded lazily for local models)
        self.llm_model = None
        self.tokenizer = None
        self.generator_pipeline = None
        
        # Recommended models mapping
        self.recommended_models = {
            "flan-t5-large": "google/flan-t5-large",
            "flan-t5-xl": "google/flan-t5-xl",
            "mistral-7b": "mistralai/Mistral-7B-Instruct-v0.1",
            "zephyr-7b": "HuggingFaceH4/zephyr-7b-beta"
        }

    def _load_llm(self):
        """Lazy loading of local LLM model"""
        if self.llm_model or self.generator_pipeline:
            return
            
        try:
            model_name = self.recommended_models.get(
                self.llm_model_name, 
                self.llm_model_name
            )
            
            print(f"Loading LLM: {model_name}")
            
            if "t5" in model_name.lower():
                self.generator_pipeline = pipeline(
                    "text2text-generation",
                    model=model_name,
                    tokenizer=model_name,
                    device="cuda" if torch.cuda.is_available() else "cpu",
                    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                    model_kwargs={"load_in_4bit": True} if torch.cuda.is_available() else {}
                )
            else:
                self.tokenizer = AutoTokenizer.from_pretrained(
                    model_name,
                    trust_remote_code=True
                )
                self.llm_model = AutoModelForCausalLM.from_pretrained(
                    model_name,
                    device_map="auto",
                    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                    load_in_4bit=True if torch.cuda.is_available() else False
                )
                if self.tokenizer.pad_token is None:
                    self.tokenizer.pad_token = self.tokenizer.eos_token
                    
        except Exception as e:
            print(f"Error loading LLM: {e}")
            self._cleanup_llm()
            raise RuntimeError(f"Failed to load LLM: {e}")

    def _cleanup_llm(self):
        """Clean up LLM resources"""
        if self.llm_model:
            del self.llm_model
            self.llm_model = None
        if self.tokenizer:
            del self.tokenizer
            self.tokenizer = None
        if self.generator_pipeline:
            del self.generator_pipeline
            self.generator_pipeline = None
        torch.cuda.empty_cache()
    
    def process_document(self, file_path: str, document_id: str = None) -> str:
        """Enhanced document processing with better chunking for research papers"""
        if document_id is None:
            document_id = str(uuid.uuid4())
        
        try:
            # Load document
            if file_path.endswith('.pdf'):
                loader = PyPDFLoader(file_path)
            elif file_path.endswith('.txt'):
                loader = TextLoader(file_path, encoding='utf-8')
            else:
                raise ValueError(f"Unsupported file type: {file_path}")
            
            documents = loader.load()
            
            # Preprocess text for research papers
            processed_docs = []
            for doc in documents:
                # Clean text - remove excessive whitespace, fix line breaks
                text = doc.page_content
                text = re.sub(r'\n+', '\n', text)  # Multiple newlines to single
                text = re.sub(r' +', ' ', text)    # Multiple spaces to single
                text = text.strip()
                
                if text:  # Only add non-empty documents
                    doc.page_content = text
                    processed_docs.append(doc)
            
            if not processed_docs:
                raise ValueError("No content found in document after processing")
            
            # Split into chunks
            chunks = self.text_splitter.split_documents(processed_docs)
            
            # Create collection
            collection_name = f"doc_{document_id}"
            
            try:
                self.chroma_client.delete_collection(collection_name)
            except:
                pass
                
            collection = self.chroma_client.create_collection(
                name=collection_name,
                metadata={"document_id": document_id, "processed_at": str(datetime.now())}
            )
            
            # Process chunks with enhanced metadata
            texts = []
            metadatas = []
            
            for i, chunk in enumerate(chunks):
                text = chunk.page_content
                texts.append(text)
                
                # Enhanced metadata
                metadata = {
                    "chunk_index": i,
                    "source": chunk.metadata.get("source", ""),
                    "page": chunk.metadata.get("page", 0),
                    "word_count": len(text.split()),
                    "char_count": len(text),
                    "has_math": bool(re.search(r'[∫∑∂αβγδε]|\$.*?\$|\\[a-zA-Z]+', text)),
                    "has_figure_ref": bool(re.search(r'Figure \d+|Fig\. \d+|Table \d+', text, re.IGNORECASE)),
                    "section_type": self._detect_section_type(text)
                }
                metadatas.append(metadata)
            
            # Generate embeddings
            print(f"Generating embeddings for {len(texts)} chunks...")
            embeddings = self.embedding_model.encode(
                texts, 
                show_progress_bar=True,
                convert_to_numpy=True
            ).tolist()
            
            # Store in ChromaDB
            ids = [f"{document_id}_chunk_{i}" for i in range(len(chunks))]
            
            collection.add(
                embeddings=embeddings,
                documents=texts,
                metadatas=metadatas,
                ids=ids
            )
            
            self.collections[document_id] = collection
            
            print(f"Document processed: {len(chunks)} chunks stored")
            return document_id
            
        except Exception as e:
            print(f"Error processing document: {e}")
            raise


    #This section classifies documents into semantic sections to improve contextual retrieval, basically it enables the section-aware retrieval (prioritizing certain sections according to the questions asked)
    def _detect_section_type(self, text: str) -> str:
        """Detect the type of section based on content"""
        text_lower = text.lower()
        
        if any(keyword in text_lower for keyword in ['abstract', 'summary']):
            return 'abstract'
        elif any(keyword in text_lower for keyword in ['introduction', 'background']):
            return 'introduction'
        elif any(keyword in text_lower for keyword in ['method', 'approach', 'algorithm']):
            return 'methodology'
        elif any(keyword in text_lower for keyword in ['result', 'experiment', 'evaluation']):
            return 'results'
        elif any(keyword in text_lower for keyword in ['conclusion', 'future work']):
            return 'conclusion'
        elif any(keyword in text_lower for keyword in ['related work', 'literature review']):
            return 'related_work'
        else:
            return 'content'
    

    #Retrieves and reranks the document chunks based on semantic relevance to the question asked
    def retrieve_relevant_chunks(self, question: str, document_id: str) -> List[Dict]:
        """Enhanced retrieval with better ranking and filtering"""
        try:
            if document_id not in self.collections:
                collection_name = f"doc_{document_id}"
                self.collections[document_id] = self.chroma_client.get_collection(collection_name)
            
            collection = self.collections[document_id]
            
            # Generate query embedding
            query_embedding = self.embedding_model.encode([question]).tolist()
            
            # Query with more results for reranking
            results = collection.query(
                query_embeddings=query_embedding,
                n_results=min(self.top_k * 2, 10)  # Get more candidates for reranking
            )
            
            # Enhanced ranking and filtering
            chunks = []
            for i in range(len(results['documents'][0])):
                chunk_data = {
                    "text": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i],
                    "distance": results['distances'][0][i] if 'distances' in results else 0.0,
                    "id": results['ids'][0][i]
                }
                
                # Calculate relevance score
                relevance = 1.0 - chunk_data["distance"]
                
                # Boost score based on content type and question keywords
                boost_factor = self._calculate_boost_factor(question, chunk_data)
                final_score = relevance * boost_factor
                
                chunk_data["relevance_score"] = final_score
                chunks.append(chunk_data)
            
            # Sort by relevance and take top_k
            chunks.sort(key=lambda x: x["relevance_score"], reverse=True)
            return chunks[:self.top_k]
            
        except Exception as e:
            print(f"Error retrieving chunks: {e}")
            return []
    

    #Dynamically adjust the chunk relevance scores based on the question-chunk alignment (boosting or penalizing chunks)
    def _calculate_boost_factor(self, question: str, chunk_data: Dict) -> float:
        """Calculate boost factor based on question type and chunk metadata"""
        boost = 1.0
        question_lower = question.lower()
        text_lower = chunk_data["text"].lower()
        metadata = chunk_data.get("metadata", {})
        
        # Boost for mathematical content if question is about algorithms/methods
        if any(word in question_lower for word in ['algorithm', 'method', 'equation', 'formula']):
            if metadata.get('has_math', False):
                boost *= 1.3
        
        # Boost for figures/tables if question asks about results/examples
        if any(word in question_lower for word in ['result', 'example', 'figure', 'table']):
            if metadata.get('has_figure_ref', False):
                boost *= 1.2
        
        # Boost based on section type
        section_type = metadata.get('section_type', 'content')
        if 'method' in question_lower and section_type == 'methodology':
            boost *= 1.4
        elif any(word in question_lower for word in ['result', 'performance']) and section_type == 'results':
            boost *= 1.4
        elif any(word in question_lower for word in ['background', 'related']) and section_type == 'related_work':
            boost *= 1.3
        
        # Penalize very short chunks
        if metadata.get('word_count', 0) < 20:
            boost *= 0.8
        
        return boost

    def create_research_prompt(self, question: str, context_chunks: List[Dict]) -> str:
        """Create an enhanced prompt for research assistant"""
        context_parts = []
        
        for i, chunk in enumerate(context_chunks, 1):
            metadata = chunk.get('metadata', {})
            page_info = f"Page {metadata.get('page', 'N/A')}"
            section_info = f"Section: {metadata.get('section_type', 'content').title()}"
            
            context_part = f"""Context {i} ({page_info}, {section_info}):
            {chunk['text']}
            """
            context_parts.append(context_part)
        
        combined_context = "\n".join(context_parts)
        
        prompt = f"""You are an expert research assistant analyzing academic papers. Your task is to provide accurate, comprehensive, and well-structured answers based on the given context.

            Instructions:
            1. Answer the question accurately using ONLY the information provided in the context
            2. Be comprehensive but concise - aim for 2-4 sentences for simple questions, more for complex ones
            3. Use technical terminology appropriately 
            4. If the context contains specific numbers, methods, or findings, include them in your answer
            5. If the question cannot be fully answered from the context, clearly state what information is missing
            6. Structure your answer logically with clear explanations

            Context from research paper:
            {combined_context}

            Question: {question}

            Research Assistant Answer:"""
        
        return prompt
    
    async def generate_with_hf(self, prompt: str) -> str:
        """Generate response using Hugging Face Inference API"""
        try:
            response = self.hf_client.text_generation(
                prompt,
                max_new_tokens=500,
                temperature=0.7,
                details=True
            )
            return response.generated_text
        except Exception as e:
            print(f"HF Inference error: {str(e)}")
            # Fallback to local model if available
            if self.llm_model or self.generator_pipeline:
                return self._generate_locally(prompt)
            raise RuntimeError("Failed to generate with HF Inference and no local fallback")

    async def generate_with_openrouter(self, prompt: str) -> str:
        """Generate response using OpenRouter.ai API"""
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise RuntimeError("OPENROUTER_API_KEY not set in environment")
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        data = {
            "model": "deepseek/deepseek-r1-0528:free",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        try:
            response = requests.post(url, headers=headers, data=json.dumps(data))
            response.raise_for_status()
            result = response.json()
            # Extract the generated answer
            return result["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"OpenRouter error: {e}")
            raise RuntimeError("Failed to generate with OpenRouter")




    def _generate_locally(self, prompt: str) -> str:
        """Generate response using local model"""
        try:
            self._load_llm()
            
            if self.generator_pipeline:
                result = self.generator_pipeline(
                    prompt,
                    max_length=500,
                    do_sample=True,
                    temperature=0.7
                )
                return result[0]['generated_text']
            elif self.llm_model:
                inputs = self.tokenizer.encode(
                    prompt,
                    return_tensors="pt",
                    truncation=True,
                    max_length=1000
                )
                outputs = self.llm_model.generate(
                    inputs.to(self.llm_model.device),
                    max_new_tokens=500,
                    temperature=0.7
                )
                return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        except Exception as e:
            print(f"Local generation error: {e}")
            return "I couldn't generate an answer. Please try again."

    async def generate_answer_with_llm(self, question: str, context_chunks: List[Dict]) -> str:
        """Generate answer using either HF API or local model"""
        if not context_chunks:
            return "No relevant context found."
        
        prompt = self.create_research_prompt(question, context_chunks)

        # Use OpenRouter if API key is set
        if os.getenv("OPENROUTER_API_KEY"):
            print("Using OpenRouter for inference")
            try:
                return await self.generate_with_openrouter(prompt)
            except Exception:
                pass  # fallback to other methods
        if self.use_hf_inference:
            try:
                return await self.generate_with_hf(prompt)
            except Exception:
                if self.llm_model or self.generator_pipeline:
                    return self._generate_locally(prompt)
                raise
        else:
            return self._generate_locally(prompt)

    

    def generate_answer_simple(self, question: str, context_chunks: List[Dict]) -> str:
        """Enhanced simple answer generation for research content"""
        if not context_chunks:
            return "I couldn't find relevant information in the document to answer your question."
        
        # Analyze question type
        question_lower = question.lower()
        
        # Build comprehensive answer
        answer_parts = []
        
        # Check for specific question types and tailor response
        if any(word in question_lower for word in ['what is', 'define', 'definition']):
            answer_parts.append("Based on the research paper:")
        elif any(word in question_lower for word in ['how', 'method', 'approach']):
            answer_parts.append("The paper describes the following approach:")
        elif any(word in question_lower for word in ['why', 'reason', 'advantage']):
            answer_parts.append("According to the research:")
        else:
            answer_parts.append("From the academic paper, here are the key findings:")
        
        # Process chunks intelligently
        processed_content = []
        
        for chunk in context_chunks[:3]:  # Focus on top 3 most relevant
            text = chunk["text"]
            metadata = chunk.get("metadata", {})
            
            # Extract key sentences
            sentences = [s.strip() for s in text.split('.') if len(s.strip()) > 20]
            
            # Find most relevant sentences based on question keywords
            relevant_sentences = []
            question_words = set(question_lower.split())
            
            for sentence in sentences:
                sentence_words = set(sentence.lower().split())
                overlap = len(question_words.intersection(sentence_words))
                if overlap > 0 or len(relevant_sentences) < 2:
                    relevant_sentences.append(sentence)
                    if len(relevant_sentences) >= 2:
                        break
            
            if relevant_sentences:
                content = '. '.join(relevant_sentences)
                if not content.endswith('.'):
                    content += '.'
                processed_content.append(content)
        
        # Combine processed content
        if processed_content:
            answer_parts.append(' '.join(processed_content))
        else:
            # Fallback to first chunk
            first_chunk = context_chunks[0]["text"]
            if len(first_chunk) > 300:
                first_chunk = first_chunk[:300] + "..."
            answer_parts.append(first_chunk)
        
        return ' '.join(answer_parts)
    
    async def ask_question(self, question: str, document_id: str) -> Dict:
        """Enhanced question answering with better error handling and responses"""
        try:
            # Clean and validate question
            question = question.strip()
            if not question:
                return {
                    "answer": "Please provide a valid question.",
                    "sources": [],
                    "success": False
                }
            
            # Remove common prompt prefixes from question for better retrieval
            clean_question = question
            prefixes_to_remove = [
                "You are a research assistant.",
                "Given the following extracted parts of a research paper,",
                "answer the question accurately and concisely.",
                "If the answer cannot be found in the text, say I don't know."
            ]
            
            for prefix in prefixes_to_remove:
                clean_question = clean_question.replace(prefix, "").strip()
            
            # Extract actual question
            if "Tell me about" in clean_question or "tell me about" in clean_question:
                clean_question = clean_question.split("tell me about")[-1].strip()
            
            # Retrieve relevant chunks
            chunks = self.retrieve_relevant_chunks(clean_question, document_id)
            
            if not chunks:
                return {
                    "answer": "I couldn't find relevant information in the document to answer your question. Please try rephrasing your question or check if the document contains information about this topic.",
                    "sources": [],
                    "success": True
                }
            
            # Generate answer
            answer = await self.generate_answer_with_llm(clean_question, chunks)
            
            # Format sources with enhanced information
            sources = []
            for i, chunk in enumerate(chunks):
                metadata = chunk['metadata']
                source_info = f"Page {metadata.get('page', 'N/A')}, {metadata.get('section_type', 'Content').title()} Section"
                
                # Add additional context
                if metadata.get('has_math'):
                    source_info += " (Contains Mathematical Content)"
                if metadata.get('has_figure_ref'):
                    source_info += " (References Figures/Tables)"
                
                sources.append({
                    "text": chunk["text"][:250] + "..." if len(chunk["text"]) > 250 else chunk["text"],
                    "metadata": source_info,
                    "relevance_score": chunk.get("relevance_score", 0.0),
                    "section_type": metadata.get('section_type', 'content')
                })
            
            return {
                "answer": answer,
                "sources": sources,
                "success": True,
                "processing_info": {
                    "chunks_used": len(chunks),
                    "question_processed": clean_question != question,
                    "model_used": "openrouter" if os.getenv("OPENROUTER_API_KEY") else "hf" if self.use_hf_inference else "local"
                }
            }
            
        except Exception as e:
            print(f"Error answering question: {e}")
            return {
                "answer": f"I encountered an error while processing your question: {str(e)}. Please try again with a different question.",
                "sources": [],
                "success": False
            }
    
    def list_documents(self) -> List[str]:
        """List all processed document IDs"""
        return list(self.collections.keys())
    
    def delete_document(self, document_id: str) -> bool:
        """Delete a document and its associated data"""
        try:
            collection_name = f"doc_{document_id}"
            self.chroma_client.delete_collection(collection_name)
            
            if document_id in self.collections:
                del self.collections[document_id]
            
            return True
        except Exception as e:
            print(f"Error deleting document: {e}")
            return False