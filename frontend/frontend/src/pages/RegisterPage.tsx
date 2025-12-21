import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Customer" | "Interpreter">("Customer");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      await register(username, password, role);
      setMsg("✅ Konto skapat! Nu kan du logga in.");
      setTimeout(() => navigate("/login"), 700);
    } catch (err: any) {
      setMsg("❌ " + (err?.message ?? "Register failed"));
    }
  }



  return (
    <div style={{ maxWidth: 560, margin: "60px auto", padding: 16 }}>
      <div
        style={{
          background: "white",
          borderRadius: 18,
          border: "1px solid #f3d3e1",
          padding: 22,
          boxShadow: "0 12px 30px rgba(17,24,39,0.08)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 950, color: "#111827" }}>
          Skapa konto
        </h2>
        <p style={{ marginTop: 8, color: "#6b7280" }}>
          Välj roll och skapa ditt konto.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6, color: "#111827", fontWeight: 700 }}>
              Användarnamn
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="t.ex. sami"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#fff",
                color: "#111827",
                caretColor: "#111827",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6, color: "#111827", fontWeight: 700 }}>
              Lösenord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#fff",
                color: "#111827",
                caretColor: "#111827",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6, color: "#111827", fontWeight: 700 }}>
              Roll
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#fff",
                color: "#111827",
              }}
            >
              <option value="Customer">Customer</option>
              <option value="Interpreter">Interpreter</option>
            </select>
          </div>

          {msg && (
            <p style={{ marginTop: 10, color: msg.startsWith("✅") ? "#047857" : "#db2777" }}>
              {msg}
            </p>
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
              fontWeight: 800,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            Skapa konto
          </button>
        </form>
      </div>
    </div>
  );
}
