// src/components/AdminPage.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FaSearch, FaSignOutAlt, FaFileExport, FaBars, FaUsers, FaEnvelope } from 'react-icons/fa';
import './AdminPage.css';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin2025') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      setError('');
      fetchData();
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setAttendees([]);
    setSubscribers([]);
    setPassword('');
    setSearchTerm('');
    setActiveSection('dashboard');
    setIsMenuOpen(false);
  };

  const fetchData = async () => {
    const { data: attendeesData, error: attendeesError } = await supabase
      .from('attendees')
      .select('*');
    if (attendeesError) {
      console.error('Error fetching attendees:', attendeesError);
      setError('Failed to fetch attendees');
    } else {
      setAttendees(attendeesData);
    }

    const { data: subscribersData, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('*');
    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      setError('Failed to fetch subscribers');
    } else {
      setSubscribers(subscribersData);
    }
  };

  const exportToCSV = (data, filename) => {
    const csv = [
      filename === 'attendees.csv'
        ? 'Full Name,Email,Organization,Position'
        : 'Email',
      ...data.map(item =>
        filename === 'attendees.csv'
          ? `${item.full_name},${item.email},${item.organization || ''},${item.position || ''}`
          : `${item.email}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const filteredAttendees = attendees.filter(attendee =>
    (attendee.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (attendee.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (attendee.organization?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (attendee.position?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(subscriber =>
    (subscriber.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleMenuSelect = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <section className="admin-login">
        <div className="login-container">
          <h2>Welcome, Admin</h2>
          <p>Unlock the dashboard with your key.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="login-input"
            />
            <button type="submit" className="login-button">Login</button>
          </form>
          {error && <p className="form-message error">{error}</p>}
        </div>
      </section>
    );
  }

  return (
    <div className="admin-page-wrapper">
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src="/nonprofit-konnect-logo.png" alt="Nonprofit Konnect Summit 2025" className="logo-image" />
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            <FaBars />
          </button>
          <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-links">
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
                  <FaUsers /> Attendees ({filteredAttendees.length})
                </button>
              </li>
              <li>
                <button
                  className={activeSection === 'subscribers' ? 'active' : ''}
                  onClick={() => handleMenuSelect('subscribers')}
                >
                  <FaEnvelope /> Subscribers ({filteredSubscribers.length})
                </button>
              </li>
              <li>
                <button onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="admin-page">
        <div className="admin-content">
          {activeSection === 'dashboard' && (
            <div className="dashboard-overview">
              <h2>Admin Dashboard</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <FaUsers className="stat-icon" />
                  <h3>Total Attendees</h3>
                  <p>{attendees.length}</p>
                </div>
                <div className="stat-card">
                  <FaEnvelope className="stat-icon" />
                  <h3>Total Subscribers</h3>
                  <p>{subscribers.length}</p>
                </div>
              </div>
            </div>
          )}

          {(activeSection === 'attendees' || activeSection === 'subscribers') && (
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeSection === 'attendees' ? 'attendees' : 'subscribers'}...`}
                className="search-input"
              />
            </div>
          )}

          {activeSection === 'attendees' && (
            <div className="data-section">
              <div className="section-header">
                <h3>Attendees</h3>
                {filteredAttendees.length > 0 && (
                  <button
                    onClick={() => exportToCSV(filteredAttendees, 'attendees.csv')}
                    className="export-button"
                  >
                    <FaFileExport /> Export
                  </button>
                )}
              </div>
              {filteredAttendees.length > 0 ? (
                <>
                  {/* Table for larger screens */}
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Organization</th>
                          <th>Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAttendees.map((attendee) => (
                          <tr key={attendee.id}>
                            <td>{attendee.id}</td>
                            <td>{attendee.full_name}</td>
                            <td>{attendee.email}</td>
                            <td>{attendee.organization || '-'}</td>
                            <td>{attendee.position || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Card layout for smaller screens */}
                  <div className="card-list">
                    {filteredAttendees.map((attendee) => (
                      <div key={attendee.id} className="attendee-card">
                        <p><strong>ID:</strong> {attendee.id}</p>
                        <p><strong>Name:</strong> {attendee.full_name}</p>
                        <p><strong>Email:</strong> {attendee.email}</p>
                        <p><strong>Organization:</strong> {attendee.organization || '-'}</p>
                        <p><strong>Position:</strong> {attendee.position || '-'}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="no-data">No attendees match your search.</p>
              )}
            </div>
          )}

          {activeSection === 'subscribers' && (
            <div className="data-section">
              <div className="section-header">
                <h3>Newsletter Subscribers</h3>
                {filteredSubscribers.length > 0 && (
                  <button
                    onClick={() => exportToCSV(filteredSubscribers, 'subscribers.csv')}
                    className="export-button"
                  >
                    <FaFileExport /> Export
                  </button>
                )}
              </div>
              {filteredSubscribers.length > 0 ? (
                <>
                  {/* Table for larger screens */}
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubscribers.map((subscriber) => (
                          <tr key={subscriber.id}>
                            <td>{subscriber.id}</td>
                            <td>{subscriber.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Card layout for smaller screens */}
                  <div className="card-list">
                    {filteredSubscribers.map((subscriber) => (
                      <div key={subscriber.id} className="subscriber-card">
                        <p><strong>ID:</strong> {subscriber.id}</p>
                        <p><strong>Email:</strong> {subscriber.email}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="no-data">No subscribers match your search.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminPage;