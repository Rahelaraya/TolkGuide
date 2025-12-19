import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import type { Booking } from "../types";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Booking | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError("");
        const res = await api.get<Booking>(`/api/bookings/${id}`);
        if (alive) setData(res.data);
      } catch (e: any) {
        if (alive) setError(e?.response?.data?.message ?? e?.message ?? "Fel vid hämtning");
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading text="Hämtar bokning..." />;

  return (
    <div style={{ padding: 16 }}>
      <Link to="/bookings">← Tillbaka</Link>

      <h2>Bokning #{data.id}</h2>
      <p><b>Plats:</b> {data.location}</p>
      <p><b>Start:</b> {new Date(data.startTime).toLocaleString()}</p>
      <p><b>Slut:</b> {new Date(data.endTime).toLocaleString()}</p>
      <p><b>Status:</b> {data.status}</p>
      <p><b>Anteckningar:</b> {data.notes ?? "-"}</p>
    </div>
  );
}

