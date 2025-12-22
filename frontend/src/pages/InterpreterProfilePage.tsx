// src/pages/InterpreterProfilePage.tsx
import { useEffect, useState } from "react";
import {
  getMyInterpreterProfile,
  updateMyInterpreterProfile,
  // createInterpreterProfile, // behövs inte om profilen skapas automatiskt
} from "../api/interpretersApi";

function getStatus(err: any): number | undefined {
  return err?.status ?? err?.response?.status ?? err?.data?.status;
}

export default function InterpreterProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [hasProfile, setHasProfile] = useState(false);

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [languagesText, setLanguagesText] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  async function load() {
    setError("");
    setLoading(true);

    try {
      const me = await getMyInterpreterProfile();

      setHasProfile(true);
      setFullName(me?.fullName ?? "");
      setCity(me?.city ?? "");
      setLanguagesText(me?.languagesText ?? "");
      setEmail(me?.email ?? "");
      setPhoneNumber(me?.phoneNumber ?? "");
    } catch (e: any) {
      const status = getStatus(e);

      // om profilen inte finns ännu -> visa tomt formulär
      if (status === 404) {
        setHasProfile(false);
        setFullName("");
        setCity("");
        setLanguagesText("");
        setEmail("");
        setPhoneNumber("");
      } else {
        setError(e?.message ?? "Kunde inte hämta din tolkprofil.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!alive) return;
      await load();
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !city.trim() || !languagesText.trim()) {
      setError("Fyll i Fullständigt namn, Stad och Språk.");
      return;
    }

    setSaving(true);
    try {
      const body = {
        fullName: fullName.trim(),
        city: city.trim(),
        languagesText: languagesText.trim(),
        email: email.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
      };

      // ✅ UPSERT: backend kan välja att skapa eller uppdatera med samma endpoint
      await updateMyInterpreterProfile(body);

      // efter spara -> hämta igen så vi vet att allt är sync
      await load();

      alert("Profil sparad ✅");
    } catch (e: any) {
      const status = getStatus(e);

      if (status === 401) {
        setError("Du är inte inloggad (401). Logga in igen.");
      } else if (status === 403) {
        setError("Du har inte behörighet (403). Du måste vara inloggad som Tolk.");
      } else {
        setError(e?.message ?? "Kunde inte spara profilen.");
      }
    } finally {
      setSaving(false);
    }
  }


  if (loading) return <div style={{ padding: 16 }}>Laddar...</div>;

  return (
    <div style={{ padding: 16, maxWidth: 640 }}>
      <h2>Tolkprofil</h2>
      <p>{hasProfile ? "Uppdatera din profil." : "Skapa din profil."}</p>

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={onSave} style={{ display: "grid", gap: 10 }}>
        <label>
          Fullständigt namn *
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>

        <label>
          Stad *
          <input value={city} onChange={(e) => setCity(e.target.value)} />
        </label>

        <label>
          Språk (komma-separerat) *
          <input
            value={languagesText}
            onChange={(e) => setLanguagesText(e.target.value)}
            placeholder="Arabiska, Svenska"
          />
        </label>

        <label>
          Email (valfri)
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Telefonnummer (valfri)
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Sparar..." : "Spara profil"}
        </button>
      </form>
    </div>
  );
}
