import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/http";
import { isLoggedIn } from "../auth";

type InterpreterDto = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  languages: string[];
};

export default function InterpreterPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<InterpreterDto | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setErr("");

    apiFetch<InterpreterDto>(`/api/Interpreters/${id}`)
      .then(setData)
      .catch((e) => setErr(e?.message ?? "Kunde inte hämta profilen"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div style={{ maxWidth: 820, margin: "40px auto", padding: 16 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        ← Tillbaka
      </button>

      {loading && <div>Laddar...</div>}
      {err && <div style={{ color: "#db2777" }}>{err}</div>}

      {!loading && !err && data && (
        <div
          style={{
            background: "white",
            border: "1px solid #f3d3e1",
            borderRadius: 16,
            padding: 18,
            boxShadow: "0 12px 30px rgba(17,24,39,0.08)",
          }}
        >
          <h1 style={{ marginTop: 0 }}>{data.fullName}</h1>
          <p style={{ color: "#6b7280", marginTop: 0 }}>
            {data.city} • {data.languages?.join(", ") || "Inga språk"}
          </p>

          <div style={{ marginTop: 12 }}>
            <div><b>Email:</b> {data.email || "—"}</div>
            <div><b>Telefon:</b> {data.phoneNumber || "—"}</div>
          </div>

          <button
            style={{
              marginTop: 16,
              border: "none",
              background: "#ec4899",
              color: "white",
              fontWeight: 800,
              padding: "10px 14px",
              borderRadius: 999,
              cursor: "pointer",
            }}
            onClick={() => navigate("/bookings/create")}
          >
            Skapa bokning
          </button>
        </div>
      )}
    </div>
  );
}
