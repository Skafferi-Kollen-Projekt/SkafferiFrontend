import "./Header.css";

type HeaderProps = {
  onLoginClick: () => void;
};

export function Header({ onLoginClick }: HeaderProps) {
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
          <button type="button" className="login-btn" onClick={onLoginClick}>
            Login
          </button>
        </div>
      </nav>
    </header>
  );
}
