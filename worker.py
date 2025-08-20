import redis
import json
import os
import requests
from rag_pipeline import RAGPipeline
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
PROCESSING_QUEUE = "doc-processing-queue"
BACKEND_CALLBACK_URL = "http://localhost:8081/api/v1/documents/callback/status"

# --- Redis Connection ---
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

# --- RAG Pipeline Initialization ---
print("Initializing RAG Pipeline for the worker...")
rag_pipeline = RAGPipeline(
    use_hf_inference=False, # Assuming local model usage for background jobs
    hf_api_key=os.getenv("HF_API_KEY")
)
print("RAG Pipeline initialized.")

def send_callback(document_id, status, python_document_id=None, error_message=None):
    """Sends a status update back to the Spring Boot backend."""
    payload = {
        "documentId": document_id,
        "status": status,
        "pythonDocumentId": python_document_id,
        "errorMessage": error_message
    }
    try:
        response = requests.post(BACKEND_CALLBACK_URL, json=payload)
        response.raise_for_status() # Raise an exception for bad status codes
        print(f"Successfully sent callback for document {document_id} with status {status}")
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Could not send callback for document {document_id}. Error: {e}")

def main():
    """Main worker loop to listen for and process jobs."""
    print(f"Worker started. Listening for jobs on Redis queue: '{PROCESSING_QUEUE}'...")
    while True:
        try:
            # Blocking pop from the queue
            _, job_json = r.blpop(PROCESSING_QUEUE)
            print(f"\n--- New Job Received ---")
            job_data = json.loads(job_json)
            
            doc_id = job_data.get("documentId")
            file_path = job_data.get("filePath")

            if not doc_id or not file_path:
                print(f"ERROR: Invalid job data received: {job_data}")
                continue

            print(f"Processing documentId: {doc_id}, filePath: {file_path}")

            try:
                # Execute the RAG processing pipeline
                python_doc_id = rag_pipeline.process_document(file_path, str(doc_id))
                
                # Send success callback
                send_callback(doc_id, "COMPLETED", python_document_id=python_doc_id)

            except Exception as e:
                print(f"ERROR: Failed to process document {doc_id}. Error: {e}")
                # Send failure callback
                send_callback(doc_id, "FAILED", error_message=str(e))
            finally:
                # Clean up the temporary file
                if os.path.exists(file_path):
                    os.unlink(file_path)
                    print(f"Cleaned up temporary file: {file_path}")
                print(f"--- Job Finished for document {doc_id} ---")

        except redis.exceptions.ConnectionError as e:
            print(f"Redis connection error: {e}. Retrying in 5 seconds...")
            time.sleep(5)
        except Exception as e:
            # Catch-all for any other unexpected errors in the loop
            print(f"An unexpected error occurred in the worker loop: {e}")

if __name__ == "__main__":
    main()
