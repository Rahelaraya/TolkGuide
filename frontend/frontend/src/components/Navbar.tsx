import { NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, logout, onAuthChanged } from "../auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [username, setUsername] = useState(localStorage.getItem("username"));

  useEffect(() => {
    return onAuthChanged(() => {
      setLoggedIn(isLoggedIn());
      setUsername(localStorage.getItem("username"));
    });
  }, []);

  return (
    <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
      <NavLink to="/" style={{ marginRight: 12 }}>Start</NavLink>
      <NavLink to="/bookings" style={{ marginRight: 12 }}>Bookings</NavLink>
      <NavLink to="/interpreters" style={{ marginRight: 12 }}>Interpreters</NavLink>

{!loggedIn && (
  <>
    <NavLink to="/login" style={{ marginRight: 12 }}>Logga in</NavLink>
    <NavLink to="/register" style={{ marginRight: 12 }}>Skapa konto</NavLink>
  </>
)}

{loggedIn && username && (
  <>
    <span style={{ marginLeft: 12, marginRight: 12, fontWeight: 700 }}>
      Välkommen, {username}
    </span>

    <button onClick={() => { logout(); navigate("/"); }}>
      Logga ut
    </button>
  </>
)}

    </div>
  );
}
