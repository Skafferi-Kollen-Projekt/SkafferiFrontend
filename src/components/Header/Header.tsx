import "./Header.css";

type HeaderProps = {
  onLoginClick: () => void;
  isAuthenticated: boolean;
};

export function Header({ onLoginClick, isAuthenticated }: HeaderProps) {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <p className="logo">Skafferi-Kollen</p>
        </div>

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

        <div className="nav-right">
          {!isAuthenticated ? (
            <button className="login-btn" onClick={onLoginClick}>
              Log in / Sign up
            </button>
          ) : (
            <span className="login-btn">Inloggad</span>
          )}
        </div>
      </nav>
    </header>
  );
}
