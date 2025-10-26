// src/utils/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}
