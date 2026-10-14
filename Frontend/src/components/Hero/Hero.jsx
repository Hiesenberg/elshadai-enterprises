import "./Hero.css";
import technician from "../../assets/images/technician.png";

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>
          Home Repairs
          <br />
          You Can <span>Trust</span>
        </h1>
        <p>
          From <span>carpentry</span> to electrical work, plumbing to painting —
          we fix it right the first time. Serving all over India.
        </p>
        <div className="hero-buttons">
          <a href="#booking">
            <button className="btn primary-btn">
              Book Now
              <span className="arrow">→</span>
            </button>
          </a>
          <a href="tel:+918088618213">
            <button className="btn secondary-btn">Call Now</button>
          </a>
        </div>
        <div className="trust-badges">
          <div className="badge">🛡️ Trusted across India</div>
          <div className="badge">⚡ Quick response times</div>
          <div className="badge">⭐ Work done right</div>
        </div>
      </div>
      <div className="hero-image">
        <img src={technician} alt="Technician" />
      </div>
    </section>
  );
}

export default Hero;
