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
import NotFound from '@/pages/NotFound';
import DemoNotice from '@/components/DemoNotice';

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
        </Routes>
      </AuthProvider>
      <Toaster />
    </Router>
  );
}

export default App;
