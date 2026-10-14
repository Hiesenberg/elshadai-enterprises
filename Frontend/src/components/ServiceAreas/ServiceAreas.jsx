import "./ServiceAreas.css";
import { FaMapMarkerAlt } from "react-icons/fa";

function ServiceAreas() {
  const areas = [
    "Bangalore",
    "Mysore",
    "Chennai",
    "Hyderabad",
    "Kochi",
  ];

  return (
    <section className="service-areas">
      <div className="areas-container">
        <div className="areas-header">
          <FaMapMarkerAlt className="map-icon" />
          <h2>We Serve All Over India</h2>
          <p>Professional home maintenance wherever you are</p>
        </div>

        <div className="areas-grid">
          {areas.map((area) => (
            <div key={area} className="area-tag">
              {area}
            </div>
          ))}
        </div>

        <p className="areas-note">
          And many more cities across India! Contact us for service in your area.
        </p>
      </div>
    </section>
  );
}

export default ServiceAreas;
