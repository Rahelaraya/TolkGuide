import { apiFetch } from "./http";

export type InterpreterDto = {
  id: string;
  fullName: string;
  city: string;
  languagesText: string;
  email?: string;
  phoneNumber?: string;
};

function getUserIdFromToken(): string | null {
  const t = localStorage.getItem("accessToken");
  if (!t) return null;
  try {
    const payload = JSON.parse(atob(t.split(".")[1]));
    return payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? null;
  } catch {
    return null;
  }
}

// ✅ används av HomePage
export function getInterpreters() {
  return apiFetch<InterpreterDto[]>("/api/Interpreters");
}

// ✅ hitta "min" interpreter genom listan (tills backend har /me)
export async function getMyInterpreterProfile() {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("Ingen userId i token");

  const all = await getInterpreters();

  // ⚠️ kräver att InterpreterDto har userId i backend.
  // Om den heter något annat (t.ex. userId / accountId) måste vi ändra raden nedan.
  const mine = (all as any[]).find((x) => x.userId === userId);

  if (!mine) {
    const err: any = new Error("Not Found");
    err.status = 404;
    throw err;
  }

  return apiFetch<InterpreterDto>(`/api/Interpreters/${mine.id}`);
}

export function createInterpreterProfile(body: Omit<InterpreterDto, "id">) {
  return apiFetch<InterpreterDto>("/api/Interpreters", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateMyInterpreterProfile(id: string, body: Partial<InterpreterDto>) {
  return apiFetch(`/api/Interpreters/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
