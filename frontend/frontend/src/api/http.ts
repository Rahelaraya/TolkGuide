import { getToken } from "../auth";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://localhost:7190";

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}
