I need to code the frontend for this application now, 
1. Core Application Functionality


  The application is a "Research RAG Bot" that allows users to:
   * Authenticate: Register, log in, and log out. User sessions are managed via JWT (Access and Refresh tokens).
   * Manage Profile: Users can view their profile, update their name, change their password, and delete their account.
   * Upload Documents: Users can upload documents (e.g., PDFs). The backend processes these files via a Python service.
   * Q&A with Documents: After uploading a document, users can ask questions about its content. The backend queries the Python RAG service to get answers.
   * View Chat History: Users can see a history of their past questions and answers for each document.

  2. Backend API Configuration


   * Base URL: The Spring Boot backend runs on http://localhost:8081.
   * Python RAG Service: The core AI/ML service runs on http://localhost:8000. The frontend does not need to interact with this directly; it communicates only with the Spring Boot API.
   * CORS: Cross-Origin Resource Sharing will likely be an issue. During development, you should configure your frontend development server to proxy API requests from its own origin (e.g.,
     localhost:3000) to the backend at http://localhost:8081.

  3. Authentication Flow

  The API uses JWT for authentication. The flow is as follows:


   1. Register/Login:
       * POST /api/v1/auth/register: New users register with first name, last name, email, and password.
       * POST /api/v1/auth/authenticate: Existing users log in with email and password.
       * Response (for both): A JSON object containing an access_token and a refresh_token.

   1         {
   2             "access_token": "eyJhbGciOiJIUzI1NiJ9...",
   3             "refresh_token": "eyJhbGciOiJIUzI1NiJ9..."
   4         }



   2. Making Authenticated Requests:
       * For any protected endpoint, the frontend must include the access_token in the request header:
          Authorization: Bearer <access_token>


   3. Token Refresh:
       * The access_token is short-lived (24 hours). When it expires, API calls will fail (likely with a 401 or 403 status).
       * To get a new access_token without forcing the user to log in again, make a call to:
          POST /api/v1/auth/refresh-token
       * This request must include the long-lived refresh_token in the Authorization: Bearer <refresh_token> header.
       * The response will contain a new access_token and the same refresh_token.


   4. Logout:
       * POST /api/v1/auth/logout: Call this endpoint with the current access_token to invalidate the session on the server.

  4. Key API Endpoints & Data Models

  Here are the primary endpoints the frontend will interact with:

  User Management


   * Get Profile: GET /api/v1/users/me
   * Update Profile: PUT /api/v1/users/me
       * Request Body: { "firstName": "John", "lastName": "Doe" }
   * Change Password: PATCH /api/v1/users/password
       * Request Body: { "currentPassword": "...", "newPassword": "...", "confirmationPassword": "..." }

  Document & Q&A Flow


   1. Upload a Document:
       * POST /api/v1/documents
       * Request Type: multipart/form-data. The request should contain a single part with the key "file".
       * Response (DocumentMetadataDto):


   1         {
   2             "id": 1,
   3             "fileName": "my_research_paper.pdf",
   4             "uploadDate": "2025-08-11T10:30:00Z",
   5             "status": "COMPLETED",
   6             "pythonDocumentId": "a1b2c3d4-e5f6-..."
   7         }


   2. Ask a Question:
       * POST /api/v1/qa/ask
       * Request Body (QaRequest):


   1         {
   2             "question": "What were the main findings?",
   3             "documentId": 1
   4         }

       * Response (QaResponse):


    1         {
    2             "answer": "The main findings were related to...",
    3             "sources": [
    4                 {
    5                     "text": "This is a relevant snippet from the document...",
    6                     "metadata": "{'page': 5}",
    7                     "relevance_score": 0.92
    8                 }
    9             ],
   10             "success": true,
   11             "document_id": "a1b2c3d4-e5f6-..."
   12         }


   3. Get Chat History for a Document:
       * GET /api/v1/qa/history/{documentId}
       * Response (List of QaHistoryResponse):


    1         [
    2             {
    3                 "question": "What is this document about?",
    4                 "answer": "This document is about...",
    5                 "timestamp": "2025-08-11T11:00:00Z"
    6             },
    7             {
    8                 "question": "What were the main findings?",
    9                 "answer": "The main findings were...",
   10                 "timestamp": "2025-08-11T11:05:00Z"
   11             }
   12         ]


  5. Proposed Frontend Workflow


   1. Login/Register Page: The entry point for users.
   2. Dashboard: After login, the user sees a list of their previously uploaded documents.
   3. File Upload: A prominent "Upload" button allows users to select and upload a new document. The UI should show the upload progress and then update the document's status from PROCESSING to
      COMPLETED.
   4. Chat View: Clicking on a document navigates to the main Q&A interface.
       * This view should have a chat window displaying the history (fetched from /api/v1/qa/history/{id}).
       * An input box at the bottom allows the user to type and submit new questions.
       * When a question is submitted, the answer and its sources are fetched and displayed in the chat window.



