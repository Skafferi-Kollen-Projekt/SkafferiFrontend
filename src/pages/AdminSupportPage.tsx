import { useEffect, useState } from "react";
import "./AdminSupportPage.css";
import {
  getSupportMessagesForAdmin,
  type SupportMessage,
} from "../api/support.api";
import { useNavigate } from "react-router-dom";

export const AdminSupportPage = () => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getSupportMessagesForAdmin();
        setMessages(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  const markAsRead = (id: number) => {
    setReadIds((prev) => [...prev, id]);
  };
  return (
    <section className="admin-support">
      <header className="admin-support-header">
        <h1>Support-frågor & feedback</h1>
        <button className="admin-back-btn" onClick={() => navigate(-1)}>
          ← Tillbaka
        </button>
      </header>

      {loading && <p>Laddar supportmeddelanden...</p>}

      {error && <p className="error">Kunde inte hämta support-meddelanden.</p>}

      {!loading && messages.length === 0 && (
        <p className="empty">Inga support-frågor de senaste 2 dagarna.</p>
      )}

      <ul className="support-list">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className={`support-card ${readIds.includes(msg.id) ? "read" : "unread"}`}
          >
            <p className="support-email">{msg.user.email}</p>
            <p className="support-message">{msg.message}</p>
            <p className="support-date">
              {" "}
              {new Date(msg.created_at).toLocaleString("sv-SE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {!readIds.includes(msg.id) && (
              <button
                className="mark-read-btn"
                onClick={() => markAsRead(msg.id)}
              >
                Markera som läst
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
