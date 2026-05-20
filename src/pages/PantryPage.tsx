import { useEffect, useState } from "react";
import "./PantryPage.css";

type StorageLocation = "SKAFFERI" | "KYLSKÅP" | "FRYS";
type AmountStatus = "EMPTY" | "LOW" | "MEDIUM" | "HIGH";

type PantryItem = {
  id: number;
  name: string;
  amountStatus: AmountStatus;
  location: StorageLocation;
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

/* =========================
   STATUS LOGIC
========================= */

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

  /* =========================
     FETCH ON LOCATION CHANGE
  ========================= */

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
    params.set("location", location); // ✅ alltid giltigt nu

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

  /* =========================
     STATUS UPDATE
  ========================= */

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

  return (
    <div className="pantry-page">
      <header className="pantry-header">
        <h1>Ditt skafferi</h1>
        <p>Översikt över dina varor</p>
      </header>

      {/* TABS – ENDAST RUM */}
      <div className="pantry-tabs">
        {[
          { key: "SKAFFERI", label: "Skafferi" },
          { key: "KYLSKÅP", label: "Kylskåp" },
          { key: "FRYS", label: "Frys" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={location === tab.key ? "active" : ""}
            onClick={() => {
              if (location !== tab.key) {
                setLocation(tab.key as StorageLocation);
              }
            }}
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
              {item.expiryInfo?.isExpiringSoon && (
                <span className="warning">⚠ Utgår snart</span>
              )}
            </div>
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
