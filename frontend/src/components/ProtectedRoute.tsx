import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Skeleton className="w-1/2 h-12" />
        </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;