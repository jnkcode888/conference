// src/components/Components.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Adjust path based on your structure
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

// EventDetails
export function EventDetails({ scrollToRegister }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Shape the Future of Impact</h1>
        <p className="tagline">Nonprofit Konnect Summit 2025 | Nairobi, Kenya</p>
        <p>November 10-11 | KICC</p>
        <p>Connect with 500+ visionaries to spark change that lasts.</p>
        <button className="cta-button" onClick={scrollToRegister}>Join the Movement</button>
      </div>
    </section>
  );
}

// RegistrationForm
export function RegistrationForm() {
  const [formData, setFormData] = useState({ fullName: '', email: '', organization: '', position: '' });
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('attendees')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          organization: formData.organization || null,
          position: formData.position || null,
        }])
        .select();

      if (error) {
        if (error.code === '23505') {
          setMessage('This email is already registered!');
        } else {
          console.error('Supabase Registration Error:', error.message, error.details, error.hint);
          setMessage(`Registration failed: ${error.message}`);
        }
      } else {
        console.log('Registration Success:', data);
        setShowPopup(true);
        setFormData({ fullName: '', email: '', organization: '', position: '' });
        setTimeout(() => setShowPopup(false), 3000);
      }
    } catch (err) {
      console.error('Unexpected Error:', err);
      setMessage('Oops! Something went wrong. Please try again.');
    }
  };

  return (
    <section>
      <h2>Secure Your Spot</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="organization" placeholder="Organization" value={formData.organization} onChange={handleChange} />
        <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      {message && <p className="form-message">{message}</p>}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>You’re registered! See you in Nairobi.</p>
          </div>
        </div>
      )}
    </section>
  );
}

// Speakers
export function Speakers() {
  return (
    <section>
      <h2>Meet the Change Makers</h2>
      <div className="speaker-grid">
        <div className="speaker">
          <img src="/speaker1.jpg" alt="Dr. Amina Otieno" className="speaker-image" />
          <h3>Dr. Amina Otieno</h3>
          <p>Innovator | Keynote Speaker</p>
          <p>Pioneering nonprofit solutions for over two decades.</p>
        </div>
        <div className="speaker">
          <img src="/speaker2.jpg" alt="Shanice Singirankabo" className="speaker-image" />
          <h3>Shanice Singirankabo</h3>
          <p>Fundraising Guru</p>
          <p>Mastermind behind $10M+ in grassroots funding.</p>
        </div>
      </div>
    </section>
  );
}

// Schedule
export function Schedule() {
  return (
    <section>
      <h2>Your Summit Journey</h2>
      <div className="schedule-grid">
        <div className="schedule-item">
          <h3>Day 1 - Nov 10</h3>
          <p><strong>9:00 AM:</strong> Keynote: The Next Decade of Impact</p>
          <p><strong>11:00 AM:</strong> Workshop: Fundraising Unleashed</p>
          <p><strong>2:00 PM:</strong> Panel: Tech for Change</p>
        </div>
        <div className="schedule-item">
          <h3>Day 2 - Nov 11</h3>
          <p><strong>10:00 AM:</strong> Session: Impact That Sticks</p>
          <p><strong>1:00 PM:</strong> Networking Lunch</p>
          <p><strong>3:00 PM:</strong> Closing: Vision Forward</p>
        </div>
      </div>
    </section>
  );
}

// Testimonials
export function Testimonials() {
  return (
    <section>
      <h2>Why They Love It</h2>
      <div className="testimonial-grid">
        <blockquote>"This summit rewrote our playbook!" – Jane Doe</blockquote>
        <blockquote>"Pure inspiration in action." – John Smith</blockquote>
      </div>
      <p className="impact-stat">300+ partnerships born last year.</p>
    </section>
  );
}

// SocialMedia
export function SocialMedia() {
  const shareUrl = 'https://nonprofitkonnectsummit.org';
  const title = 'Join me at Nonprofit Konnect Summit 2025!';

  return (
    <section>
      <h2>Share the Buzz</h2>
      <div className="social-links">
        <a href={`https://facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer"><FaFacebook size={30} /></a>
        <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`} target="_blank" rel="noopener noreferrer"><FaTwitter size={30} /></a>
        <a href={`https://linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer"><FaLinkedin size={30} /></a>
      </div>
    </section>
  );
}

// EmailSignup
export function EmailSignup() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])
        .select();

      if (error) {
        if (error.code === '23505') {
          setMessage('This email is already subscribed!');
        } else {
          console.error('Supabase Subscription Error:', error.message, error.details, error.hint);
          setMessage(`Subscription failed: ${error.message}`);
        }
      } else {
        console.log('Subscription Success:', data);
        setShowPopup(true);
        setEmail('');
        setTimeout(() => setShowPopup(false), 3000);
      }
    } catch (err) {
      console.error('Unexpected Error:', err);
      setMessage('Oops! Something went wrong. Please try again.');
    }
  };

  return (
    <section>
      <h2>Stay in the Know</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" required />
        <button type="submit">Subscribe</button>
      </form>
      {message && <p className="form-message">{message}</p>}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>You’re in the loop!</p>
          </div>
        </div>
      )}
    </section>
  );
}

// ContactInfo
export function ContactInfo() {
  return (
    <section>
      <h2>Reach Out</h2>
      <p><strong>Email:</strong> info@nonprofitkonnect.org</p>
      <p><strong>Phone:</strong> +254 115265874</p>
      <p><strong>Venue:</strong> KICC, Nairobi, Kenya</p>
    </section>
  );
}

// FAQ
export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "How do I register?", a: "Just fill out the form above—it takes less than a minute!" },
    { q: "When’s the deadline?", a: "October 31, 2025, or when we’re full—secure your spot soon!" },
    { q: "Where should I stay?", a: "We’ll email you a list of nearby hotels after you register." },
    { q: "What’s the dress code?", a: "Business casual—look sharp, feel comfy." },
    { q: "Who do I contact?", a: "Email us at info@nonprofitkonnect.org or call +254 115265874." },
  ];

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section>
      <h2>Curious?</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.q}
              <span className="faq-toggle">{openIndex === index ? '–' : '+'}</span>
            </button>
            <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}