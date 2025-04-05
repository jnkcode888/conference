// src/App.js
import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { EventDetails, RegistrationForm, Speakers, Schedule, Testimonials, SocialMedia, EmailSignup, ContactInfo, FAQ } from './components/Components';
import AdminPage from './components/AdminPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  const eventDetailsRef = useRef(null);
  const scheduleRef = useRef(null);
  const speakersRef = useRef(null);
  const registerRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const faqRef = useRef(null);
  const [showForm, setShowForm] = useState(false);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    scrollToSection(registerRef);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header
                  scheduleRef={scheduleRef}
                  speakersRef={speakersRef}
                  registerRef={registerRef}
                  testimonialsRef={testimonialsRef}
                  contactRef={contactRef}
                  faqRef={faqRef}
                  eventDetailsRef={eventDetailsRef}
                  isAuthenticated={false}
                />
                <main className="main-content">
                  <section ref={eventDetailsRef}>
                    <EventDetails scrollToRegister={() => scrollToSection(registerRef)} />
                  </section>
                  <section ref={scheduleRef} className="section"><Schedule /></section>
                  <section ref={speakersRef} className="section"><Speakers /></section>
                  <section ref={registerRef} className="section">
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem" }}>
                      <button className="cta-button" onClick={toggleForm}>
                        {showForm ? "Hide Registration" : "Register Here"}
                      </button>
                    </div>
                    <div className={`form-container ${showForm ? 'show' : 'hide'}`}>
                      <RegistrationForm />
                    </div>
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
                <Footer />
              </>
            }
          />
          <Route path="/admin" element={<><AdminPage /><Footer /></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;