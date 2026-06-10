import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

export default function App() {
  const { client, isAuthenticated, isLoading, login, logout } = useAuth();

  const handleLogin = useCallback(
    (username: string, password: string): boolean => {
      const result = login(username, password);
      return result !== null;
    },
    [login]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <HashRouter>
      <div className="min-h-[100dvh] bg-emerald-50">
        {/* Navbar - only show on dashboard when authenticated */}
        {isAuthenticated && client && (
          <Navbar client={client} onLogout={handleLogout} />
        )}

        {/* Add padding top when navbar is shown */}
        <div className={isAuthenticated ? 'pt-14 lg:pt-16' : ''}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/login"
                element={
                  <Login
                    isAuthenticated={isAuthenticated}
                    onLogin={handleLogin}
                  />
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    isLoading={isLoading}
                  >
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </HashRouter>
  );
}
