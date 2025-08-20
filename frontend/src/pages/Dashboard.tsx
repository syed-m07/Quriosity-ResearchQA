import { useState, useEffect } from 'react';
import { deleteDocument, getDocuments, uploadDocument } from '@/lib/api';
import { Document } from '@/types/document';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud, MessageSquare, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  const fetchDocuments = async (isBackground = false) => {
    if (!isBackground) {
        setIsLoadingDocs(true);
    }
    try {
      const response = await getDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      if (!isBackground) {
        toast.error('Failed to load documents.');
      }
    } finally {
      if (!isBackground) {
        setIsLoadingDocs(false);
      }
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const isProcessing = documents.some(doc => doc.status === 'PROCESSING' || doc.status === 'UPLOADING');
    if (isProcessing) {
      const intervalId = setInterval(() => {
        fetchDocuments(true); // Poll in the background
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(intervalId); // Cleanup on re-render or unmount
    }
  }, [documents]);

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
      // Add the new document with PROCESSING status to the list immediately
      setDocuments((prevDocs) => [...prevDocs, newDocument.data]);
      setFile(null);
      toast.success('Upload started! Processing in the background.');
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to start document upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: number) => {
    try {
      await deleteDocument(documentId);
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== documentId));
      toast.success('Document deleted successfully!');
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document. Please try again.');
    }
  };

  const renderStatus = (status: Document['status']) => {
    switch (status) {
        case 'UPLOADING':
            return <span className="flex items-center text-gray-500"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading</span>;
        case 'PROCESSING':
            return <span className="flex items-center text-blue-500"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing</span>;
        case 'COMPLETED':
            return <span className="flex items-center text-green-500"><CheckCircle2 className="mr-2 h-4 w-4" />Completed</span>;
        case 'FAILED':
            return <span className="flex items-center text-red-500"><XCircle className="mr-2 h-4 w-4" />Failed</span>;
        default:
            return <span className="flex items-center text-gray-500">{status}</span>;
    }
  }

  return (
    <div className="p-4 h-full overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <Input type="file" onChange={handleFileChange} className="flex-1" disabled={isUploading} />
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isUploading ? 'Starting Upload...' : 'Upload Document'}
          </Button>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">My Documents</h2>
      {isLoadingDocs ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
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
              <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle className="text-lg truncate" title={doc.fileName}>{doc.fileName}</CardTitle>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        document and all associated chat history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(doc.id)} className={buttonVariants({ variant: "destructive" })}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-1">Status: {renderStatus(doc.status)}</div>
                <p className="text-sm text-muted-foreground">
                  Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                </p>
                <Link to={`/chat/${doc.id}`} onClick={(e) => doc.status !== 'COMPLETED' && e.preventDefault()}>
                  <Button variant="outline" className="mt-4 w-full" disabled={doc.status !== 'COMPLETED'}>
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