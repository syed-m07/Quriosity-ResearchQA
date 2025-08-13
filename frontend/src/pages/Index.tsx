import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { token } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-5xl font-bold mb-6">Welcome to ResearchRAG</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
        Upload your research papers and chat with them. Get instant answers and insights from your documents.
      </p>
      <div className="space-x-4">
        {token ? (
          <Link to="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <Button size="lg" variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="lg">Register</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
