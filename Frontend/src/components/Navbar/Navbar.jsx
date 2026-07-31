import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">E</div>
        <div className="logo-text">
          <h2>Elshadai</h2>
          <span>ENTERPRISES</span>
        </div>
      </div>
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li onClick={() => setMenuOpen(false)}>
          <a href="#home">Home</a>
        </li>
        <li onClick={() => setMenuOpen(false)}>
          <a href="#services">Services</a>
        </li>
        <li onClick={() => setMenuOpen(false)}>
          <a href="#about">About</a>
        </li>
        <li onClick={() => setMenuOpen(false)}>
          <a href="#booking">Contact</a>
        </li>
      </ul>
      <a href="#booking" onClick={() => setMenuOpen(false)}>
        <button className="book-btn">BOOK Now</button>
      </a>
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>
    </nav>
  );
}

export default Navbar;
