# Quriosity

## Project Overview

QRiosity is a full-stack application designed to facilitate research by providing a question-and-answer system powered by Retrieval Augmented Generation (RAG). It features a robust backend for managing documents and user interactions, a dynamic frontend for an intuitive user experience, and a Python-based RAG pipeline for intelligent information retrieval and response generation.

## Features

*   **User Authentication & Management:** Secure user registration, login, profile management (update profile, change password, delete account), and enhanced authentication with refresh tokens and stateful logout.
*   **Document Management:** Upload, store, and query research documents. Documents are processed asynchronously with real-time status updates. Users can chat with uploaded documents and view conversation history.
*   **Intelligent Q&A System:** Ask questions related to uploaded documents and receive accurate, context-aware answers. Features include RAG query caching and advanced retrieval with semantic section detection and dynamic boost factors.
*   **Faculty Profile Management:**
    *   Upload Excel/CSV files containing faculty names and IDs.
    *   Fetch and display detailed faculty profiles (affiliations, Google Scholar ID, thumbnail, interests, citation metrics).
    *   Retrieve and display publications for each faculty member.
    *   Generate narrative research summaries for faculty publications, with optional filtering by year range.
    *   Export faculty profiles and their publications to Excel (.xlsx) or Word (.docx) formats.
    *   Manage uploaded faculty batches (view, delete).
    *   Handles re-uploads of existing faculty profiles by updating them instead of creating duplicates.
*   **LLM Integration:** Supports various LLM models, including external services like OpenRouter.ai, Hugging Face Inference API, and local models.

## Technologies Used

### Backend
*   **Language:** Java
*   **Framework:** Spring Boot
*   **Build Tool:** Maven
*   **Security:** Spring Security, JWT (JSON Web Tokens) for authentication, refresh tokens, stateful token invalidation.
*   **API:** RESTful API design, Global Error Handling, Input Validation.
*   **Data:** Spring Data JPA, MySQL, Redis (for caching and asynchronous job queuing).
*   **Document Processing:** Apache POI (for Excel/Word export).
*   **Web Client:** Spring Boot Starter WebFlux (for reactive HTTP client).

### Frontend
*   **Language:** TypeScript
*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn UI
*   **Routing:** React Router DOM
*   **State Management:** React Context API

### RAG/AI Component (Python)
*   **Language:** Python
*   **Framework:** FastAPI
*   **Vector Database:** ChromaDB
*   **Embeddings:** Sentence Transformers
*   **LLMs:** Hugging Face Transformers (for local models), Hugging Face Inference Client, OpenRouter.ai API integration.
*   **Document Loading:** PyMuPDF, Langchain
*   **Data Processing:** Pandas, OpenPyXL (for Excel/CSV handling), SerpApi (for Google Scholar scraping).
*   **Queueing:** Redis
*   **Utilities:** `python-dotenv`, `requests`, `httpx`, `python-docx`.

### Database
*   **MySQL:** Primary relational database for user data, document metadata, Q&A history, and faculty profiles.
*   **Redis:** Used for caching RAG query responses and as a message broker for asynchronous document processing.

## Project Structure

The project is organized into three main parts:

*   `backend/`: Contains the Spring Boot application, handling API endpoints, business logic, and data persistence.
*   `frontend/`: Contains the React.js application, providing the user interface and interacting with the backend API.
*   Root Directory (`./`): Contains Python scripts (`main.py`, `rag_pipeline.py`, `publications_pipeline.py`, `llm_utils.py`, `worker.py`) for the RAG and faculty publication functionalities, along with project-level configuration files (`requirements.txt`, `.gitignore`).

## Setup and Installation

To get the QRiosity up and running on your local machine, follow these steps:

### Prerequisites

Ensure you have the following installed:

*   **Java Development Kit (JDK):** Version 17 or higher.
*   **Maven:** For building the Java backend.
*   **Node.js:** Version 18 or higher (includes npm).
*   **Python:** Version 3.9 or higher.
*   **pip:** Python package installer.
*   **MySQL Database:** A running MySQL instance with a database named `research_rag` (or configured otherwise in `application.properties`).
*   **Redis Server:** A running Redis server (default port 6379).

### 1. Backend Setup

Navigate to the `backend` directory and build the project:

```bash
cd backend
./mvnw clean install
```

To run the backend application:

```bash
./mvnw spring-boot:run
```
The backend will typically run on `http://localhost:8081`.

### 2. Frontend Setup

Navigate to the `frontend` directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```
The frontend application will typically be accessible at `http://localhost:5173` (or another port as indicated by Vite).

### 3. Python RAG Component Setup

Navigate back to the root directory of the project:

```bash
cd ..
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

To run the FastAPI application (RAG and Publications API):

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

To run the Redis worker for asynchronous document processing:

```bash
python worker.py
```

## Usage

Once all components (Backend, Frontend, Python FastAPI, Python Worker, MySQL, Redis) are running, open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`).

*   **Register/Login:** Create a new account or log in with existing credentials.
*   **Upload Documents:** Use the dashboard to upload PDF or TXT research documents. They will be processed in the background, and you can track their status.
*   **Chat with Documents:** Once a document is processed, click "Chat with Document" to ask questions and view conversation history.
*   **Manage Faculty Profiles:** Navigate to the "Faculty Profiles" section to upload Excel/CSV files of faculty data, view their profiles, generate research summaries, and export reports.
*   **Manage Account:** Use the "Settings" page to update your profile, change your password, or delete your account.

## Contributing

Contributions are welcome! Please feel free to fork the repository, create a new branch, and submit pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.