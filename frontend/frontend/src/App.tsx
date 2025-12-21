
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import InterpretersPage from "./pages/InterpretersPage";
import InterpreterPublicProfile from "./pages/InterpreterPublicProfile";

import BookingsList from "./pages/BookingsList";
import CreateBooking from "./pages/CreateBooking";
import BookingDetail from "./pages/BookingDetail";


import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";


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


// import RegisterPage from "./pages/RegisterPage"; // om du har

export default function App() {
  return (
 <Routes>
  {/* Alla sidor MED navbar */}
  <Route element={<Layout />}>
    <Route path="/" element={<InterpretersPage />} />
    <Route path="/interpreters" element={<InterpretersPage />} />

    <Route path="/interpreters/:id" element={<InterpreterPublicProfile />} />

    <Route path="/bookings" element={<BookingsList />} />
    <Route path="/bookings/create" element={<CreateBooking />} />
    <Route path="/bookings/:id" element={<BookingDetail />} />

    
  </Route>

  {/* Auth-sidor (utan krav på login) */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* fallback */}
  <Route path="*" element={<div>Sidan finns inte</div>} />
</Routes>
  
)};






