// src/App.js
import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { EventDetails, RegistrationForm, Speakers, Schedule, Testimonials, SocialMedia, EmailSignup, ContactInfo, FAQ } from './components/Components';
import AdminPage from './components/AdminPage';
import './App.css';

function Header({ scheduleRef, speakersRef, registerRef, testimonialsRef, contactRef, faqRef }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Close the menu on mobile after clicking
    }
  };

  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/nonprofit-konnect-logo.png" alt="Nonprofit Konnect Summit 2025" className="logo-image" />
        </Link>
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          ☰
        </button>
        <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><button onClick={() => scrollToSection(scheduleRef)}>Schedule</button></li>
            <li><button onClick={() => scrollToSection(speakersRef)}>Speakers</button></li>
            <li><button onClick={() => scrollToSection(registerRef)}>Register</button></li>
            <li><button onClick={() => scrollToSection(testimonialsRef)}>Testimonials</button></li>
            <li><button onClick={() => scrollToSection(contactRef)}>Contact</button></li>
            <li><button onClick={() => scrollToSection(faqRef)}>FAQ</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function App() {
  const scheduleRef = useRef(null);
  const speakersRef = useRef(null);
  const registerRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const faqRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Router>
      <div className="App">
        <Header
          scheduleRef={scheduleRef}
          speakersRef={speakersRef}
          registerRef={registerRef}
          testimonialsRef={testimonialsRef}
          contactRef={contactRef}
          faqRef={faqRef}
        />
        <Routes>
          <Route
            path="/"
            element={
              <main className="main-content">
                <EventDetails scrollToRegister={() => scrollToSection(registerRef)} />
                <section ref={scheduleRef} className="section"><Schedule /></section>
                <section ref={speakersRef} className="section"><Speakers /></section>
                <section ref={registerRef} className="section">
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <button className="cta-button" onClick={() => scrollToSection(registerRef)}>Register Here</button>
                  </div>
                  <RegistrationForm />
                </section>
                <section ref={testimonialsRef} className="section"><Testimonials /></section>
                <section className="section"><SocialMedia /></section>
                <section className="section"><EmailSignup /></section>
                <section ref={contactRef} className="section">
                  <ContactInfo />
                  <button className="cta-button" onClick={() => scrollToSection(contactRef)}>Get in Touch</button>
                </section>
                <section ref={faqRef} className="section"><FAQ /></section>
              </main>
            }
          />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <footer className="footer">
          <div className="container">
            <p>© 2025 Nonprofit Konnect. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;