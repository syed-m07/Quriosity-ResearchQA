import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getHistory, askQuestion } from '../api/qa';

const ChatView = () => {
  const { documentId } = useParams();
  const [history, setHistory] = useState([]);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory(documentId, token);
        setHistory(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch chat history');
      }
    };
    fetchHistory();
  }, [documentId, token]);

  const handleAskQuestion = async () => {
    if (!question) return;
    try {
      const response = await askQuestion({ documentId, question }, token);
      setHistory([...history, { question, answer: response.data.answer }]);
      setQuestion('');
    } catch (err) {
      console.error(err);
      setError('Failed to ask question');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="p-4 bg-white shadow-md">
        <Link to="/dashboard" className="text-indigo-600 hover:underline">Back to Dashboard</Link>
        <h1 className="text-xl font-bold">Chat with Document {documentId}</h1>
      </header>
      <main className="flex-1 p-4 overflow-y-auto min-h-0">
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index}>
              <div className="p-2 text-white bg-blue-500 rounded-lg self-end">{item.question}</div>
              <div className="p-2 mt-1 text-gray-800 bg-gray-300 rounded-lg self-start">{item.answer}</div>
            </div>
          ))}
        </div>
      </main>
      <footer className="p-4 bg-white">
        <div className="flex">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ask a question..."
          />
          <button
            onClick={handleAskQuestion}
            className="px-4 py-2 ml-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Send
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </footer>
    </div>
  );
};

export default ChatView;
