import { setAuth } from "../auth";

const API_BASE = "https://localhost:7190/api/v1/auth";

type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  username?: string;
  role?: "Customer" | "Interpreter";
};

/* =========================
   REGISTER
   ========================= */
export async function register(
  username: string,
  password: string,
  role: "Customer" | "Interpreter"
) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  // oftast returnerar register inget viktigt
  return await res.json().catch(() => null);
}

/* =========================
   LOGIN
   ========================= */
export async function login(
  username: string,
  password: string,
  role: "Customer" | "Interpreter"
) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });

  if (!res.ok) throw new Error(await res.text());

  const data = (await res.json()) as LoginResponse;

  setAuth(
    data.accessToken,
    data.username ?? username,
    data.role ?? role
  );

  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  return data;
}


