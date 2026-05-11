import "./HomePage.css";

export function HomePage() {
  return (
    <section className="home">
      {/* Hero */}
      <div className="home-hero">
        <h1 className="home-title"> Skafferi-Kollen</h1>
        <p className="home-subtitle">
          Håll koll på dina varor, utågngsdatum och minska matsvinn på ett
          enkelt sätt.
        </p>

        <div className="home-actions">
          <a href="/pantry">Till skafferiet</a>
          <a href="/pantry/new">Lägg till vara</a>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <h3>Utgångsdatum</h3>
          <p>Se vilka varor som snart går ut</p>
        </div>

        <div className="feature-card">
          <h3>Skafferi & förvaring</h3>
          <p>Organisera efter Kylskåp, Frys och Skafferi</p>
        </div>

        <div className="feature-card">
          <h3>Minska matsvinn</h3>
          <p>Planera bättre och släng mindre mat</p>
        </div>
      </div>
    </section>
  );
}
