import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFacultyProfile, getFacultyArticles, getFacultySummary, exportFacultyProfile } from '@/lib/api';
import { FacultyProfile, Article } from '@/types/faculty';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ChevronLeft, Loader2, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const PAGE_SIZE = 20;

const FacultyDetailsPage: React.FC = () => {
  const { facultyId } = useParams<{ facultyId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [loadingArticles, setLoadingArticles] = useState<boolean>(false);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMoreArticles, setHasMoreArticles] = useState<boolean>(true);
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!facultyId) return;
      setLoadingProfile(true);
      try {
        const data = await getFacultyProfile(facultyId);
        setProfile(data);
        if (data.summary) {
            setSummary(data.summary);
        }
        fetchArticles(0);
      } catch (error) {
        console.error('Error fetching faculty profile:', error);
        toast.error('Failed to load faculty profile.');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [facultyId]);

  const fetchArticles = async (page: number) => {
    if (!facultyId) return;
    setLoadingArticles(true);
    try {
      const newArticles = await getFacultyArticles(facultyId, page, PAGE_SIZE);
      setArticles((prev) => (page === 0 ? newArticles : [...prev, ...newArticles]));
      setCurrentPage(page);
      setHasMoreArticles(newArticles.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles.');
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleLoadMore = () => {
    fetchArticles(currentPage + 1);
  };

  const handleGenerateSummary = async () => {
    if (!facultyId) return;
    setLoadingSummary(true);
    try {
        const from = fromYear ? parseInt(fromYear) : undefined;
        const to = toYear ? parseInt(toYear) : undefined;
        const result = await getFacultySummary(facultyId, from, to);
        setSummary(result);
        toast.success('Summary generated successfully!');
    } catch (error) {
        console.error('Error generating summary:', error);
        toast.error('Failed to generate summary.');
    } finally {
        setLoadingSummary(false);
    }
  };

  const handleExport = async (format: 'excel' | 'word') => {
    if (!facultyId) return;
    setIsExporting(true);
    toast.info(`Generating ${format} report...`);
    try {
        const response = await exportFacultyProfile(facultyId, format);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const contentDisposition = response.headers['content-disposition'];
        let fileName = `faculty-${facultyId}-report.${format === 'word' ? 'docx' : 'xlsx'}`;
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
            if (fileNameMatch.length === 2)
                fileName = fileNameMatch[1];
        }
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success('Report downloaded successfully!');
    } catch (error) {
        console.error(`Error exporting ${format} report:`, error);
        toast.error(`Failed to export ${format} report.`);
    } finally {
        setIsExporting(false);
    }
  };

  if (loadingProfile) {
    return <div className="container mx-auto p-4 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="container mx-auto p-4 text-center">Faculty profile not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Faculty List
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isExporting}>
                    {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('excel')}>Export as Excel (.xlsx)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('word')}>Export as Word (.docx)</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile.thumbnail} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl">{profile.name}</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">{profile.affiliations}</p>
            {profile.google_scholar_author_id && (
              <p className="text-sm text-gray-500">Google Scholar ID: {profile.google_scholar_author_id}</p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <h3 className="font-semibold">Total Citations</h3>
              <p>{profile.total_citations?.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">H-Index</h3>
              <p>{profile.h_index}</p>
            </div>
            <div>
              <h3 className="font-semibold">i10-Index</h3>
              <p>{profile.i10_index}</p>
            </div>
          </div>
          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">{interest}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
            <CardTitle>Research Summary</CardTitle>
            <CardDescription>Generate a narrative summary of the faculty's publications.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end mb-4">
                <div className="grid w-full sm:w-1/4 items-center gap-1.5">
                    <Label htmlFor="fromYear">From Year</Label>
                    <Input id="fromYear" type="number" placeholder="e.g., 2015" value={fromYear} onChange={(e) => setFromYear(e.target.value)} />
                </div>
                <div className="grid w-full sm:w-1/4 items-center gap-1.5">
                    <Label htmlFor="toYear">To Year</Label>
                    <Input id="toYear" type="number" placeholder="e.g., 2023" value={toYear} onChange={(e) => setToYear(e.target.value)} />
                </div>
                <Button onClick={handleGenerateSummary} disabled={loadingSummary}>
                    {loadingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Generate Summary
                </Button>
            </div>
            {loadingSummary ? (
                <p>Generating summary...</p>
            ) : summary ? (
                <p className="text-muted-foreground p-4 border rounded-md bg-secondary/50">{summary}</p>
            ) : (
                <p className="text-muted-foreground">Click the button to generate a summary.</p>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publications ({articles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length === 0 && !loadingArticles ? (
            <p>No articles found.</p>
          ) : (
            <ul className="space-y-4">
              {articles.map((article, index) => (
                <li key={index} className="p-4 border rounded-md">
                  <h3 className="text-lg font-semibold"><a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{article.title}</a></h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{article.authors}</p>
                  <p className="text-sm text-gray-500">{article.publication} ({article.year})</p>
                  <p className="text-sm text-gray-500">Cited by: {article.citations?.toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
          {hasMoreArticles && (
            <div className="text-center mt-4">
              <Button onClick={handleLoadMore} disabled={loadingArticles}>
                {loadingArticles ? 'Loading...' : 'Load More Articles'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDetailsPage;