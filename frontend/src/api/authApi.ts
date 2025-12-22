const API_BASE = import.meta.env.VITE_API_URL as string;

type Role = "Customer" | "Interpreter"; // använd exakt det backend förväntar sig
type AuthResponse = { accessToken: string; refreshToken: string };

export async function register(body: { username: string; password: string; role: Role }) {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
}

export async function login(body: { username: string; password: string; role: Role }): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}

