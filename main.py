from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import uuid
import tempfile
from rag_pipeline import RAGPipeline
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Research Q&A API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize pipeline
rag_pipeline = RAGPipeline(
    use_hf_inference=False,
    hf_api_key=os.getenv("HF_API_KEY")
)

# Models
class QuestionRequest(BaseModel):
    question: str
    document_id: str

class UploadResponse(BaseModel):
    document_id: str
    success: bool
    message: Optional[str] = None
    chunks_processed: Optional[int] = None

class AnswerResponse(BaseModel):
    answer: str
    sources: List[dict]
    success: bool
    document_id: str
    processing_info: Optional[dict] = None

class ModelLoadRequest(BaseModel):
    model_name: str
    model_type: Optional[str] = "auto"

# === Core Endpoints ===
@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    document_id: Optional[str] = Form(None)
) -> UploadResponse:
    if not file.filename.lower().endswith(('.pdf', '.txt')):
        raise HTTPException(400, "Only PDF/TXT files allowed")
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        if not document_id:
            document_id = str(uuid.uuid4())
            
        processed_doc_id = rag_pipeline.process_document(tmp_path, document_id)
        
        return UploadResponse(
            document_id=processed_doc_id,
            success=True,
            message=f"Document processed successfully",
            chunks_processed=rag_pipeline.collections.get(document_id).count() if document_id in rag_pipeline.collections else 0
        )
    except Exception as e:
        raise HTTPException(500, f"Error processing document: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

@app.post("/ask")
async def ask_question(
    request: QuestionRequest,
) -> AnswerResponse:
    try:
        result = await rag_pipeline.ask_question(request.question, request.document_id)
        if not result["success"]:
            raise HTTPException(400, result["answer"])
        
        return AnswerResponse(
            answer=result["answer"],
            sources=result["sources"],
            success=result["success"],
            document_id=request.document_id,
            processing_info=result.get("processing_info")
        )
    except Exception as e:
        raise HTTPException(500, str(e))

# === Additional Endpoints ===
@app.get("/documents", response_model=List[str])
async def list_documents():
    """List all processed document IDs"""
    try:
        return rag_pipeline.list_documents()
    except Exception as e:
        raise HTTPException(500, f"Error listing documents: {str(e)}")

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a processed document and its data"""
    try:
        success = rag_pipeline.delete_document(document_id)
        if not success:
            raise HTTPException(404, f"Document {document_id} not found")
        return {"message": f"Document {document_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(500, f"Error deleting document: {str(e)}")

@app.post("/load-model")
async def load_model(request: ModelLoadRequest):
    """Load a specific LLM model"""
    try:
        rag_pipeline.load_local_llm(request.model_name)
        return {
            "message": f"Model {request.model_name} loaded successfully",
            "model_type": request.model_type
        }
    except Exception as e:
        raise HTTPException(500, f"Error loading model: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)