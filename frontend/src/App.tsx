import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/ProtectedRoute';
import LayoutWrapper from '@/components/LayoutWrapper';
import IndexPage from '@/pages/Index';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import DashboardPage from '@/pages/Dashboard';
import ChatPage from '@/pages/Chat';
import SettingsPage from '@/pages/Settings';
import FacultyPage from '@/pages/Faculty';
import FacultyDetailsPage from '@/pages/FacultyDetails';
import NotFound from '@/pages/NotFound';

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <DashboardPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:documentId"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <ChatPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <SettingsPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/faculty-profiles"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <FacultyPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty-profiles/:facultyId"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <FacultyDetailsPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
      <Toaster />
    </Router>
  );
}

export default App;
