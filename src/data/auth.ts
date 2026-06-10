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

  try {
    return JSON.parse(stored) as Client;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}
