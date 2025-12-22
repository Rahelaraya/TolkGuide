import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";

type BookingDto = {
  id: number;
  languageId: number;
  interpreterId: number | null;
  startTime: string;
  endTime: string;
  location: string;
  notes: string | null;
  status: string;
};

type CreateBookingRequest = {
  languageId: number;
  startTime: string; // "2025-12-21T10:00"
  endTime: string;
  location: string;
  notes?: string | null;
};
function toIsoWithSeconds(v: string) {
  // "2025-12-22T10:00" -> "2025-12-22T10:00:00"
  if (!v) return v;
  return v.length === 16 ? `${v}:00` : v;
}

function endAfterStart(start: string, end: string) {
  if (!start || !end) return false;
  return new Date(end).getTime() > new Date(start).getTime();
}

function addHours(dtLocal: string, hours: number) {
  if (!dtLocal) return "";
  const d = new Date(dtLocal);
  d.setHours(d.getHours() + hours);

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}


export default function MyBookingsPage() {
  const [items, setItems] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState<CreateBookingRequest>({
    languageId: 1,
    startTime: "",
    endTime: "",
    location: "",
    notes: "",
  });

  async function load() {
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const data = await apiFetch<BookingDto[]>("/api/Bookings/mine");
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message ?? "Kunde inte hämta bokningar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createBooking(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      await apiFetch("/api/Bookings", {
        method: "POST",
        body: JSON.stringify({
          languageId: Number(form.languageId),
          startTime: form.startTime,
          endTime: form.endTime,
          location: form.location,
          notes: form.notes ?? null,
        }),
      });

      setMsg("Bokning skapad ✅");
      setForm({ languageId: 1, startTime: "", endTime: "", location: "", notes: "" });
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Kunde inte skapa bokning");
    }
  }

async function cancelBooking(id: number) {
  if (!confirm("Vill du avboka denna bokning?")) return;

  setErr("");
  setMsg("");

  try {
    await apiFetch(`/api/Bookings/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason: "Customer cancelled" }),
    });

    setMsg("Bokning avbokad ✅");
    await load();
  } catch (e: any) {
    setErr(e?.message ?? "Kunde inte avboka");
  }
}


  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h2>Mina bokningar</h2>

      {err && <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>}
      {msg && <div style={{ color: "green", marginBottom: 12 }}>{msg}</div>}

      {/* SKAPA BOKNING */}
      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginBottom: 20 }}>
        <h3>Ny bokning</h3>

        <form onSubmit={createBooking} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
          <label>
            LanguageId
            <input
              type="number"
              value={form.languageId}
              onChange={(e) => setForm({ ...form, languageId: Number(e.target.value) })}
              style={{ width: "100%", padding: 10 }}
            />
          </label>

          <label>
            Start (YYYY-MM-DDTHH:mm)
          <input
  type="datetime-local"
  value={form.startTime}
  onChange={(e) => {
    const start = e.target.value;

    setForm((prev) => {
      const end = addHours(start, 1); // alltid +1 timme
      return { ...prev, startTime: start, endTime: end };
    });
  }}
  style={{ width: "100%", padding: 10 }}
/>

          </label>

          <label>
            Slut (YYYY-MM-DDTHH:mm)
 <input
  type="datetime-local"
  value={form.endTime}
  min={form.startTime}   // <-- detta stoppar fel datum/tid
  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
  style={{ width: "100%", padding: 10 }}
/>

          </label>

          <label>
            Plats
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              style={{ width: "100%", padding: 10 }}
            />
          </label>

          <label>
            Notering (valfritt)
            <input
              value={form.notes ?? ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{ width: "100%", padding: 10 }}
            />
          </label>

          <button type="submit" style={{ padding: 12, cursor: "pointer" }}>
            Boka
          </button>
        </form>
      </div>

      {/* LISTA BOKNINGAR */}
      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        <h3>Lista</h3>

        {loading ? (
          <div>Laddar...</div>
        ) : items.length === 0 ? (
          <div>Du har inga bokningar ännu.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((b) => (
              <div
                key={b.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div><b>ID:</b> {b.id} <b>Status:</b> {b.status}</div>
                  <div><b>Tid:</b> {b.startTime} → {b.endTime}</div>
                  <div><b>Plats:</b> {b.location}</div>
                  <div><b>LanguageId:</b> {b.languageId}</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    onClick={() => cancelBooking(b.id)}
                    style={{ padding: "10px 12px", cursor: "pointer" }}
                    disabled={b.status?.toLowerCase() === "canceled" || b.status?.toLowerCase() === "cancelled"}
                  >
                    Avboka
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
