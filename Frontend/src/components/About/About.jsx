import { FaCheck } from "react-icons/fa";
import aboutimage from "../../assets/images/aboutimage.png";

import "./About.css";

function About() {
  const highlights = [
    "Trusted by customers across India",
    "Quality work, every time",
    "Fair, transparent pricing",
    "We show up when we say we will",
    "Your satisfaction matters to us",
  ];

  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-image">
          <img src={aboutimage} alt="About Us" />
        </div>
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            We fix homes across India — from Bangalore to Mumbai, Chennai to Delhi.
            Whether it's carpentry, electrical work, plumbing, painting, or welding,
            we handle it all. Our team shows up on time, does the job right,
            and charges you fairly. No hassle, just honest work.
          </p>
          <div className="about-highlights">
            <ul>
              {highlights.map((highlight, index) => (
                <li key={index}>
                  <FaCheck className="check-icon" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
