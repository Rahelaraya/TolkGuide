import { getUsernameFromToken } from "./jwt";

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function isLoggedIn() {
  return !!getAccessToken();
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function getLoggedInName(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  return getUsernameFromToken(token);
}
