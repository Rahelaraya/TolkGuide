import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "../api/authApi";

type Role = "Customer" | "Interpreter";

export default function RegisterPage() {
  const nav = useNavigate();

  const [role, setRole] = useState<Role>("Customer");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Backend tar bara dessa 3 fält
      await register({ username, password, role });

      // ✅ Logga in direkt efter registrering
      const res = await login({ username, password, role });
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      // ✅ Skicka till rätt profilsida
      nav(role === "Customer" ? "/profile" : "/interpreter/profile");
    } catch (e: any) {
      setError(e?.message ?? "Något gick fel");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="register-page">
    <div className="register-card">
      <h1 className="register-title">Skapa konto</h1>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Roll</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="Customer">Kund</option>
            <option value="Interpreter">Tolk</option>
          </select>
        </div>

        <div className="form-group">
          <label>Användarnamn</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Användarnamn"
          />
        </div>

        <div className="form-group">
          <label>Lösenord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="primary-btn">
          Skapa konto
        </button>
      </form>

      <p className="login-link">
        Har du redan konto? <Link to="/login">Logga in</Link>
      </p>
    </div>
  </div>
);
}
