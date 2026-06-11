import { useState, useEffect, useCallback } from 'react';
import type { Client } from '@/types';
import { login as authLogin, logout as authLogout, getCurrentClient, updateBalance } from '@/data/auth';

export function useAuth() {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getCurrentClient();
    setClient(stored);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback((username: string, password: string): Client | null => {
    const result = authLogin(username, password);
    if (result) { setClient(result); return result; }
    return null;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setClient(null);
  }, []);

  /** Deduct amount from client's balance when ticket is processed */
  const deductBalance = useCallback((amount: number): boolean => {
    if (!client || client.balance < amount) return false;
    const updated = updateBalance(amount);
    if (updated) { setClient(updated); return true; }
    return false;
  }, [client]);

  return {
    client,
    isAuthenticated: !!client,
    isLoading,
    login,
    logout,
    deductBalance,
  };
}
