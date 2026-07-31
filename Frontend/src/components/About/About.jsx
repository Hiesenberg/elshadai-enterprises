import { FaCheck } from "react-icons/fa";
import aboutimage from "../../assets/images/aboutimage.png";

import "./About.css";

function About() {
  const highlights = [
    "15+ Years of Experience",
    "Quality Workmanship",
    "Affordable Pricing",
    "On-Time Service",
    "Customer Satisfaction",
  ];

  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-image">
          <img src={aboutimage} alt="About Us" />
        </div>
        <div className="about-content">
          <h2>About Elshadai Enterprises</h2>
          <p>
            Elshadai Enterprises is a trusted home maintenance company serving
            Bangalore for over 15 years. From carpentry and electrical repairs
            to painting and welding, our certified professionals deliver
            reliable, affordable, and on-time service for every job.
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
