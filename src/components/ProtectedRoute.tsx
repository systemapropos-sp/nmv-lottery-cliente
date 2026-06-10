import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  children: ReactNode;
}

export function ProtectedRoute({ isAuthenticated, isLoading, children }: ProtectedRouteProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-emerald-50">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
