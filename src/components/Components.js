// src/components/Components.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
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
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    organization: '',
    position: '',
    attendanceType: '',
    interestedSessions: [],
    certificateRequired: false,
    registrationType: '',
    paymentMethod: '',
    invoiceRequested: false,
    invoiceDetails: '',
    hotelRecommendations: null,
    airportTransfer: null,
  });
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSessionsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const sessions = checked
        ? [...prev.interestedSessions, value]
        : prev.interestedSessions.filter((session) => session !== value);
      return { ...prev, interestedSessions: sessions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.interestedSessions.length === 0) {
      setMessage('Please select at least one session.');
      return;
    }
    if (formData.hotelRecommendations === null || formData.airportTransfer === null) {
      setMessage('Please answer all Yes/No questions.');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('attendees')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          organization: formData.organization || null,
          position: formData.position || null,
          attendance_type: formData.attendanceType,
          interested_sessions: formData.interestedSessions.join(', '),
          certificate_required: formData.certificateRequired,
          registration_type: formData.registrationType,
          payment_method: formData.paymentMethod,
          invoice_requested: formData.invoiceRequested,
          invoice_details: formData.invoiceRequested ? formData.invoiceDetails : null,
          hotel_recommendations: formData.hotelRecommendations,
          airport_transfer: formData.airportTransfer,
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
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          organization: '',
          position: '',
          attendanceType: '',
          interestedSessions: [],
          certificateRequired: false,
          registrationType: '',
          paymentMethod: '',
          invoiceRequested: false,
          invoiceDetails: '',
          hotelRecommendations: null,
          airportTransfer: null,
        });
        setMessage('');
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
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="organization"
          placeholder="Organization/Company"
          value={formData.organization}
          onChange={handleChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Job Title/Position"
          value={formData.position}
          onChange={handleChange}
        />

        <div className="form-group">
          <label>Are you attending in person or virtually?</label>
          <label>
            <input
              type="radio"
              name="attendanceType"
              value="In-Person"
              checked={formData.attendanceType === 'In-Person'}
              onChange={handleChange}
              required
            />
            In-Person
          </label>
          <label>
            <input
              type="radio"
              name="attendanceType"
              value="Virtual"
              checked={formData.attendanceType === 'Virtual'}
              onChange={handleChange}
            />
            Virtual
          </label>
        </div>

        <div className="form-group">
          <label>Select the sessions you're most interested in (choose all that apply):</label>
          {[
            'Keynote: The Next Decade of Impact',
            'Workshop: Fundraising Unleashed',
            'Panel: Tech for Change',
            'Session: Impact That Sticks',
          ].map((session) => (
            <label key={session} className="checkbox-label">
              <input
                type="checkbox"
                name="interestedSessions"
                value={session}
                checked={formData.interestedSessions.includes(session)}
                onChange={handleSessionsChange}
              />
              {session}
            </label>
          ))}
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="certificateRequired"
            checked={formData.certificateRequired}
            onChange={handleChange}
          />
          Do you require a certificate of participation?
        </label>

        <div className="form-group">
          <label>Registration Type:</label>
          <select
            name="registrationType"
            value={formData.registrationType}
            onChange={handleChange}
            required
          >
            <option value="">Select Registration Type</option>
            <option value="General">General</option>
            <option value="Student">Student</option>
            <option value="VIP">VIP</option>
            <option value="Speaker">Speaker</option>
          </select>
        </div>

        <div className="form-group">
          <label>Payment Method:</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Mpesa">Mpesa</option>
            <option value="Credit/Debit Card">Credit/Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="form-group">
          <label>Invoice Request:</label>
          <label>
            <input
              type="radio"
              name="invoiceRequested"
              value="true"
              checked={formData.invoiceRequested === true}
              onChange={() => setFormData((prev) => ({ ...prev, invoiceRequested: true }))}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="invoiceRequested"
              value="false"
              checked={formData.invoiceRequested === false}
              onChange={() => setFormData((prev) => ({ ...prev, invoiceRequested: false, invoiceDetails: '' }))}
            />
            No
          </label>
          {formData.invoiceRequested && (
            <input
              type="text"
              name="invoiceDetails"
              placeholder="Invoice Details (e.g., Company Name, Address)"
              value={formData.invoiceDetails}
              onChange={handleChange}
              required={formData.invoiceRequested}
            />
          )}
        </div>

        <div className="form-group">
          <label>Do you need hotel recommendations?</label>
          <label>
            <input
              type="radio"
              name="hotelRecommendations"
              value="true"
              checked={formData.hotelRecommendations === true}
              onChange={() => setFormData((prev) => ({ ...prev, hotelRecommendations: true }))}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="hotelRecommendations"
              value="false"
              checked={formData.hotelRecommendations === false}
              onChange={() => setFormData((prev) => ({ ...prev, hotelRecommendations: false }))}
            />
            No
          </label>
        </div>

        <div className="form-group">
          <label>Will you require airport transfer?</label>
          <label>
            <input
              type="radio"
              name="airportTransfer"
              value="true"
              checked={formData.airportTransfer === true}
              onChange={() => setFormData((prev) => ({ ...prev, airportTransfer: true }))}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="airportTransfer"
              value="false"
              checked={formData.airportTransfer === false}
              onChange={() => setFormData((prev) => ({ ...prev, airportTransfer: false }))}
            />
            No
          </label>
        </div>

        <button type="submit">Register</button>
      </form>
      {message && <p className="form-message">{message}</p>}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>You're registered! See you in Nairobi.</p>
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
        </div>
        <div className="speaker">
          <img src="/speaker2.jpg" alt="Shanice Singirankabo" className="speaker-image" />
          <h3>Shanice Singirankabo</h3>
          <p>Speaker</p>
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
            <p>You're in the loop!</p>
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
    { q: "What's Nonprofit Konnect?", a: "Nonprofit Konnect is a platform dedicated to connecting and empowering nonprofit organizations. Click the button below to learn more." },
    { q: "How do I register?", a: "Just fill out the form above—it takes less than a minute!" },
    { q: "When's the deadline?", a: "October 31, 2025, or when we're full—secure your spot soon!" },
    { q: "Where should I stay?", a: "We'll email you a list of nearby hotels after you register." },
    { q: "What's the dress code?", a: "Business casual—look sharp, feel comfy." },
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
              {index === 0 && (
                <a href="https://nonprofitkonnect.org/" target="_blank" rel="noopener noreferrer" className="cta-button" style={{ marginTop: '10px', display: 'inline-block' }}>
                  Read More
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}