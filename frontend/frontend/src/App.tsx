import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import { login, register } from "./api/authApi";
import { notifyAuthChanged } from "./auth";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";




const styles = {
  page: {
    minHeight: "100vh",
    background: "#faf7f8",
    color: "#111827",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
  } as React.CSSProperties,

  container: {
    maxWidth: 1150,
    margin: "0 auto",
    padding: "0 20px",
  } as React.CSSProperties,

  header: {
    position: "sticky" as const,
    top: 0,
    zIndex: 10,
    background: "rgba(250,247,248,0.85)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(17,24,39,0.08)",
  },

  headerInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 70,
    gap: 12,
  } as React.CSSProperties,

  brand: { display: "flex", alignItems: "center", gap: 10 } as React.CSSProperties,

  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 14,
    background: "#ff6b86",
    display: "grid",
    placeItems: "center",
    color: "white",
    fontWeight: 900,
    letterSpacing: 0.5,
    boxShadow: "0 10px 25px rgba(255,107,134,0.25)",
  } as React.CSSProperties,

  nav: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const } as React.CSSProperties,

  navLink: (active: boolean) =>
    ({
      textDecoration: "none",
      padding: "10px 12px",
      borderRadius: 12,
      color: active ? "#111827" : "rgba(17,24,39,0.75)",
      background: active ? "rgba(255,107,134,0.12)" : "transparent",
      border: "1px solid rgba(17,24,39,0.08)",
      fontWeight: 650,
    }) as React.CSSProperties,

  hero: {
    padding: "44px 0 18px",
  } as React.CSSProperties,

  h1: {
    fontSize: 54,
    lineHeight: 1.05,
    margin: 0,
    letterSpacing: -1,
  } as React.CSSProperties,

  subtitle: {
    marginTop: 14,
    maxWidth: 560,
    fontSize: 18,
    color: "rgba(17,24,39,0.75)",
    lineHeight: 1.5,
  } as React.CSSProperties,

  searchWrap: {
    marginTop: 22,
    background: "white",
    border: "1px solid rgba(17,24,39,0.10)",
    borderRadius: 22,
    padding: 10,
    display: "flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 16px 40px rgba(17,24,39,0.08)",
  } as React.CSSProperties,

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 16,
    padding: "12px 14px",
    background: "transparent",
  } as React.CSSProperties,

  searchBtn: {
    border: "none",
    cursor: "pointer",
    padding: "12px 16px",
    borderRadius: 18,
    background: "#ff6b86",
    color: "white",
    fontWeight: 800,
    boxShadow: "0 12px 25px rgba(255,107,134,0.28)",
  } as React.CSSProperties,

  chips: {
    marginTop: 14,
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 10,
  } as React.CSSProperties,

  chip: {
    background: "rgba(255,107,134,0.10)",
    border: "1px solid rgba(255,107,134,0.20)",
    padding: "9px 12px",
    borderRadius: 999,
    fontSize: 14,
    color: "rgba(17,24,39,0.85)",
    cursor: "pointer",
  } as React.CSSProperties,

  sectionTitle: {
    marginTop: 26,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 900,
  } as React.CSSProperties,

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
    paddingBottom: 40,
  } as React.CSSProperties,

  card: {
    background: "white",
    borderRadius: 22,
    overflow: "hidden",
    border: "1px solid rgba(17,24,39,0.08)",
    boxShadow: "0 14px 35px rgba(17,24,39,0.06)",
  } as React.CSSProperties,

  cardImg: {
    height: 160,
    background:
      "linear-gradient(135deg, rgba(255,107,134,0.25), rgba(120,160,255,0.18))",
  } as React.CSSProperties,

  cardBody: { padding: 14 } as React.CSSProperties,

  cardName: { fontSize: 18, fontWeight: 900, margin: 0 } as React.CSSProperties,

  cardMeta: { marginTop: 6, color: "rgba(17,24,39,0.70)", fontSize: 13 } as React.CSSProperties,

  badgeRow: { marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" as const } as React.CSSProperties,

  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(17,24,39,0.06)",
    border: "1px solid rgba(17,24,39,0.08)",
    color: "rgba(17,24,39,0.85)",
    fontWeight: 700,
  } as React.CSSProperties,

  badgeHot: {
    background: "rgba(255,107,134,0.12)",
    border: "1px solid rgba(255,107,134,0.22)",
    color: "#b4233b",
  } as React.CSSProperties,

  authCard: {
    maxWidth: 520,
    margin: "26px auto",
    background: "white",
    borderRadius: 22,
    padding: 18,
    border: "1px solid rgba(17,24,39,0.08)",
    boxShadow: "0 14px 35px rgba(17,24,39,0.06)",
  } as React.CSSProperties,

  field: {
    borderRadius: 14,
    padding: "12px 12px",
    border: "1px solid rgba(17,24,39,0.12)",
    outline: "none",
    fontSize: 15,
    width: "100%",
  } as React.CSSProperties,
};

type CardItem = {
  name: string;
  city: string;
  mode: string;
  tags: string[];
};

