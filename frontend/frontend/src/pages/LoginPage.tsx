import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../api/authApi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState<"Customer" | "Interpreter">("Customer");

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login(username, password,role);
     navigate("/");
    } catch {
      setError("Fel användarnamn eller lösenord");
    }
  }



  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <h2>Logga in</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Användarnamn
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Lösenord
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "#db2777", marginTop: 8 }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 999,
            border: "none",
            background: "#ec4899",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Logga in
        </button>
      </form>
    </div>
  );
}
