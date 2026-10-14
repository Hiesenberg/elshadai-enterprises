import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import ServiceAreas from "./components/ServiceAreas/ServiceAreas";
import About from "./components/About/About";
import Booking from "./components/Booking/Booking";
import Footer from "./components/Footer/Footer";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";

import Admin from "./pages/Admin";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <ServiceAreas />
      <About />
      <Booking />
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;