import type { Client } from '@/types';
import { mockClients, MOCK_PASSWORD } from './mockClients';

const STORAGE_KEY = 'nmv_client_session';

export function login(username: string, password: string): Client | null {
  const client = mockClients.find(
    (c) => c.username === username && password === MOCK_PASSWORD
  );

  if (client) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(client));
    return client;
  }

  return null;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentClient(): Client | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored) as Client; }
  catch { localStorage.removeItem(STORAGE_KEY); return null; }
}

/** Deduct amount from stored client's balance */
export function updateBalance(deduction: number): Client | null {
  const stored = getCurrentClient();
  if (!stored) return null;
  const updated: Client = { ...stored, balance: Math.max(0, stored.balance - deduction) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
