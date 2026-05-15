import "./HomePage.css";
import { useNavigate } from "react-router-dom";

// ======================
// ✅ TYP FÖR USER (SAME AS App.tsx)
// ======================
type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
};

type HomePageProps = {
  user: User | null;
  onAuthRequired: () => void;
};

type Review = {
  id: number;
  name: string;
  rating: 3 | 4 | 5;
  text: string;
};

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Rick Grimes",
    rating: 5,
    text: "Super smidig app! Superenkelt att hålla koll på vad som finns hemma.",
  },
  {
    id: 2,
    name: "Daryl Dixon",
    rating: 5,
    text: "Bra app för att organisera matvaror, speciellt när man har mycket att hålla reda på.",
  },
  {
    id: 3,
    name: "Michonne",
    rating: 5,
    text: "Fungerar bra för att hålla koll på matvaror. Jag dubbelköper aldrig tack vare den här appen!",
  },
  {
    id: 4,
    name: "Glenn Rhee",
    rating: 5,
    text: "Enkelt att använda och mycket effektivt för att hålla koll på matvaror. Har sparat mig mycket tid och pengar!",
  },
];

function Stars({ rating }: { rating: number }) {
  const full = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return (
    <span className="stars">
      {full}
      {empty}
    </span>
  );
}

export function HomePage({ user, onAuthRequired }: HomePageProps) {
  const navigate = useNavigate();

  // ======================
  // ✅ GATED NAVIGATION
  // ======================
  const goToProtected = (path: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }
    navigate(path);
  };

  return (
    <section className="home">
      {/* Hero */}
      <header className="home-hero">
        <h1 className="home-title">Skafferi-Kollen</h1>

        <p className="home-subtitle">
          Få översikt över dina varor, håll koll på utgångsdatum och minska
          matsvinn.
        </p>

        {/* ✅ WELCOME TEXT */}
        {user && (
          <p className="home-welcome">
            Välkommen {user.firstname} {user.lastname}
          </p>
        )}

        <div className="home-actions">
          <button
            type="button"
            className="primary-btn"
            onClick={() => goToProtected("/pantry")}
          >
            Till skafferiet
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => goToProtected("/pantry/new")}
          >
            Lägg till vara
          </button>
        </div>

        {/* ✅ INFO TEXT FÖR EJ INLOGGAD */}
        {!user && (
          <p className="home-auth-hint">
            För att använda funktionerna måste du logga in eller skapa ett
            konto.
          </p>
        )}
      </header>

      {/* Features */}
      <section className="feature-section">
        <div className="home-feature">
          <div className="feature-card">
            <h3>Utgångsdatum</h3>
            <p>Se vilka varor som snart går ut och planera smartare</p>
          </div>

          <div className="feature-card">
            <h3>Organisera &amp; förvaring</h3>
            <p>
              Organisera efter kylskåp, frys och skafferi för snabb översikt.
            </p>
          </div>

          <div className="feature-card">
            <h3>Minska matsvinn</h3>
            <p>Få bättre struktur och släng mindre mat över tid.</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews-section">
        <div className="home-reviews">
          <h2 className="reviews-title">Omdömen</h2>
          <p className="reviews-subtitle">
            Några av våra användare har delat sina upplevelser av
            Skafferi-Kollen:
          </p>
        </div>

        <div className="reviews-grid">
          {REVIEWS.map((r) => (
            <div className="reviews-card" key={r.id}>
              <div className="review-top">
                <Stars rating={r.rating} />
                <span className="review-name">{r.name}</span>
              </div>
              <p className="review-text">{r.text}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
