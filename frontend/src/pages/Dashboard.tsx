import { useState, useEffect } from 'react';
import { getDocuments, uploadDocument } from '@/lib/api';
import { Document } from '@/types/document';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const response = await getDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents.');
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    try {
      const newDocument = await uploadDocument(file);
      setDocuments((prevDocs) => [...prevDocs, newDocument.data]);
      setFile(null);
      toast.success('Document uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <Input type="file" onChange={handleFileChange} className="flex-1" />
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">My Documents</h2>
      {isLoadingDocs ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <p className="text-muted-foreground">No documents uploaded yet. Upload one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="text-lg">{doc.fileName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Status: {doc.status}</p>
                <p className="text-sm text-muted-foreground">
                  Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                </p>
                <Link to={`/chat/${doc.id}`}>
                  <Button variant="outline" className="mt-4 w-full">
                    <MessageSquare className="mr-2 h-4 w-4" /> Chat with Document
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
