import "./Hero.css";
import technician from "../../assets/images/technician.png";

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>
          Reliable Home
          <br />
          Maintenance <span>Services</span>
        </h1>
        <p>
          Professional <span>Carpentry</span>, Plumbing, Electrical, Painting
          and Welding services across Bangalore.
        </p>
        <div className="hero-buttons">
          <a href="#booking">
            <button className="btn primary-btn">
              Book Now
              <span className="arrow">→</span>
            </button>
          </a>
          <a href="tel:+919876543210">
            <button className="btn secondary-btn">Call Now</button>
          </a>
        </div>
        <div className="trust-badges">
          <div className="badge">🛡️ Trusted Professionals</div>
          <div className="badge">⚡ Fast Response</div>
          <div className="badge">⭐ Quality Workmanship</div>
        </div>
      </div>
      <div className="hero-image">
        <img src={technician} alt="Technician" />
      </div>
    </section>
  );
}

export default Hero;
