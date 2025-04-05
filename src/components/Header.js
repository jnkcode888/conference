// src/components/Header.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaUsers, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import '../App.css';

function Header({ 
  scheduleRef, 
  speakersRef, 
  registerRef, 
  testimonialsRef, 
  contactRef, 
  faqRef, 
  eventDetailsRef, 
  isAuthenticated, 
  onLogout, 
  activeSection, 
  setActiveSection,
  attendeesCount,
  subscribersCount
}) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scrollToSection(eventDetailsRef);
    }
    setIsMenuOpen(false);
  };

  const handleMenuSelect = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  // Admin authenticated navbar
  if (location.pathname === '/admin' && isAuthenticated) {
    return (
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <img src="/nonprofit-konnect-logo.png" alt="Nonprofit Konnect Summit 2025" className="logo-image" />
          </Link>
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
            <FaBars />
          </button>
          <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li>
                <button 
                  className={activeSection === 'dashboard' ? 'active' : ''} 
                  onClick={() => handleMenuSelect('dashboard')}
                >
                  <FaUsers /> Dashboard
                </button>
              </li>
              <li>
                <button 
                  className={activeSection === 'attendees' ? 'active' : ''} 
                  onClick={() => handleMenuSelect('attendees')}
                >
                  <FaUsers /> Attendees ({attendeesCount})
                </button>
              </li>
              <li>
                <button 
                  className={activeSection === 'subscribers' ? 'active' : ''} 
                  onClick={() => handleMenuSelect('subscribers')}
                >
                  <FaEnvelope /> Subscribers ({subscribersCount})
                </button>
              </li>
              <li>
                <button onClick={onLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  // Admin login page navbar
  if (location.pathname === '/admin' && !isAuthenticated) {
    return (
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <img src="/nonprofit-konnect-logo.png" alt="Nonprofit Konnect Summit 2025" className="logo-image" />
          </Link>
          <nav className="navbar simple">
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  // Main page navbar
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/nonprofit-konnect-logo.png" alt="Nonprofit Konnect Summit 2025" className="logo-image" />
        </Link>
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          <FaBars />
        </button>
        <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" onClick={handleHomeClick}>Home</Link>
            </li>
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

export default Header;