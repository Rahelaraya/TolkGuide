import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { logout, isLoggedIn, getLoggedInName } from "../auth/auth";

export default function Navbar() {
  const nav = useNavigate();
  const loggedIn = isLoggedIn();
  const name = getLoggedInName();

  function handleLogout() {
    logout();
    nav("/", { replace: true });
    window.location.reload(); // snabb fix så navbar uppdateras direkt
  }

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link className="brand" to="/">
          Tolkguide
        </Link>

        <nav className="topbar__links">
{loggedIn ? (
  <>
    <span className="topbar__greeting">Hej {name ?? ""}!</span>
    <Link className="cta" to="/profile">Min profil</Link>
    <Link to="/bookings">Mina bokningar</Link>
  

    <button className="cta" type="button" onClick={handleLogout}>
      Logga ut
    </button>
  </>
) : (
  <>
    <Link to="/login">Logga in</Link>
    <Link to="/register">Skapa konto</Link>
   
  </>
)}
        </nav>
      </div>
    </header>
  );
}
