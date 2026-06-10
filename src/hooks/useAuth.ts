import { useState, useEffect, useCallback } from 'react';
import type { Client } from '@/types';
import { login as authLogin, logout as authLogout, getCurrentClient } from '@/data/auth';

export function useAuth() {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getCurrentClient();
    setClient(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): Client | null => {
    const result = authLogin(username, password);
    if (result) {
      setClient(result);
      return result;
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setClient(null);
  }, []);

  const isAuthenticated = !!client;

  return {
    client,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
