import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

function WhatsAppButton() {
  const phoneNumber = "918088618213"; // Format: country code + number (no +, spaces, or dashes)
  const message = "Hi! I found your website and need help with home maintenance.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
}

export default WhatsAppButton;
