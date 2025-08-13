import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-2xl text-muted-foreground mb-8">Page Not Found</p>
      <Link to="/">
        <Button size="lg">Go to Homepage</Button>
      </Link>
    </div>
  );
};

export default NotFound;
