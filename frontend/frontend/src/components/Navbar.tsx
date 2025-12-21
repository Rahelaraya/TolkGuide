import { NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, logout, onAuthChanged } from "../auth";
import { useEffect, useState } from "react";
import "./Navbar.css";

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
  <nav className="navbar">
    <div className="nav-left">
      <NavLink to="/" className="brand">
        TolkGuide
      </NavLink>

      {loggedIn && (
        <>
          <NavLink to="/bookings">Bookings</NavLink>
          <NavLink to="/interpreters">Interpreters</NavLink>
         
        </>
      )}
    </div>

    <div className="nav-right">
      {!loggedIn ? (
        <>
          <NavLink to="/login">Logga in</NavLink>
          <NavLink to="/register">Skapa konto</NavLink>
        </>
      ) : (
        <>
          <span className="welcome">Välkommen, {username ?? ""}</span>
          <button
            className="logoutBtn"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logga ut
          </button>
        </>
      )}
    </div>
  </nav>
)};