This is all I would need to start coding for the front end part, I need you to guide me on creating a usable ux and good looking UI, in react and tailwind css. note that this is my first time coding in btoh althoyugh I have had a little bit experience in HTML CSS AND JS

LLM RESPONSE --

Step 1 – Big Picture UX Flow
Think of your UI as three main “spaces” the user can live in:

Auth Pages (Login & Register)

Minimal, clean forms with a centered card.

Clear headings (“Sign In” / “Create Account”).

Error messages for wrong credentials.

Dashboard

A list/grid of uploaded documents.

An "Upload Document" button at the top-right.

Each document card shows:

Name

Upload date

Status (PROCESSING or COMPLETED) with a colored badge.

Q&A Chat View

Left: Chat messages (alternating user & bot).

Bottom: Input field + send button.

Above chat: Document name and "Back to Dashboard" button.

Optional: small "Sources" section for answers with citations.

Step 2 – React Folder Structure
Here’s a clean frontend file structure for this project:

pgsql
Copy
Edit
frontend/
├── src/
│   ├── api/
│   │   ├── auth.js           # Login, register, token refresh calls
│   │   ├── documents.js      # Upload, list docs
│   │   ├── qa.js             # Ask questions, get history
│   │
│   ├── components/
│   │   ├── AuthForm.jsx      # Reusable login/register form
│   │   ├── Navbar.jsx
│   │   ├── DocumentCard.jsx
│   │   ├── ChatMessage.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ChatView.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js        # Manages tokens, refresh logic
│   │
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│
├── package.json
Step 3 – Tailwind Setup
Run:

bash
Copy
Edit
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
Edit tailwind.config.js:

js
Copy
Edit
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}"
],
theme: { extend: {} },
plugins: [],
In index.css:

css
Copy
Edit
@tailwind base;
@tailwind components;
@tailwind utilities;
Step 4 – Key UI Components
1. Navbar

Fixed top, white background, drop shadow.

Links: Dashboard, Profile, Logout.

2. Auth Form

Card in the center.

Tailwind classes like:

jsx
Copy
Edit
<div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
3. Document Card

Rounded rectangle with title, status badge.

Example badge colors:

jsx
Copy
Edit
<span className={`px-2 py-1 rounded-full text-xs font-bold ${
  status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
}`}>
4. Chat Interface

Messages aligned left (bot) / right (user).

Bot messages in gray bubble, user in blue bubble.

Scrollable chat area.

Step 5 – Suggested Color Palette
Primary: #2563eb (Tailwind: blue-600)

Secondary: #1e293b (Tailwind: slate-800)

Background: #f8fafc (Tailwind: slate-50)

Accent for status: green-500, yellow-500

Step 6 – Recommended Tech for State & API Calls
React Router for page navigation.

Axios for API calls.

LocalStorage for storing tokens.

React Query (optional but nice) for caching API calls.