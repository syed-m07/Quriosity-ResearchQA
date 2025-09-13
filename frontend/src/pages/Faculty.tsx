
import React, { useState } from 'react';
import { uploadFacultyList } from '@/lib/api';
import { FacultySummary } from '@/types/faculty';
import { NavLink } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const FacultyPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedSummaries, setProcessedSummaries] = useState<FacultySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

    setLoading(true);
    try {
      const response = await uploadFacultyList(selectedFile);
      setProcessedSummaries(response);
      toast.success('File uploaded and processed successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Faculty List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="faculty-file">Faculty Excel/CSV File</Label>
            <Input id="faculty-file" type="file" accept=".xlsx,.csv" onChange={handleFileChange} />
          </div>
          <Button onClick={handleUpload} disabled={!selectedFile || loading} className="mt-4">
            {loading ? 'Processing...' : 'Upload and Process'}
          </Button>
        </CardContent>
      </Card>

      {processedSummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Faculty Summaries</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {processedSummaries.map((summary) => (
                <li key={summary.faculty_id} className="flex justify-between items-center p-2 border rounded-md">
                  <NavLink to={`/faculty-profiles/${summary.faculty_id}`} className="text-blue-600 hover:underline">
                    <span>{summary.name}</span>
                  </NavLink>
                  <span className="text-sm text-gray-500">{summary.publication_count} publications</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FacultyPage;
