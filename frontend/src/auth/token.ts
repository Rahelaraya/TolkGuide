const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export function getToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function setToken(accessToken: string, refreshToken?: string) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearToken() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
