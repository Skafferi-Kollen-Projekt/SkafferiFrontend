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
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>

        {/* RIGHT – DESKTOP AUTH */}
        <div className="nav-right">
          {!isAuthenticated ? (
            <button className="login-btn" onClick={onLoginClick}>
              Log in / Sign up
            </button>
          ) : (
            <button className="login-btn" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>

        {/* ✅ MOBILE DROPDOWN MENU (SEPARAT, GLASSY) */}
        {open && (
          <ul className="nav-mobile-menu">
            <li>
              <a href="/" onClick={() => setOpen(false)}>
                Home
              </a>
            </li>
            <li>
              <a href="/about" onClick={() => setOpen(false)}>
                About
              </a>
            </li>
            <li>
              <a href="/contact" onClick={() => setOpen(false)}>
                Contact
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
                  Log in / Sign up
                </button>
              ) : (
                <button
                  className="login-btn"
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                >
                  Logout
                </button>
              )}
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
