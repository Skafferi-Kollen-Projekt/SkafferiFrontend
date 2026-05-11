import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <p className="logo"> Skafferi-Kollen</p>
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
          <a href="/login" className="login-btn">
            Login
          </a>
        </div>
      </nav>
    </header>
  );
}
