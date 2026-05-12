import "./HomePage.css";
import { useNavigate } from "react-router-dom";

type HomePagefunction = {
  isLoggedIn?: boolean;
  onAuthRequired?: () => void;
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
    text: "Super smidig app! Superenkelt att hålla koll på vad som finns hemma. Jag slänger mindre mat nu!",
  },
  {
    id: 2,
    name: "Daryl Dixon",
    rating: 4,
    text: "Bra översikt och tydlig upplägg. Jag gillar att jag kan se utgångsdatum på allt. Och att sortera efter kylskåp/frys/skafferi är toppen!",
  },
  {
    id: 3,
    name: "Michonne",
    rating: 5,
    text: "Älskar den här appen! Den har verkligen hjälpt mig att organisera mitt skafferi och minska matsvinnet. Rekommenderas starkt!",
  },
  {
    id: 4,
    name: "Glenn Rhee",
    rating: 4,
    text: "Enkel och användarvänlig. Jag gillar att jag kan lägga till varor snabbt och enkelt. Det har verkligen hjälpt mig att hålla koll på vad jag har hemma.",
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

export function HomePage({
  isLoggedIn = false,
  onAuthRequired,
}: HomePagefunction) {
  const navigate = useNavigate();

  const goToProtected = (path: string) => {
    if (!isLoggedIn) {
      onAuthRequired?.();
      return;
    }
    navigate(path);
  };

  return (
    <section className="home">
      {/* Hero & Entry Point */}
      <h1 className="home-title">Skafferi-Kollen</h1>
      <p className="home-subtitle">
        Få översikt över dina varor, håll koll på utgångsdatum och minska
        matsvinn.
      </p>

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

        {!isLoggedIn && (
          <p className="home-auth-hint">
            För att använda funktionerna behöver du logga in eller skapa ett
            konto.
          </p>
        )}
      </div>

      {/* Featrue Info*/}
      <div className="home-feature">
        <div className="feature-card info-card">
          <h3>Utgångsdatum</h3>
          <p>Se vilka varor som snart går ut och planera smartare.</p>
        </div>

        <div className="feature-card info-card">
          <h3>Skafferi & förvaring</h3>
          <p>Organisera efter kylskåp, frys och skafferi för snabb översikt.</p>
        </div>

        <div className="feature-card info-card">
          <h3>Minska matsvinn</h3>
          <p>Få bättre struktur och släng mindre mat över tid. </p>
        </div>

        {/* Reviews  */}
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
                <span className="review-name"> {r.name} </span>
              </div>
              <p className="review-text">" {r.text} "</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
