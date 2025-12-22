
import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../auth/auth";

function getRoleFromToken(): "Customer" | "Interpreter" | null {
  const t = localStorage.getItem("accessToken");
  if (!t) return null;

  try {
    const payload = JSON.parse(atob(t.split(".")[1]));
    // vanligt claim för role:
    const role =
      payload?.role ??
      payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === "Customer" || role === "Interpreter") return role;
    return null;
  } catch {
    return null;
  }
}

export default function RoleHomeRedirect() {
  const loggedIn = isLoggedIn();
  const location = useLocation();

  if (!loggedIn) return <Navigate to="/login" replace />;

  const role = getRoleFromToken();
  const wantBookings = location.pathname.includes("bookings");

  if (role === "Interpreter") {
    return (
      <Navigate
        to={wantBookings ? "/interpreter/bookings" : "/interpreter/profile"}
        replace
      />
    );
  }

  return (
    <Navigate
      to={wantBookings ? "/customer/bookings" : "/customer/profile"}
      replace
    />
  );
}


