const API_BASE = "https://localhost:7190/api/v1/auth";

export async function login(
  username: string,
  password: string,
  role: "Customer" | "Interpreter"
) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      role, // ✅ VIKTIG
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


export async function register(
  username: string,
  password: string,
  role: "Customer" | "Interpreter"
) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      role,
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

