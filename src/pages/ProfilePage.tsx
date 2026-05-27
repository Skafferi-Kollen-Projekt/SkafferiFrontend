import "./ProfilePage.css";
import React, { useEffect, useState } from "react";
import { updateMe, deleteMe } from "../api/user.api";
import { useNavigate } from "react-router-dom";

type User = {
  firstname: string;
  lastname: string;
  email: string;
};

type Props = {
  user: User;
  onLogout: () => Promise<void> | void;
  onProfileUpdated: () => Promise<void> | void;
};

export function ProfilePage({ user, onLogout, onProfileUpdated }: Props) {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  const [confirmEmail, setConfirmEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "error">("idle");
  const canDelete = confirmEmail.trim() === user.email;
  const [logoutNotice, setLogoutNotice] = useState<string | null>(null);

  useEffect(() => {
    setDeleteStatus("idle");
  }, [confirmEmail]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const data = await updateMe({
        firstname,
        lastname,
        email,
        password: password || undefined,
      });

      if (data?.message === "EMAIL_CHANGED_LOGOUT_REQUIRED") {
        setLogoutNotice("Email ändrad. Du måste logga in igen.");

        setTimeout(async () => {
          await onLogout();
          navigate("/");
        }, 2500);
        return;
      }

      await onProfileUpdated();
      setPassword("");
      setStatus("success");
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;

    try {
      await deleteMe(confirmEmail);
      await onLogout();
      navigate("/");
    } catch {
      setDeleteStatus("error");
    }
  };

  return (
    <section className="profile">
      <h1>Min profil</h1>

      <form className="profile-form" onSubmit={handleUpdate}>
        <h2>Uppdatera profil</h2>

        <label>
          Förnamn:
          <input
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </label>

        <label>
          Efternamn:
          <input
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <p className="hint">Om du ändrar din email behöver du logga in igen.</p>

        <label>
          Nytt lösenord:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button disabled={loading}>
          {loading ? "Sparar..." : "Spara ändringar"}
        </button>

        {logoutNotice && <p className="info">{logoutNotice}</p>}

        {status === "success" && (
          <p className="success">Profil uppdaterad ✅</p>
        )}

        {status === "error" && (
          <p className="error">Kunde inte uppdatera profilen.</p>
        )}
      </form>

      <section className="danger-zone">
        <h2>Radera konto</h2>
        <p>
          Detta går inte att ångra. Skriv din email för att bekräfta
          borttagningen av ditt konto.
        </p>

        <input
          type="email"
          placeholder="Skriv din email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
        />

        <button
          className="delete-btn"
          disabled={!canDelete}
          onClick={handleDelete}
        >
          Radera konto
        </button>

        {deleteStatus === "error" && (
          <p className="error">
            Kontot kunde inte raderas. Kontrollera att emailen stämmer och
            försök igen.
          </p>
        )}
      </section>
    </section>
  );
}
