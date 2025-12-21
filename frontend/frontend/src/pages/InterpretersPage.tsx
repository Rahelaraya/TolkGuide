import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/http";
import { isLoggedIn } from "../auth";
import "./InterpretersPage.css";

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

  // Sökstate
  const [qName, setQName] = useState("");
  const [qCity, setQCity] = useState("");
  const [qLang, setQLang] = useState("");

  const navigate = useNavigate();

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

  // Filtrering (namn/stad/språk)
  const filtered = useMemo(() => {
    const nameNeedle = qName.trim().toLowerCase();
    const cityNeedle = qCity.trim().toLowerCase();
    const langNeedle = qLang.trim().toLowerCase();

    return cleanItems.filter((x) => {
      const name = (x.fullName ?? "").toLowerCase();
      const city = (x.city ?? "").toLowerCase();
      const langs = (x.languages ?? []).map((l) => (l ?? "").toLowerCase());

      const okName = !nameNeedle || name.includes(nameNeedle);
      const okCity = !cityNeedle || city.includes(cityNeedle);
      const okLang = !langNeedle || langs.some((l) => l.includes(langNeedle));

      return okName && okCity && okLang;
    });
  }, [cleanItems, qName, qCity, qLang]);

  const goToBooking = () => {
    if (!isLoggedIn()) {
      navigate("/login", { state: { from: "/bookings/create" } });
      return;
    }
    navigate("/bookings/create");
  };

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <h1 className="title">Hitta rätt tolk</h1>
          <p className="subtitle">Lista över registrerade tolkar</p>

          <div className="searchRow">
            <input
              className="searchInput"
              placeholder="Sök tolk (namn)"
              value={qName}
              onChange={(e) => setQName(e.target.value)}
            />
            <input
              className="searchInput"
              placeholder="Sök stad"
              value={qCity}
              onChange={(e) => setQCity(e.target.value)}
            />
            <input
              className="searchInput"
              placeholder="Sök språk"
              value={qLang}
              onChange={(e) => setQLang(e.target.value)}
            />

            <button className="searchBtn" type="button">
              Sök
            </button>
          </div>
        </div>

        <div className="card">
          {loading && <div className="meta">Laddar...</div>}
          {err && <div className="meta">{err}</div>}

          {!loading && !err && (
            <div className="list">
              {filtered.map((x) => (
                <div className="item" key={x.id}>
                  <div>
                    {/* ✅ Namnet länkar till publik profil */}
                    <p className="name">
                      <Link
                        to={`/interpreters/${x.id}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {x.fullName || "N/A"}
                      </Link>
                    </p>

                    <div className="meta">{x.email || "N/A"}</div>
                    <div className="meta">{x.phoneNumber || "N/A"}</div>

                    <button className="bookBtn" onClick={goToBooking}>
                      Boka här
                    </button>
                  </div>

                  <div className="badges">
                    <span className="badge">{x.city || "N/A"}</span>
                    <span className="badge">
                      {x.languages?.length ? x.languages.join(", ") : "Inga språk"}
                    </span>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="meta">Inga tolkar hittades.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
