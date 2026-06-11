import { HashRouter, Routes, Route } from 'react-router-dom';
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

export default function App() {
  const { isAuthenticated, isLoading, login } = useAuth();

  const handleLogin = useCallback(
    (username: string, password: string): boolean => {
      const result = login(username, password);
      return result !== null;
    },
    [login]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center" style={{ backgroundColor: '#0d9488' }}>
        <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Authenticated
  return (
    <HashRouter>
      <div className="h-[100dvh] overflow-y-auto bg-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
