import "./Footer.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-socials">
          <a
            href="https://github.com/Nirren404"
            target="_blank"
            rel="noopener noreferrar"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/nirari-yaro-78912a287/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>

        <p className="footer-copy">
          © 2026 Skafferi-Kollen. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
