const AUTH_EVENT = "auth_changed";

export function isLoggedIn() {
  return !!localStorage.getItem("accessToken");
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username"); 
  notifyAuthChanged();
}

export function onAuthChanged(handler: () => void) {
  window.addEventListener(AUTH_EVENT, handler);
  return () => window.removeEventListener(AUTH_EVENT, handler);
}
