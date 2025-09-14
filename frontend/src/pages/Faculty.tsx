
import React, { useState, useEffect, useRef } from 'react';
import { uploadFacultyList, getFacultyBatches, getFacultySummariesForBatch, deleteFacultyBatch } from '@/lib/api';
import { FacultySummary, FacultyUploadBatch } from '@/types/faculty';
import { NavLink } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2, Loader2 } from 'lucide-react';

const FacultyPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [articlesLimit, setArticlesLimit] = useState<string>('20'); // Default to 20
  const [uploading, setUploading] = useState<boolean>(false);
  const [batches, setBatches] = useState<FacultyUploadBatch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState<boolean>(true);
  const [summaries, setSummaries] = useState<Record<number, FacultySummary[]>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBatches = async () => {
    try {
      const data = await getFacultyBatches();
      setBatches(data);
    } catch (error) {
      console.error('Error fetching batches:', error);
      toast.error('Failed to load uploaded batches.');
    } finally {
      setLoadingBatches(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }
    const limit = articlesLimit ? parseInt(articlesLimit, 10) : undefined;
    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
        toast.error('Please enter a valid number for the articles limit.');
        return;
    }

    setUploading(true);
    try {
      await uploadFacultyList(selectedFile, limit);
      toast.success('File processing started! The batch will appear below shortly.');
      // Reset file input
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedFile(null);
      // Refresh the list of batches after a short delay to allow processing to start
      setTimeout(fetchBatches, 2000);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAccordionChange = async (batchId: string) => {
    const id = Number(batchId);
    if (id && !summaries[id]) { // Fetch only if not already fetched
      setLoadingSummaries(prev => ({ ...prev, [id]: true }));
      try {
        const data = await getFacultySummariesForBatch(id);
        setSummaries(prev => ({ ...prev, [id]: data }));
      } catch (error) {
        console.error(`Error fetching summaries for batch ${id}:`, error);
        toast.error(`Failed to load details for batch ${id}.`);
      } finally {
        setLoadingSummaries(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const handleDeleteBatch = async (batchId: number) => {
    try {
      await deleteFacultyBatch(batchId);
      toast.success('Batch deleted successfully!');
      setBatches(batches.filter(b => b.id !== batchId));
    } catch (error) {
      console.error(`Error deleting batch ${batchId}:`, error);
      toast.error('Failed to delete batch.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Faculty List</CardTitle>
          <CardDescription>Upload an Excel or CSV file containing faculty names and IDs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="grid w-full items-center gap-1.5 sm:col-span-2">
              <Label htmlFor="faculty-file">Faculty File</Label>
              <Input id="faculty-file" type="file" accept=".xlsx,.csv" onChange={handleFileChange} ref={fileInputRef} />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="articles-limit">Articles Limit</Label>
              <Input id="articles-limit" type="number" placeholder="e.g., 20" value={articlesLimit} onChange={(e) => setArticlesLimit(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="mt-4">
            {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Upload and Process'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Batches</CardTitle>
          <CardDescription>View and manage your uploaded faculty lists.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingBatches ? (
            <p>Loading batches...</p>
          ) : batches.length === 0 ? (
            <p>No batches uploaded yet.</p>
          ) : (
            <Accordion type="single" collapsible onValueChange={handleAccordionChange}>
              {batches.map(batch => (
                <AccordionItem value={String(batch.id)} key={batch.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between items-center w-full pr-4">
                      <span>{batch.fileName}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(batch.uploadDate).toLocaleDateString()} - {batch.facultyCount} faculty
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {loadingSummaries[batch.id] ? (
                      <p>Loading faculty...</p>
                    ) : (
                      <ul className="space-y-2 pl-4">
                        {(summaries[batch.id] || []).map(summary => (
                          <li key={summary.faculty_id} className="flex justify-between items-center p-2 border-b">
                            <NavLink to={`/faculty-profiles/${summary.faculty_id}`} className="text-blue-600 hover:underline">
                              {summary.name}
                            </NavLink>
                            <span className="text-sm text-gray-500">{summary.publication_count} publications</span>
                          </li>
                        ))}
                      </ul>
                    )}
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="mt-4 ml-4"> <Trash2 className="mr-2 h-4 w-4" /> Delete Batch</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the batch "{batch.fileName}" and all associated faculty data. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteBatch(batch.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyPage;
