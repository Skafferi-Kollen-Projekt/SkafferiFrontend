import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PantryNewPage.css";

type StorageLocation = "SKAFFERI" | "KYLSKÅP" | "FRYS";

type CreatePantryItemPayload = {
  name: string;
  location: StorageLocation;
  expiryDate?: string;
};

export default function PantryNewPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState<StorageLocation>("SKAFFERI");
  const [expiryDate, setExpiryDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.trim().length < 2) return;

    const payload: CreatePantryItemPayload = {
      name: name.trim(),
      location,
      ...(expiryDate ? { expiryDate } : {}),
    };

    const res = await fetch("http://localhost:4000/api/pantry", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate("/pantry");
    }
  };

  return (
    <div className="pantry-new-page">
      <h1>Lägg till vara</h1>
      <p>Snabbt och enkelt – fyll i bara det du vill</p>

      <form className="pantry-new-form" onSubmit={handleSubmit}>
        <label>
          Namn
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="t.ex. Mjölk"
            required
          />
        </label>

        <label>
          Plats
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as StorageLocation)}
          >
            <option value="SKAFFERI">Skafferi</option>
            <option value="KYLSKÅP">Kylskåp</option>
            <option value="FRYS">Frys</option>
          </select>
        </label>

        <button
          type="button"
          className="toggle-advanced"
          onClick={() => setShowAdvanced((v) => !v)}
        >
          {showAdvanced ? "Dölj fler fält" : "Visa fler fält"}
        </button>

        {showAdvanced && (
          <label>
            Utgångsdatum
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </label>
        )}

        <button type="submit" className="primary-btn">
          Lägg till vara
        </button>
      </form>
    </div>
  );
}
