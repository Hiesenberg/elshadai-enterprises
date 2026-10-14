import { useState, useEffect } from "react";
import ServiceCard from "../ServiceCard/ServiceCard";
import "./Services.css";
import { MdOutlinePlumbing } from "react-icons/md";
import { FaPaintbrush, FaHammer, FaPaintRoller, FaHouse, FaScrewdriverWrench } from "react-icons/fa6";
import { FaBolt } from "react-icons/fa";

const services = [
  {
    icon: <FaHammer />,
    title: "Carpentry",
    description: "Furniture repair • Custom builds • Wood restoration",
    images: ["/works/carpentry/1.jpg", "/works/carpentry/2.jpg", "/works/carpentry/3.jpg", "/works/carpentry/4.jpg", "/works/carpentry/5.jpg", "/works/carpentry/6.jpg"],
  },
  {
    icon: <FaBolt />,
    title: "Electrical",
    description: "Wiring • Switches • Fixtures • Safety first",
    images: ["/works/electrical/1.jpg"],
  },
  {
    icon: <FaPaintRoller />,
    title: "Painting",
    description: "Interior & exterior • Clean lines • No mess",
    images: ["/works/painting/1.jpg", "/works/painting/2.jpg", "/works/painting/3.jpg", "/works/painting/4.jpg", "/works/painting/5.jpg"],
  },
  {
    icon: <FaScrewdriverWrench />,
    title: "Welding",
    description: "Gates • Grills • Metal work • Built to last",
    images: ["/works/welding/1.jpg"],
  },
  {
    icon: <FaHouse />,
    title: "General Repair",
    description: "Doors • Windows • Locks • Quick fixes",
    images: ["/works/general/1.jpg", "/works/general/2.jpg", "/works/general/3.jpg"],
  },
  {
    icon: <FaPaintbrush />,
    title: "Decorative Finishes",
    description: "Textured walls • Custom patterns • Unique designs",
    images: ["/works/decorative/1.jpg", "/works/decorative/2.jpg", "/works/decorative/3.jpg", "/works/decorative/4.jpg", "/works/decorative/5.jpg", "/works/decorative/6.jpg", "/works/decorative/7.jpg", "/works/decorative/8.jpg", "/works/decorative/9.jpg", "/works/decorative/10.jpg", "/works/decorative/11.jpg", "/works/decorative/12.jpg", "/works/decorative/13.jpg"],
  },
  {
    icon: <MdOutlinePlumbing />,
    title: "Plumbing",
    description: "Leaks fixed • Clogs cleared • Pipes installed",
    images: ["/works/plumbing/1.jpg", "/works/plumbing/2.jpg", "/works/plumbing/3.jpg"],
  },
];

function Services() {
  const [selected, setSelected] = useState(null);

  // Close on Escape + lock background scroll while modal is open
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="services" className="services">
      <h2>Our Services</h2>

      <div className="services-container">
        {services.map((service) => (
          <div
            key={service.title}
            className="service-clickable"
            role="button"
            tabIndex={0}
            onClick={() => setSelected(service)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(service);
              }
            }}
          >
            <ServiceCard
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          </div>
        ))}
      </div>

      {selected && (
        <div className="gallery-overlay" onClick={() => setSelected(null)}>
          <div
            className="gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.title} works`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="gallery-close"
              aria-label="Close gallery"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <h3>{selected.title} – Our Work</h3>

            {selected.images.length ? (
              <div className="gallery-grid">
                {selected.images.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${selected.title} work ${i + 1}`}
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              <p className="gallery-empty">Photos coming soon.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Services;
