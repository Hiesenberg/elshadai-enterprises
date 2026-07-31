import ServiceCard from "../ServiceCard/ServiceCard";
import "./Services.css";
import {
    FaHammer,
    FaPaintRoller,
    FaHouse,
    FaScrewdriverWrench
} from "react-icons/fa6";

import { FaBolt } from "react-icons/fa";


const services = [
  {
    icon: <FaHammer />,
    title: "Carpentry",
    description:"furniture repair and wooden work."
  },
  {
        icon: <FaBolt />,
        title: "Electrical",
        description: "Wiring and electrical maintenance."
    },
    {
        icon: <FaPaintRoller />,
        title: "Painting",
        description: "Interior and exterior painting services."
    },
    {
        icon: <FaScrewdriverWrench />,
        title: "Welding",
        description: "Metal fabrication and repair services."
    },
    {
        icon: <FaHouse />,
        title: "General Repair",
        description: "Complete home maintenance solutions."
    }
];

function Services() {
    return (
      <section id="services" className="services">
        <h2>Our Services</h2>
        <div className="services-container">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </section>
    );
}

export default Services;

