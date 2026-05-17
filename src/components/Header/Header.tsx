import { useState } from "react";
import "./Header.css";

type HeaderProps = {
  onLoginClick: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
};

export function Header({
  onLoginClick,
  isAuthenticated,
  onLogout,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <nav className="nav">
        {/* LEFT */}
        <div className="nav-left">
          <p className="logo">Skafferi-Kollen</p>
        </div>

        {/* HAMBURGER (MOBILE) */}
        <button
          className="nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* CENTER – DESKTOP NAV */}
        <ul className="nav-center">
          <li>
            <a href="/">Hem</a>
          </li>
          <li>
            <a href="/about">Om oss</a>
          </li>
          <li>
            <a href="/contact">Kontakt</a>
          </li>
        </ul>

        {/* RIGHT – DESKTOP AUTH */}
        <div className="nav-right">
          {!isAuthenticated ? (
            <button className="login-btn" onClick={onLoginClick}>
              Logga in / Registrera
            </button>
          ) : (
            <button className="login-btn" onClick={onLogout}>
              Logga ut
            </button>
          )}
        </div>

        {/* ✅ MOBILE DROPDOWN MENU (SEPARAT, GLASSY) */}
        {open && (
          <ul className="nav-mobile-menu">
            <li>
              <a href="/" onClick={() => setOpen(false)}>
                Hem
              </a>
            </li>
            <li>
              <a href="/about" onClick={() => setOpen(false)}>
                Om oss
              </a>
            </li>
            <li>
              <a href="/contact" onClick={() => setOpen(false)}>
                Kontakt
              </a>
            </li>

            <li className="nav-auth">
              {!isAuthenticated ? (
                <button
                  className="login-btn"
                  onClick={() => {
                    setOpen(false);
                    onLoginClick();
                  }}
                >
                  Logga in / Registrera
                </button>
              ) : (
                <button
                  className="login-btn"
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                >
                  Logga ut
                </button>
              )}
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
