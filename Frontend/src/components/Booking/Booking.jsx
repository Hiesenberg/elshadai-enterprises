import { useState } from "react";
import "./Booking.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { API_URL } from "../../config";

function Booking() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatusMessage("");
    setIsLoading(true);

    const bookingData = {
      name,
      email,
      phone,
      service,
      location,
      message,
    };

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsSuccess(false);
        setStatusMessage(data.message);
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setStatusMessage(
        "✅ Thank you! Your booking has been received. We'll contact you shortly."
      );

      setName("");
      setEmail("");
      setPhone("");
      setService("");
      setLocation("");
      setMessage("");
    } catch (error) {
      console.error("Network Error:", error);

      setIsSuccess(false);
      setStatusMessage("❌ Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="booking" className="booking">
      <div className="booking-container">

        {/* Left Side */}
        <div className="booking-content">
          <h2>Book Our Service</h2>

          <p>
            Looking for reliable home maintenance services?
            Fill out the form and our team will contact you shortly.
          </p>

          <div className="contact-info">
            <p>
              <FaPhone /> +91 98765 43210
            </p>

            <p>
              <FaEnvelope /> elshadaienterprises@gmail.com
            </p>

            <p>
              <FaMapMarkerAlt /> Bangalore, Karnataka
            </p>
          </div>
        </div>

        {/* Right Side */}
        <form className="booking-form" onSubmit={handleSubmit}>

          <label>Name</label>
          <input
            type="text"
            value={name}
            required
            disabled={isLoading}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            required
            disabled={isLoading}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Phone</label>
          <input
            type="tel"
            value={phone}
            required
            disabled={isLoading}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label>Service</label>
          <select
            value={service}
            required
            disabled={isLoading}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Select a Service</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Electrical">Electrical</option>
            <option value="Painting">Painting</option>
            <option value="Welding">Welding</option>
            <option value="General Repair">General Repair</option>
          </select>

          <label>Location</label>
          <select
            value={location}
            required
            disabled={isLoading}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select a Location</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mysore">Mysore</option>
            <option value="Tumkur">Tumkur</option>
            <option value="Chennai">Chennai</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>

          <label>Message</label>
          <textarea
            rows="3"
            value={message}
            disabled={isLoading}
            onChange={(e) => setMessage(e.target.value)}
          />

          {statusMessage && (
            <p
              style={{
                color: isSuccess ? "green" : "red",
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: "15px",
              }}
            >
              {statusMessage}
            </p>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Booking..." : "Book Now"}
          </button>

        </form>
      </div>
    </section>
  );
}

export default Booking;