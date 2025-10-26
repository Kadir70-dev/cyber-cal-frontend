// src/lib/auth.ts
const TOKEN_KEY = 'cybercal_token';

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return (typeof window !== 'undefined') ? localStorage.getItem(TOKEN_KEY) : null;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
