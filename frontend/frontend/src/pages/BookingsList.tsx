import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/http";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import "./BookingsList.css";
import type { BookingDto } from "../types.booking";

export default function BookingsList() {
  const [items, setItems] = useState<BookingDto[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");

    apiFetch<BookingDto[]>("/api/bookings")
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message ?? "Kunde inte hämta bokningar"))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    return [...items].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }, [items]);

  if (loading) return <Loading text="Hämtar bokningar..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page">
      <div className="container">
        <div className="topbar">
          <div>
            <h1 className="h1">Bokningar</h1>
            <p className="p">Lista över alla bokningar i systemet.</p>
          </div>

          <Link to="/bookings/new" className="btnPrimary">
            + Skapa ny
          </Link>
        </div>

        <div className="card">
          {sorted.length === 0 ? (
            <div style={{ padding: 16, color: "#475569" }}>
              Inga bokningar ännu.
            </div>
          ) : (
            sorted.map((b) => (
              <Link key={b.id} to={`/bookings/${b.id}`} className="listItem">
                <div>
                  <div className="titleRow">
                    <span className="mainTitle">#{b.id} • {b.location}</span>
                    <span className={statusClass(b.status)}>{b.status}</span>
                  </div>

                  <div className="meta">
                    {formatDate(b.startTime)} – {formatDate(b.endTime)} • LanguageId:{" "}
                    {b.languageId}
                  </div>
                </div>

                <div className="right">›</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== helpers ===== */

function statusClass(status: string) {
  const s = status?.toLowerCase?.() ?? "";
  if (s.includes("pending")) return "badge badgePending";
  if (s.includes("confirm")) return "badge badgeConfirmed";
  if (s.includes("cancel")) return "badge badgeCancelled";
  return "badge";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}
