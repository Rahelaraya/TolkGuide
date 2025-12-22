import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";

type Customer = {
  id: number;
  name: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
};

type UpdateCustomerDto = {
  name: string;
  contactPerson: string;
  phoneNumber: string;
  address: string;
};

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<Customer | null>(null);
  const [form, setForm] = useState<UpdateCustomerDto>({
    name: "",
    contactPerson: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    apiFetch<Customer>("/api/customer/me")
      .then((data) => {
        setProfile(data);
        setForm({
          name: data.name ?? "",
          contactPerson: data.contactPerson ?? "",
          phoneNumber: data.phoneNumber ?? "",
          address: data.address ?? "",
        });
      })
      .catch((e) => setErr(e?.message ?? "Kunde inte hämta profilen"))
      .finally(() => setLoading(false));
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setSaving(true);

    try {
      const updated = await apiFetch<Customer>("/api/customer/me", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setProfile(updated);
      setMsg("Sparat ✅");
    } catch (e: any) {
      setErr(e?.message ?? "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Laddar profil...</div>;
  if (err) return <div style={{ padding: 24, color: "crimson" }}>{err}</div>;
  if (!profile) return <div style={{ padding: 24 }}>Ingen profil hittades.</div>;

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 24 }}>
      <h2>Min profil</h2>
      <p style={{ opacity: 0.8 }}>
        Den här informationen är privat och visas bara för dig.
      </p>

      <form onSubmit={onSave} style={{ display: "grid", gap: 12 }}>
        <label>
          Namn
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ width: "100%", padding: 10 }}
          />
        </label>

        <label>
          Kontaktperson
          <input
            value={form.contactPerson}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            style={{ width: "100%", padding: 10 }}
          />
        </label>

        <label>
          Telefon
          <input
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            style={{ width: "100%", padding: 10 }}
          />
        </label>

        <label>
          Adress
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            style={{ width: "100%", padding: 10 }}
          />
        </label>

        <label>
          Email (låst)
          <input
            value={profile.email ?? ""}
            disabled
            style={{ width: "100%", padding: 10, opacity: 0.7 }}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          style={{ padding: 12, cursor: "pointer" }}
        >
          {saving ? "Sparar..." : "Spara"}
        </button>

        {msg && <div style={{ color: "green" }}>{msg}</div>}
      </form>
    </div>
  );
}
