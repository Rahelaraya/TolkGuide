const TOKEN_KEY = "accessToken";

type Listener = () => void;
const listeners = new Set<Listener>();

export function notifyAuthChanged() {
  listeners.forEach((fn) => fn());
}

export function onAuthChanged(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}


export function setAuth(token: string, username: string, role: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem("username", username);
  if (role) localStorage.setItem("role", role);
  notifyAuthChanged();
}

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  notifyAuthChanged();
}
