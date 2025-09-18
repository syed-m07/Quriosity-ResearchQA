
# Ultimate Documentation: ResearchRAG

This document provides a comprehensive overview of the ResearchRAG application, detailing its architecture, technology stack, features, and setup instructions.

## 1. High-Level Architecture

The ResearchRAG application is a multi-component system designed to provide a research-oriented question-answering and summarization platform. It consists of three main components: a Java/Spring Boot backend, a TypeScript/React frontend, and a Python-based machine learning and data processing service.

```
+-----------------+      +----------------------+      +--------------------+
|                 |      |                      |      |                    |
|  React Frontend |<---->|  Spring Boot Backend |<---->| Python Service     |
| (Vite, Tailwind)|      | (Java, PostgreSQL)   |      | (FastAPI, PyTorch) |
|                 |      |                      |      |                    |
+-----------------+      +----------------------+      +--------------------+
      |                                                       |
      |                                                       |
      +-------------------------------------------------------+
      |
      |  +-----------------+     +-----------------+
      |  |                 |     |                 |
      +-->  ChromaDB       <----->  Redis          |
      |  | (Vector Store)  |     | (Message Broker)|
      |  |                 |     |                 |
      |  +-----------------+     +-----------------+
      |
      |  +-----------------+
      |  |                 |
      +-->  LLM APIs       |
      |  | (OpenRouter)    |
      |  |                 |
      |  +-----------------+

```

**Component Breakdown:**

*   **Frontend**: A modern, responsive user interface built with React and TypeScript. It allows users to upload documents, ask questions, and view results.
*   **Backend**: A robust Spring Boot application that manages user authentication, data persistence (in PostgreSQL), and communication with the Python service. It exposes a REST API for the frontend.
*   **Python Service**: A FastAPI application that handles all the machine learning and data processing tasks. This includes the RAG pipeline, faculty profile summarization, and interaction with LLMs and the vector database.
*   **ChromaDB**: A vector database used to store and retrieve document embeddings for the RAG pipeline.
*   **Redis**: A message broker used to queue document processing jobs for the Python worker.
*   **LLM APIs**: The application is designed to work with various LLMs, with a primary integration with OpenRouter.ai.

## 2. Technology Stack

### Backend

*   **Language**: Java 17
*   **Framework**: Spring Boot 3
*   **Database**: PostgreSQL
*   **Authentication**: JWT (JSON Web Tokens)
*   **Web Client**: Spring WebFlux (for reactive HTTP requests)
*   **Build Tool**: Maven
*   **Utilities**: Lombok, Apache POI (for Excel)

### Frontend

*   **Language**: TypeScript
*   **Framework**: React
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **UI Components**: Radix UI, Lucide Icons, Recharts
*   **Routing**: React Router
*   **Forms**: React Hook Form, Zod
*   **HTTP Client**: Axios

### Python/ML

*   **Language**: Python 3.12
*   **Web Framework**: FastAPI, Uvicorn
*   **ML/NLP**: PyTorch, LangChain, Transformers, Sentence-Transformers
*   **Vector Database**: ChromaDB
*   **Asynchronous Tasks**: Celery, Redis
*   **Data Processing**: Pandas, PyMuPDF, python-docx
*   **External APIs**: Google Search (via SerpApi), OpenRouter.ai

## 3. Features

The application is divided into two main features:

### 3.1. RAG (Retrieval-Augmented Generation) Implementation

The RAG pipeline allows users to upload documents (PDF or TXT) and ask questions about their content. The system will then retrieve relevant information from the document and generate a concise, accurate answer.

**Workflow:**

1.  **Document Upload**: The user uploads a document through the frontend. The Spring Boot backend receives the file and sends it to the Python service.
2.  **Asynchronous Processing**: The Python service places a job on the Redis queue to process the document. A Celery worker picks up the job and starts the RAG pipeline.
3.  **Document Processing**:
    *   The document is loaded using `PyMuPDFLoader` or `TextLoader`.
    *   The text is cleaned and preprocessed to handle research paper-specific formatting.
    *   The text is split into smaller, overlapping chunks using `RecursiveCharacterTextSplitter`.
    *   Each chunk is assigned metadata, including its source, page number, and a detected section type (e.g., "abstract", "methodology", "results").
