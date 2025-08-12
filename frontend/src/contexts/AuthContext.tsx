import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';
import { getMyInfo, logout as logoutApi } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const currentToken = localStorage.getItem('accessToken');
      if (currentToken) {
        try {
          const { data } = await getMyInfo();
          setUser(data);
        } catch (error) {
          console.error('Failed to fetch user info, logging out', error);
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (accessToken: string, refreshToken: string) => {
    setToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const handleLogout = async () => {
    try {
        await logoutApi();
    } catch (error) {
        console.error('Logout failed on server, clearing client session anyway.', error);
    } finally {
        setUser(null);
        setToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