const demo: CardItem[] = [
 
  { name: "Tolkar", city: "Sök & visa", mode: "Interpreters", tags: ["Språk", "Stad", "Tillgänglig"] },
];


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bookings" element={<SimplePage title="Bookings" />} />
        <Route path="/interpreters" element={<SimplePage title="Tolkar" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.h1}>
            Hitta rätt tolk <br /> snabbt och enkelt
          </h1>
          <div style={styles.subtitle}>
            Skapa bokningar, filtrera tolkar efter språk och stad, och följ status på dina uppdrag.
          </div>

          <div style={styles.searchWrap}>
            <input style={styles.searchInput} placeholder='Sök: "Arabiska", "Stockholm", "Sjukhus"...' />
            <button style={styles.searchBtn}>Sök</button>
          </div>

          <div style={styles.chips}>
            <button style={styles.chip}>Bokningar</button>
            <button style={styles.chip}>Tolkar</button>
            <button style={styles.chip}>Språk</button>
            <button style={styles.chip}>På plats</button>
            <button style={styles.chip}>Online</button>
          </div>

          <div style={styles.sectionTitle}>Snabbgenvägar</div>
          <div style={styles.grid}>
            {demo.map((x) => (
              <div key={x.name} style={styles.card}>
                <div style={styles.cardImg} />
                <div style={styles.cardBody}>
                  <p style={styles.cardName}>{x.name}</p>
                  <div style={styles.cardMeta}>
                    {x.city} • {x.mode}
                  </div>

                  <div style={styles.badgeRow}>
                    {x.tags.map((t, i) => (
                      <span
                        key={t}
                        style={{
                          ...styles.badge,
                          ...(i === 0 ? styles.badgeHot : null),
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimplePage({ title }: { title: string }) {
  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={{ padding: "26px 0" }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 950 }}>{title}</h2>
          <p style={{ color: "rgba(17,24,39,0.72)" }}>
            Här bygger vi nästa steg (List + Create kopplat till API).
          </p>
        </div>
      </div>
    </div>
  );
}
function LoginPage() {
  const navigate = useNavigate();
 const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [role, setRole] = useState<"Customer" | "Interpreter">("Customer");
const [msg, setMsg] = useState("");


  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.authCard}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 950 }}>Logga in</h2>

   <form
  onSubmit={async (e) => {
    e.preventDefault();
    setMsg("");

   try {
  const tokenResponse = await login(username, password, role);

  localStorage.setItem("accessToken", tokenResponse.accessToken);
  localStorage.setItem("refreshToken", tokenResponse.refreshToken);
  localStorage.setItem("username", username); 

  notifyAuthChanged();
  navigate("/");

  setMsg("✅ Inloggad!");
} catch (err: any) {
  setMsg("❌ " + (err?.message ?? "Login failed"));
}

  }}
>

            <div style={{ marginTop: 14 }}>
              <label style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "rgba(17,24,39,0.75)", fontWeight: 700 }}>
                  Användarnamn
                </span>
                <input
                  style={styles.field}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>

<label style={{ display: "grid", gap: 6, marginBottom: 12 }}>
  <span style={{ fontSize: 13, color: "rgba(17,24,39,0.75)", fontWeight: 700 }}>
    Lösenord
  </span>
  <input
    style={styles.field}
    type="password"
    value={password}                 
    onChange={(e) => setPassword(e.target.value)} 
  />
</label>


              <button style={{ ...styles.searchBtn, width: "100%" }} type="submit">
                Logga in
              </button>

              {msg && <div style={{ marginTop: 12, fontWeight: 800 }}>{msg}</div>}

              <div style={{ marginTop: 12, fontSize: 14, color: "rgba(17,24,39,0.75)" }}>
                Har du inget konto? <Link to="/register">Skapa konto</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"Customer" | "Interpreter">("Customer");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.authCard}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 950 }}>Skapa konto</h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setMsg("");

              try {
                await register(username, password, role);
                setMsg("✅ Konto skapat! Nu kan du logga in.");
              } catch (err: any) {
                setMsg("❌ " + (err?.message ?? "Register failed"));
              }
            }}
          >
            <div style={{ marginTop: 14 }}>
              <label style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "rgba(17,24,39,0.75)", fontWeight: 700 }}>
                  Användarnamn
                </span>
                <input
                  style={styles.field}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>

              <label style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "rgba(17,24,39,0.75)", fontWeight: 700 }}>
                  Roll
                </span>
                <select
                  style={styles.field}
                  value={role}
                  onChange={(e) => setRole(e.target.value as "Customer" | "Interpreter")}
                >
                  <option value="Customer">Customer</option>
                  <option value="Interpreter">Interpreter</option>
                </select>
              </label>

              <label style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "rgba(17,24,39,0.75)", fontWeight: 700 }}>
                  Lösenord
                </span>
                <input
                  style={styles.field}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <button style={{ ...styles.searchBtn, width: "100%" }} type="submit">
                Skapa konto
              </button>

              {msg && <div style={{ marginTop: 12, fontWeight: 800 }}>{msg}</div>}

              <div style={{ marginTop: 12, fontSize: 14, color: "rgba(17,24,39,0.75)" }}>
                Har du redan konto? <Link to="/login">Logga in</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

