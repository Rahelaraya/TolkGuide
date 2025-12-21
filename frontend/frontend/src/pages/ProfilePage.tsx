import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../api/profileApi";
import type { ProfileDto } from "../api/profileApi";
import { logout } from "../auth";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="meta">Laddar profil...</div>;
  if (!profile) return null;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1>Profil</h1>
        <p className="meta">Här ser du din information.</p>

        <div className="card">
          <p><b>Användarnamn:</b> {profile.username}</p>
          <p><b>Roll:</b> {profile.role}</p>

          {profile.role === "Interpreter" && (
            <>
              <p><b>Email:</b> {profile.email}</p>
              <p><b>Telefon:</b> {profile.phoneNumber}</p>
              <p><b>Stad:</b> {profile.city}</p>
              <p><b>Språk:</b> {profile.languages?.join(", ")}</p>
            </>
          )}

          <button
            className="bookBtn"
            style={{ marginTop: 12 }}
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logga ut
          </button>
        </div>
      </div>
    </div>
  );
}
