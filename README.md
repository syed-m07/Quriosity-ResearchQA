# ResearchQ&ABot

## Project Overview

ResearchQ&ABot is a full-stack application designed to facilitate research by providing a question-and-answer system powered by Retrieval Augmented Generation (RAG). It features a robust backend for managing documents and user interactions, a dynamic frontend for an intuitive user experience, and a Python-based RAG pipeline for intelligent information retrieval and response generation.

## Features

*   **User Authentication & Management:** Secure user registration, login, and profile management.
*   **Document Management:** Upload, store, and query research documents.
*   **Intelligent Q&A System:** Ask questions related to uploaded documents and receive accurate, context-aware answers.
*   **Conversation History:** Maintain a history of Q&A interactions for easy reference.
*   **Retrieval Augmented Generation (RAG):** Leverages advanced AI models to retrieve relevant information from documents and generate comprehensive answers.

## Technologies Used

### Backend
*   **Language:** Java
*   **Framework:** Spring Boot
*   **Build Tool:** Maven
*   **Security:** Spring Security, JWT (JSON Web Tokens) for authentication
*   **API:** RESTful API design

### Frontend
*   **Language:** TypeScript
*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn UI

### RAG/AI Component
*   **Language:** Python
*   **Libraries:** (Details will depend on `requirements.txt` and `rag_pipeline.py` content, but generally includes libraries for NLP, vector databases, and LLM integration)

### Database
*   (Please specify the database used, e.g., PostgreSQL, MySQL, H2, MongoDB. If not specified, a default embedded database might be used for development.)

## Project Structure

The project is organized into three main parts:

*   `backend/`: Contains the Spring Boot application, handling API endpoints, business logic, and data persistence.
*   `frontend/`: Contains the React.js application, providing the user interface and interacting with the backend API.
*   Root Directory (`./`): Contains Python scripts (`main.py`, `rag_pipeline.py`) for the RAG functionalities and project-level configuration files (`requirements.txt`, `.gitignore`).

## Setup and Installation

To get the ResearchQ&ABot up and running on your local machine, follow these steps:

### Prerequisites

Ensure you have the following installed:

*   **Java Development Kit (JDK):** Version 17 or higher.
*   **Maven:** For building the Java backend.
*   **Node.js:** Version 18 or higher (includes npm).
*   **Python:** Version 3.9 or higher.
*   **pip:** Python package installer.

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
The backend will typically run on `http://localhost:8080`.

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

You can then run the Python scripts as needed, for example:

```bash
python main.py
```
or
```bash
python rag_pipeline.py
```
(Specific usage of Python scripts will depend on their implementation.)

## Usage

Once both the backend and frontend are running, open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`).

*   **Register/Login:** Create a new account or log in with existing credentials.
*   **Upload Documents:** Use the document management interface to upload your research papers or other relevant documents.
*   **Ask Questions:** Navigate to the Q&A section and start asking questions. The system will retrieve information from your uploaded documents and provide answers.

## Contributing

Contributions are welcome! Please feel free to fork the repository, create a new branch, and submit pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
