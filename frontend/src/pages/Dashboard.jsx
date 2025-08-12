import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDocuments, uploadDocument } from '../api/documents';

import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getDocuments(token);
        setDocuments(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch documents');
      }
    };
    fetchDocuments();
  }, [token]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const response = await uploadDocument(file, token);
      setDocuments([...documents, response.data]);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError('Failed to upload document');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-bold">Upload Document</h2>
          <input type="file" onChange={handleFileChange} className="mb-4" />
          <button
            onClick={handleUpload}
            className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Upload
          </button>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
        <div>
          <h2 className="mb-4 text-xl font-bold">Your Documents</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 bg-white rounded-lg shadow-md">
                <Link to={`/chat/${doc.id}`}>
                  <h3 className="font-bold text-indigo-600 hover:underline">{doc.fileName}</h3>
                </Link>
                <p>Status: {doc.status}</p>
                <p>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
