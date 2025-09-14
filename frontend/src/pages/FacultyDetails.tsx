
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFacultyProfile, getFacultyArticles } from '@/lib/api';
import { FacultyProfile, Article } from '@/types/faculty';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

const PAGE_SIZE = 20; // Number of articles per page

const FacultyDetailsPage: React.FC = () => {
  const { facultyId } = useParams<{ facultyId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [loadingArticles, setLoadingArticles] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMoreArticles, setHasMoreArticles] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!facultyId) return;
      setLoadingProfile(true);
      try {
        const data = await getFacultyProfile(facultyId);
        setProfile(data);
        // Initial fetch of articles for the first page
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
      setArticles((prevArticles) => (page === 0 ? newArticles : [...prevArticles, ...newArticles]));
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

  if (loadingProfile) {
    return <div className="container mx-auto p-4 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="container mx-auto p-4 text-center">Faculty profile not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
        <Button variant="outline" size="sm" className="mb-4" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Faculty List
        </Button>
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
          {/* TODO: Add export buttons */}
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
