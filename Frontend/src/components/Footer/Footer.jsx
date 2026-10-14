import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">


                <div className="footer-about">
                    <h2>Elshadai Enterprises</h2>
                    <p>
                        Professional home maintenance across India.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#home" >Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#booking">Booking</a></li>
                    </ul>
                </div>

                <div className="footer-services">
                    <h3>Services</h3>
                    <ul>
                        <li>Carpentry</li>
                        <li>Electrical</li>
                        <li>Painting</li>
                        <li>Welding</li>
                        <li>Plumbing</li>
                        <li>Decorative Finishes</li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3>Contact</h3>
                    <p><FaPhone /> +91 8088618213</p>
                    <p><FaEnvelope /> rahulramya45@gmail.com</p>
                    <p><FaMapMarkerAlt /> Serving All Over India</p>
                </div>

            </div>
            <div className="footer-bottom">
    <p>
        © 2026 Elshadai Enterprises. All Rights Reserved.
    </p>
</div>
        </footer>
    );
}

export default Footer;