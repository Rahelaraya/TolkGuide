import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../api/authApi";
import { setToken } from "../auth/token";

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as any)?.returnTo ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({
        username,
        password,
        role: "Customer",
      });

      setToken(res.accessToken, res.refreshToken);

      console.log("Saved accessToken?", !!localStorage.getItem("accessToken"));
      console.log("Saved refreshToken?", !!localStorage.getItem("refreshToken"));

      // ✅ HIT! efter lyckad login
      const role = "Interpreter"; // om du loggar in som tolk
      nav(role === "Interpreter" ? "/interpreter/profile" : "/profile", { replace: true });

      nav(returnTo, { replace: true });
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      setError(err?.message ?? "Inloggning misslyckades");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Logga in</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <button type="submit" disabled={loading || !username || !password}>
          {loading ? "Loggar in…" : "Logga in"}
        </button>
      </form>
    </div>
  );
}
