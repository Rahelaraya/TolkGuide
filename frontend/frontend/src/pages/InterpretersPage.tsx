import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/http";
import { Link } from "react-router-dom";


type InterpreterDto = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  languages: string[];
};

export default function InterpretersPage() {
  const [items, setItems] = useState<InterpreterDto[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setErr("");

    apiFetch<InterpreterDto[]>("/api/Interpreters")
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setErr(e?.message ?? "Något gick fel"))
      .finally(() => setLoading(false));
  }, []);

  // Rensar bort "string"/tomma rader
  const cleanItems = useMemo(() => {
    return items.filter((i) => {
      const name = (i.fullName ?? "").trim();
      const city = (i.city ?? "").trim();
      return (
        name.length > 0 &&
        city.length > 0 &&
        name.toLowerCase() !== "string" &&
        city.toLowerCase() !== "string"
      );
    });
  }, [items]);

  return (
    <div className="container">
      <div className="card">
        <h1 className="h1">Interpreters</h1>
        <p className="muted">Lista över registrerade tolkar</p>

        {err && <p style={{ color: "salmon" }}>{err}</p>}
        {loading && !err && <p className="muted">Laddar...</p>}

        {!loading && !err && cleanItems.length === 0 && (
          <p className="muted">Inga tolkar hittades.</p>
        )}

        <ul className="list">
  {cleanItems.map((i) => (
    <li className="listItem" key={i.id}>
      <div>
        <div style={{ fontWeight: 700 }}>{i.fullName}</div>
        <div className="muted">{i.email || "Ingen e-post"}</div>
        <div className="muted">{i.phoneNumber || "Inget telefonnummer"}</div>

        {/* 👇 HÄR */}
        <Link
          to={`/bookings/new?interpreterId=${i.id}`}
          style={{ marginTop: 6, display: "inline-block" }}
        >
          Boka här
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="badge">{i.city}</span>
        {i.languages?.length ? (
          <span className="badge">{i.languages.join(", ")}</span>
        ) : (
          <span className="badge">Inga språk</span>
        )}
      </div>
    </li>
  ))}
</ul>

      </div>
    </div>
  );
}
