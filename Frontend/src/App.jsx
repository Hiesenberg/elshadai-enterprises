import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import About from "./components/About/About";
import Booking from "./components/Booking/Booking";
import Footer from "./components/Footer/Footer";

import Admin from "./pages/Admin";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Booking />
      <Footer />
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