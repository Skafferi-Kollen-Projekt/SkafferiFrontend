import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

type HeaderProps = {
  user: {
    role: string;
  } | null;

  onLoginClick: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
};

export function Header({
  user,
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
            <Link to="/">Hem</Link>
          </li>
          <li>
            <Link to="/about">Om oss</Link>
          </li>
          <li>
            <Link to="/contact">Kontakt</Link>
          </li>

          {isAuthenticated && (
            <li>
              <Link to="/profile">Profil</Link>
            </li>
          )}

          {user?.role === "ADMIN" && (
            <li>
              <Link to={"/admin/support"}>Support</Link>
            </li>
          )}
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
              <Link to="/" onClick={() => setOpen(false)}>
                Hem
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setOpen(false)}>
                Om oss
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setOpen(false)}>
                Kontakt
              </Link>
            </li>

            {isAuthenticated && (
              <li>
                <Link to="/profile" onClick={() => setOpen(false)}>
                  Profil
                </Link>
              </li>
            )}

            {user?.role === "ADMIN" && (
              <li>
                <Link to="/admin/support" onClick={() => setOpen(false)}>
                  Support
                </Link>
              </li>
            )}

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
