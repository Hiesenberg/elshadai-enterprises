import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">E</div>
        <div className="logo-text">
          <h2>Elshadai</h2>
          <span>ENTERPRISES</span>
        </div>
      </div>
      <ul className="nav-links">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#services">Services</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#booking">Contact</a>
        </li>
      </ul>
      <a href="#booking">
        <button className="book-btn">BOOK Now</button>
      </a>
    </nav>
  );
}

export default Navbar;
