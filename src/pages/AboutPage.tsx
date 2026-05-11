import "./AboutPage.css";
import logo from "../assets/skafferi-kollen-logo.png";

export function AboutPage() {
  return (
    <section className="about">
      <div className="about-container">
        <div className="about-image">
          <img src={logo} alt="Skafferi-kollen - Smart hemlösning" />
        </div>
        <h1 className="about-title">Om Skafferi-Kollen</h1>
        <p className="about-text">
          Skafferi-Kollen är en webbaserad applikation som hjälper användare att
          organisera sina livsmedel och hålla koll på utgångsdatum.
        </p>
        <p className="about-text">
          Målet är att minska matsvinn genom bättre översikt, tydlig struktur
          och enkel hantering av varor i kylskåp, frys och skafferi.
        </p>
        <div className="about-highlights">
          <div className="highlight-card">
            <h3>Enkelt</h3>
            <p>Lätt att använda utan onödiga funktioner.</p>
          </div>

          <div className="highlight-card">
            <h3>Organiserat</h3>
            <p>Alla varor samlade på ett ställe.</p>
          </div>

          <div className="highlight-card">
            <h3>Hållbarhet</h3>
            <p>Bidrar till att minska matsvinn.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
