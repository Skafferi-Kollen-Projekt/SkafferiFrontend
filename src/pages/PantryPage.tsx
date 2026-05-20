import { useEffect, useState } from "react";
import "./PantryPage.css";

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

const STATUS_ORDER: AmountStatus[] = ["LOW", "EMPTY", "MEDIUM", "HIGH"];

function getNextStatus(current: AmountStatus): AmountStatus {
  const index = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[(index + 1) % STATUS_ORDER.length];
}

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [location, setLocation] = useState<StorageLocation>("SKAFFERI");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<string>("");
  const [editUnit, setEditUnit] = useState<string>("");
  const [editExpiryDate, setEditExpiryDate] = useState<string>("");

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(false);

    loadItems(1, true);
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

  const updateStatus = async (itemId: number, current: AmountStatus) => {
    const next = getNextStatus(current);

    const res = await fetch(`http://localhost:4000/api/pantry/${itemId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amountStatus: next }),
    });

    if (!res.ok) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, amountStatus: next } : item,
      ),
    );
  };

  const startEdit = (item: PantryItem) => {
    setEditingId(item.id);
    setEditQuantity(item.quantity?.toString() ?? "");
    setEditUnit(item.unit ?? "");
    setEditExpiryDate(item.expiryDate ?? "");
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
    } = {};

    if (editQuantity) {
      payload.quantity = Number(editQuantity);
    }

    if (editUnit.trim()) {
      payload.unit = editUnit.trim();
    }

    if (editExpiryDate) {
      payload.expiryDate = editExpiryDate;
    }

    const res = await fetch(`http://localhost:4000/api/pantry/${itemId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: payload.quantity ?? item.quantity,
              unit: payload.unit ?? item.unit,
              expiryDate: payload.expiryDate ?? item.expiryDate,
            }
          : item,
      ),
    );
    cancelEdit();
  };

  return (
    <div className="pantry-page">
      <header className="pantry-header">
        <h1>Ditt skafferi</h1>
        <p>Översikt över dina varor</p>
      </header>

      {/* TABS */}
      <div className="pantry-tabs">
        {[
          { key: "SKAFFERI", label: "Skafferi" },
          { key: "KYLSKÅP", label: "Kylskåp" },
          { key: "FRYS", label: "Frys" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={location === tab.key ? "active" : ""}
            onClick={() => setLocation(tab.key as StorageLocation)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LIST */}
      <ul className="pantry-list">
        {items.map((item) => (
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

            {/* INLINE EDIT */}
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
                  placeholder="Enhet (st, g, l)"
                  value={editUnit}
                  onChange={(e) => setEditUnit(e.target.value)}
                />

                <input
                  type="date"
                  value={editExpiryDate}
                  onChange={(e) => setEditExpiryDate(e.target.value)}
                />

                <button onClick={() => saveEdit(item.id)}>Spara</button>
                <button onClick={cancelEdit}>Avbryt</button>
              </div>
            ) : (
              <button className="edit-btn" onClick={() => startEdit(item)}>
                Redigera
              </button>
            )}
          </li>
        ))}
      </ul>

      {!loading && items.length === 0 && (
        <div className="pantry-empty">
          <p>Inga varor i detta rum</p>
        </div>
      )}

      {hasMore && (
        <div className="pantry-pagination">
          <button onClick={() => loadItems(page + 1, false)} disabled={loading}>
            {loading ? "Laddar..." : "Visa fler"}
          </button>
        </div>
      )}
    </div>
  );
}
