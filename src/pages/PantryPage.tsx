import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PantryPage.css";

/* Types */

type StorageLocation = "SKAFFERI" | "KYLSKÅP" | "FRYS";
type AmountStatus = "EMPTY" | "LOW" | "MEDIUM" | "HIGH";

type PantryItem = {
  id: number;
  name: string;
  amountStatus: AmountStatus;
  location: StorageLocation;
  quantity?: number | null;
  unit?: string | null;
  expiryDate?: string | null;
  expiryInfo?: {
    daysLeft: number;
    isExpired: boolean;
    isExpiringSoon: boolean;
    isWarning: boolean;
  } | null;
};

type PantryResponse = {
  items: PantryItem[];
  pagination: {
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
};

/* Status logic */

const STATUS_ORDER: AmountStatus[] = ["LOW", "EMPTY", "MEDIUM", "HIGH"];

function getNextStatus(current: AmountStatus): AmountStatus {
  const index = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[(index + 1) % STATUS_ORDER.length];
}

const MOTIVATION_TEXTS = [
  "Små uppdateringar i skafferiet kan spara både pengar och matsvinn.",
  "Det som syns blir oftare använt – och mindre hamnar i soporna.",
  "En minut extra här kan spara ett onödigt köp senare.",
  "Bra koll på skafferiet gör vardagen billigare och enklare.",
  "Att hålla koll på maten är ett av de enklaste sätten att spara pengar.",
];

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [location, setLocation] = useState<StorageLocation>("SKAFFERI");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const motivation =
    MOTIVATION_TEXTS[new Date().getDate() % MOTIVATION_TEXTS.length];

  /* Inline edit state */

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editExpiryDate, setEditExpiryDate] = useState("");
  const [editLocation, setEditLocation] = useState<StorageLocation>("SKAFFERI");

  /* Fetch items */

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(false);
    loadItems(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const loadItems = async (pageToLoad: number, replace: boolean) => {
    if (loading) return;
    setLoading(true);

    const params = new URLSearchParams();
    params.set("page", pageToLoad.toString());
    params.set("limit", "10");
    params.set("location", location);

    const res = await fetch(
      `http://localhost:4000/api/pantry?${params.toString()}`,
      { credentials: "include" },
    );

    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data: PantryResponse = await res.json();

    setItems((prev) => (replace ? data.items : [...prev, ...data.items]));
    setPage(pageToLoad);
    setHasMore(data.pagination.hasMore);
    setLoading(false);
  };

  /* Update status */

  const updateStatus = async (itemId: number, current: AmountStatus) => {
    const next = getNextStatus(current);

    const res = await fetch(`http://localhost:4000/api/pantry/${itemId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountStatus: next }),
    });

    if (!res.ok) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, amountStatus: next } : item,
      ),
    );
  };

  /* Inline edit handlers */

  const startEdit = (item: PantryItem) => {
    setEditingId(item.id);
    setEditQuantity(item.quantity?.toString() ?? "");
    setEditUnit(item.unit ?? "");
    setEditExpiryDate(item.expiryDate ?? "");
    setEditLocation(item.location);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuantity("");
    setEditUnit("");
    setEditExpiryDate("");
  };

  const saveEdit = async (itemId: number) => {
    const payload: {
      quantity?: number;
      unit?: string;
      expiryDate?: string;
      location?: StorageLocation;
    } = {};

    if (editQuantity) payload.quantity = Number(editQuantity);
    if (editUnit.trim()) payload.unit = editUnit.trim();
    if (editExpiryDate) payload.expiryDate = editExpiryDate;
    if (editLocation !== location) payload.location = editLocation;

    const res = await fetch(`http://localhost:4000/api/pantry/${itemId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return;

    setItems((prev) =>
      payload.location && payload.location !== location
        ? prev.filter((i) => i.id !== itemId)
        : prev.map((i) => (i.id === itemId ? { ...i, ...payload } : i)),
    );

    cancelEdit();
  };

  /* Delete item */

  const deleteItem = async (itemId: number) => {
    const res = await fetch(`http://localhost:4000/api/pantry/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) return;

    setItems((prev) => prev.filter((i) => i.id !== itemId));
    cancelEdit();
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="pantry-page">
      <header className="pantry-header">
        <h1>Ditt skafferi</h1>
        <p>Översikt över dina varor</p>
      </header>

      <p className="pantry-motivation">🌱 {motivation} </p>

      <button className="edit-btn" onClick={() => navigate("/pantry/new")}>
        + Lägg till vara
      </button>

      <div className="pantry-tabs">
        <input
          type="text"
          className="pantry-search"
          placeholder="Sök efter vara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {(["SKAFFERI", "KYLSKÅP", "FRYS"] as StorageLocation[]).map((room) => (
          <button
            key={room}
            className={location === room ? "active" : ""}
            onClick={() => setLocation(room)}
          >
            {room}
          </button>
        ))}
      </div>

      <ul className="pantry-list">
        {filteredItems.length === 0 && search.trim() !== "" ? (
          <li className="pantry-item pantry-empty">
            Ingen vara matchar din sökning.
          </li>
        ) : (
          filteredItems.map((item) => (
            <li key={item.id} className="pantry-item">
              <div className="pantry-item-main">
                <strong>{item.name}</strong>
                <button
                  className={`status ${item.amountStatus.toLowerCase()}`}
                  onClick={() => updateStatus(item.id, item.amountStatus)}
                >
                  {item.amountStatus}
                </button>
              </div>

              <div className="pantry-item-meta">
                <span>{item.location}</span>

                {item.quantity && item.unit && (
                  <span>
                    {item.quantity} {item.unit}
                  </span>
                )}

                {item.expiryInfo?.isExpiringSoon && (
                  <span className="warning">
                    ⚠ {item.expiryInfo.daysLeft} dagar kvar
                  </span>
                )}
              </div>

              {editingId === item.id ? (
                <div className="pantry-edit">
                  <input
                    type="number"
                    placeholder="Mängd"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Enhet"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                  />
                  <input
                    type="date"
                    value={editExpiryDate}
                    onChange={(e) => setEditExpiryDate(e.target.value)}
                  />
                  <select
                    value={editLocation}
                    onChange={(e) =>
                      setEditLocation(e.target.value as StorageLocation)
                    }
                  >
                    <option value="SKAFFERI">Skafferi</option>
                    <option value="KYLSKÅP">Kylskåp</option>
                    <option value="FRYS">Frys</option>
                  </select>

                  <button onClick={() => saveEdit(item.id)}>Spara</button>
                  <button onClick={cancelEdit}>Avbryt</button>
                  <button
                    className="danger"
                    onClick={() => deleteItem(item.id)}
                  >
                    Radera
                  </button>
                </div>
              ) : (
                <button className="edit-btn" onClick={() => startEdit(item)}>
                  Redigera
                </button>
              )}
            </li>
          ))
        )}
      </ul>
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            className="edit-btn"
            disabled={loading}
            onClick={() => loadItems(page + 1, false)}
          >
            {loading ? "Laddar..." : "Visa fler"}
          </button>
        </div>
      )}
    </div>
  );
}
``;
