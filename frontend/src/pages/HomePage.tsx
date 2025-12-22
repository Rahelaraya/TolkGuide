import { useEffect, useState } from "react";
import { getInterpreters } from "../api/interpretersApi";
import { InterpreterPublic } from "../types/interpreter";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../auth/auth";

export default function HomePage() {
  const [items, setItems] = useState<InterpreterPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function onBookClick() {
    if (!isLoggedIn()) {
      navigate("/login", { state: { returnTo: "/bookings" } });
      return;
    }
    navigate("/bookings");
  }

  // 🔎 Filter: stad + språk
  const filtered = items.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;

    const city = (p.city ?? "").toLowerCase();
    const languages = (p.languages ?? []).join(" ").toLowerCase();

    return city.includes(q) || languages.includes(q);
  });

  useEffect(() => {
    getInterpreters()
      .then((data: InterpreterPublic[]) => setItems(data))
      .catch((e: any) => setError(e?.message ?? "Kunde inte hämta tolkar"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Laddar tolkar...</p>;
  if (error) return <p style={{ padding: 20 }}>{error}</p>;

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__inner">
          <h1>Hitta den perfekta tolken</h1>

          {/* SÖK */}
          <form className="search" onSubmit={(e) => e.preventDefault()}>
            <span className="search__icon" aria-hidden="true">🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök stad eller språk..."
            />
          </form>
        </div>
      </section>

      {/* LISTA */}
      <section className="section">
        <div className="section__title">
          <h2>Tillgängliga tolkar</h2>
        </div>

        {filtered.length === 0 && (
          <p style={{ padding: 20 }}>
            Inga tolkar matchar vald stad eller språk.
          </p>
        )}

        <div className="cards">
          {filtered.map((p) => (
            <article key={p.id} className="card">
              <div className="card__img">
                {(p.fullName?.[0]?.toUpperCase() ?? "?")}
              </div>

              <div className="card__body">
                <div className="card__name">{p.fullName}</div>
                <div className="card__city">{p.city}</div>

                <div className="card__badges">
                  {(p.languages ?? []).map((l, i) => (
                    <span key={i} className="badge">{l}</span>
                  ))}
                </div>

                {p.bio && <p className="card__blurb">{p.bio}</p>}

                <div className="card__actions">
                  <button className="btn">Visa profil</button>
                  <button className="btn primary" onClick={onBookClick}>
                    Boka
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