4.  **Embedding and Storage**:
    *   The `sentence-transformers/all-mpnet-base-v2` model is used to generate embeddings for each chunk.
    *   The chunks and their embeddings are stored in a ChromaDB collection, with a unique ID for each document.
5.  **Question Answering**:
    *   When a user asks a question, the query is embedded using the same sentence-transformer model.
    *   ChromaDB is queried to find the most relevant chunks based on cosine similarity.
    *   The retrieved chunks are reranked using a custom algorithm that considers the relevance score and boosts chunks based on the question's intent and the chunk's metadata (e.g., boosting the "methodology" section for a question about the algorithm).
    *   A detailed prompt is engineered, combining the user's question with the reranked context chunks.
    *   The prompt is sent to an LLM (either via OpenRouter.ai, the Hugging Face Inference API, or a local model) to generate the final answer.
6.  **Response**: The generated answer, along with the source chunks, is returned to the user through the backend and displayed on the frontend.

### 3.2. Faculty Profile Summarizer

This feature allows for the automated generation of research summaries for faculty members based on their publication history.

**Workflow:**

1.  **Faculty List Upload**: A user can upload an Excel file containing a list of faculty names and their affiliations.
2.  **Profile Discovery**: For each faculty member, the `PublicationsPipeline` uses the SerpApi to search Google Scholar for their author profile. It employs a multi-strategy approach to find the correct author ID.
3.  **Publication Fetching**: Once the author ID is found, the pipeline fetches the faculty member's complete list of publications from Google Scholar, including titles, authors, publication year, and citation counts.
4.  **Summarization**:
    *   The user can specify a date range for the publications to be summarized.
    *   A prompt is constructed containing the faculty member's name and a list of their publication titles within the specified date range.
    *   The prompt is sent to the OpenRouter.ai API to generate a concise, one-paragraph narrative summary of the faculty member's research focus and contributions.
5.  **Response**: The generated summary is returned to the user.

## 4. API Endpoints (FastAPI)

The Python service exposes the following API endpoints:

*   `POST /upload`: Uploads a document for processing.
*   `POST /ask`: Asks a question about a processed document.
*   `POST /publications/upload`: Uploads an Excel file of faculty members to process.
*   `POST /publications/summarize`: Generates a summary for a given list of publications.
*   `GET /documents`: Lists all processed document IDs.
*   `DELETE /documents/{document_id}`: Deletes a processed document.
*   `POST /load-model`: Loads a specified LLM model into memory.

## 5. Setup and Installation

To run the ResearchRAG application, you will need to set up the backend, frontend, and Python service separately.

### Prerequisites

*   Java 17+
*   Maven
*   Node.js and npm
*   Python 3.10+
*   PostgreSQL
*   Redis

### Backend Setup

1.  Navigate to the `backend` directory.
2.  Create a PostgreSQL database and update the `application.properties` file with your database credentials.
3.  Run `mvn spring-boot:run` to start the backend server.

### Frontend Setup

1.  Navigate to the `frontend` directory.
2.  Run `npm install` to install the dependencies.
3.  Run `npm run dev` to start the development server.

### Python Service Setup

1.  Navigate to the root directory of the project.
2.  Create a Python virtual environment: `python -m venv myenv`.
3.  Activate the virtual environment: `source myenv/bin/activate`.
4.  Install the required Python packages: `pip install -r requirements.txt`.
5.  Create a `.env` file in the root directory and add the following environment variables:
    ```
    SERPAPI_API_KEY=your_serpapi_key
    OPENROUTER_API_KEY=your_openrouter_key
    HF_API_KEY=your_huggingface_key
    REDIS_HOST=localhost
    REDIS_PORT=6379
    ```
6.  Start the FastAPI server: `uvicorn main:app --host 0.0.0.0 --port 8000`.
7.  In a separate terminal, start the Celery worker: `python worker.py`.

Once all three components are running, you can access the application in your browser at `http://localhost:5173` (or the port specified by Vite).
