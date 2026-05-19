import { useEffect, useState } from "react";
import "./PantryPage.css";

type StorageLocation = "SKAFFERI" | "KYLSKÅP" | "FRYS";
type LocationFilter = StorageLocation | "ALL";

type PantryItem = {
  id: number;
  name: string;
  amountStatus: "EMPTY" | "LOW" | "MEDIUM" | "HIGH";
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

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [location, setLocation] = useState<LocationFilter>("ALL");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems(1, true);
  }, [location]);

  const loadItems = async (pageToLoad: number, replace = false) => {
    if (loading) return;

    setLoading(true);

    const params = new URLSearchParams();
    params.set("page", pageToLoad.toString());
    params.set("limit", "10");
    if (location !== "ALL") {
      params.set("location", location);
    }

    const res = await fetch(`/api/pantry?${params.toString()}`, {
      credentials: "include",
    });

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

  return (
    <div className="pantry-page">
      <header className="pantry-header">
        <h1>Ditt skafferi</h1>
        <p>Översikt över dina varor</p>
      </header>

      <div className="pantry-tabs">
        {[
          { key: "ALL", label: "ALLA" },
          { key: "SKAFFERI", label: "Skafferi" },
          { key: "KYLSKÅP", label: "Kylskåp" },
          { key: "FRYS", label: "Frys" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={location === tab.key ? "active" : ""}
            onClick={() => setLocation(tab.key as LocationFilter)}
          >
            {tab.key}
          </button>
        ))}
      </div>

      
    </div>
  );
}
