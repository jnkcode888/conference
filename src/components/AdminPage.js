// src/components/AdminPage.js
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FaSearch, FaFileExport, FaUsers, FaEnvelope } from 'react-icons/fa';
import Header from './Header';
import './AdminPage.css';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  // Filter states
  const [attendanceFilter, setAttendanceFilter] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [certificateFilter, setCertificateFilter] = useState('');
  const [registrationFilter, setRegistrationFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [hotelFilter, setHotelFilter] = useState('');
  const [transferFilter, setTransferFilter] = useState('');

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
    setAttendanceFilter('');
    setSessionFilter('');
    setCertificateFilter('');
    setRegistrationFilter('');
    setPaymentFilter('');
    setInvoiceFilter('');
    setHotelFilter('');
    setTransferFilter('');
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
      'Full Name,Email,Phone Number,Organization,Position,Attendance Type,Interested Sessions,Certificate Required,Registration Type,Payment Method,Invoice Requested,Invoice Details,Hotel Recommendations,Airport Transfer',
      ...data.map(item =>
        `${item.full_name},${item.email},${item.phone_number || ''},${item.organization || ''},${item.position || ''},${item.attendance_type || ''},${item.interested_sessions || ''},${item.certificate_required ? 'Yes' : 'No'},${item.registration_type || ''},${item.payment_method || ''},${item.invoice_requested ? 'Yes' : 'No'},${item.invoice_details || ''},${item.hotel_recommendations ? 'Yes' : 'No'},${item.airport_transfer ? 'Yes' : 'No'}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = (
      (attendee.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (attendee.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (attendee.phone_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (attendee.organization?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (attendee.position?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const matchesAttendance = !attendanceFilter || attendee.attendance_type === attendanceFilter;
    const matchesSession = !sessionFilter || (attendee.interested_sessions || '').includes(sessionFilter);
    const matchesCertificate = !certificateFilter || (certificateFilter === 'Yes' ? attendee.certificate_required : !attendee.certificate_required);
    const matchesRegistration = !registrationFilter || attendee.registration_type === registrationFilter;
    const matchesPayment = !paymentFilter || attendee.payment_method === paymentFilter;
    const matchesInvoice = !invoiceFilter || (invoiceFilter === 'Yes' ? attendee.invoice_requested : !attendee.invoice_requested);
    const matchesHotel = !hotelFilter || (hotelFilter === 'Yes' ? attendee.hotel_recommendations : !attendee.hotel_recommendations);
    const matchesTransfer = !transferFilter || (transferFilter === 'Yes' ? attendee.airport_transfer : !attendee.airport_transfer);

    return (
      matchesSearch &&
      matchesAttendance &&
      matchesSession &&
      matchesCertificate &&
      matchesRegistration &&
      matchesPayment &&
      matchesInvoice &&
      matchesHotel &&
      matchesTransfer
    );
  });

  const filteredSubscribers = subscribers.filter(subscriber =>
    (subscriber.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const attendanceStats = {
    inPerson: attendees.filter(a => a.attendance_type === 'In-Person').length,
    virtual: attendees.filter(a => a.attendance_type === 'Virtual').length,
  };

  const sessionStats = {
    keynote: attendees.filter(a => a.interested_sessions?.includes('Keynote: The Next Decade of Impact')).length,
    workshop: attendees.filter(a => a.interested_sessions?.includes('Workshop: Fundraising Unleashed')).length,
    panel: attendees.filter(a => a.interested_sessions?.includes('Panel: Tech for Change')).length,
    impact: attendees.filter(a => a.interested_sessions?.includes('Session: Impact That Sticks')).length,
  };

  const certificateStats = {
    yes: attendees.filter(a => a.certificate_required).length,
    no: attendees.filter(a => !a.certificate_required).length,
  };

  const registrationStats = {
    general: attendees.filter(a => a.registration_type === 'General').length,
    student: attendees.filter(a => a.registration_type === 'Student').length,
    vip: attendees.filter(a => a.registration_type === 'VIP').length,
    speaker: attendees.filter(a => a.registration_type === 'Speaker').length,
  };

  const paymentStats = {
    mpesa: attendees.filter(a => a.payment_method === 'Mpesa').length,
    card: attendees.filter(a => a.payment_method === 'Credit/Debit Card').length,
    bank: attendees.filter(a => a.payment_method === 'Bank Transfer').length,
  };

  const invoiceStats = {
    yes: attendees.filter(a => a.invoice_requested).length,
    no: attendees.filter(a => !a.invoice_requested).length,
  };

  const hotelStats = {
    yes: attendees.filter(a => a.hotel_recommendations).length,
    no: attendees.filter(a => !a.hotel_recommendations).length,
  };

  const transferStats = {
    yes: attendees.filter(a => a.airport_transfer).length,
    no: attendees.filter(a => !a.airport_transfer).length,
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <Header isAuthenticated={false} />
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
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper">
      <Header 
        isAuthenticated={true} 
        onLogout={handleLogout} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        attendeesCount={filteredAttendees.length}
        subscribersCount={filteredSubscribers.length}
      />
      <main className="admin-content">
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
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>Attendance Type</h3>
                <p>In-Person: {attendanceStats.inPerson}</p>
                <p>Virtual: {attendanceStats.virtual}</p>
              </div>
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>Interested Sessions</h3>
                <p>Keynote: {sessionStats.keynote}</p>
                <p>Workshop: {sessionStats.workshop}</p>
                <p>Panel: {sessionStats.panel}</p>
                <p>Impact: {sessionStats.impact}</p>
              </div>
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>Certificate Required</h3>
                <p>Yes: {certificateStats.yes}</p>
                <p>No: {certificateStats.no}</p>
              </div>
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>Registration Type</h3>
                <p>General: {registrationStats.general}</p>
                <p>Student: {registrationStats.student}</p>
                <p>VIP: {registrationStats.vip}</p>
                <p>Speaker: {registrationStats.speaker}</p>
              </div>
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>Payment Method</h3>
                <p>Mpesa: {paymentStats.mpesa}</p>
                <p>Card: {paymentStats.card}</p>
                <p>Bank: {paymentStats.bank}</p>
              </div>
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>Invoice Request</h3>
                <p>Yes: {invoiceStats.yes}</p>
                <p>No: {invoiceStats.no}</p>
              </div>
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>Hotel Recommendations</h3>
                <p>Yes: {hotelStats.yes}</p>
                <p>No: {hotelStats.no}</p>
              </div>
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>Airport Transfer</h3>
                <p>Yes: {transferStats.yes}</p>
                <p>No: {transferStats.no}</p>
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
              <h3>Attendees ({filteredAttendees.length})</h3>
              {filteredAttendees.length > 0 && (
                <button
                  onClick={() => exportToCSV(filteredAttendees, 'attendees.csv')}
                  className="export-button"
                >
                  <FaFileExport /> Export
                </button>
              )}
            </div>
            <div className="filter-controls">
              <div className="filter-group">
                <label>Attendance Type:</label>
                <select value={attendanceFilter} onChange={(e) => setAttendanceFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Interested Sessions:</label>
                <select value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Keynote: The Next Decade of Impact">Keynote</option>
                  <option value="Workshop: Fundraising Unleashed">Workshop</option>
                  <option value="Panel: Tech for Change">Panel</option>
                  <option value="Session: Impact That Sticks">Impact</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Certificate Required:</label>
                <select value={certificateFilter} onChange={(e) => setCertificateFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Registration Type:</label>
                <select value={registrationFilter} onChange={(e) => setRegistrationFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="General">General</option>
                  <option value="Student">Student</option>
                  <option value="VIP">VIP</option>
                  <option value="Speaker">Speaker</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Payment Method:</label>
                <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Mpesa">Mpesa</option>
                  <option value="Credit/Debit Card">Credit/Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Invoice Request:</label>
                <select value={invoiceFilter} onChange={(e) => setInvoiceFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Hotel Recommendations:</label>
                <select value={hotelFilter} onChange={(e) => setHotelFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Airport Transfer:</label>
                <select value={transferFilter} onChange={(e) => setTransferFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            {filteredAttendees.length > 0 ? (
              <>
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Organization</th>
                        <th>Position</th>
                        <th>Attendance</th>
                        <th>Sessions</th>
                        <th>Certificate</th>
                        <th>Reg Type</th>
                        <th>Payment</th>
                        <th>Invoice</th>
                        <th>Invoice Details</th>
                        <th>Hotel</th>
                        <th>Transfer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendees.map((attendee) => (
                        <tr key={attendee.id}>
                          <td>{attendee.id}</td>
                          <td>{attendee.full_name}</td>
                          <td>{attendee.email}</td>
                          <td>{attendee.phone_number || '-'}</td>
                          <td>{attendee.organization || '-'}</td>
                          <td>{attendee.position || '-'}</td>
                          <td>{attendee.attendance_type || '-'}</td>
                          <td>{attendee.interested_sessions || '-'}</td>
                          <td>{attendee.certificate_required ? 'Yes' : 'No'}</td>
                          <td>{attendee.registration_type || '-'}</td>
                          <td>{attendee.payment_method || '-'}</td>
                          <td>{attendee.invoice_requested ? 'Yes' : 'No'}</td>
                          <td>{attendee.invoice_details || '-'}</td>
                          <td>{attendee.hotel_recommendations ? 'Yes' : 'No'}</td>
                          <td>{attendee.airport_transfer ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-list">
                  {filteredAttendees.map((attendee) => (
                    <div key={attendee.id} className="attendee-card">
                      <p><strong>ID:</strong> {attendee.id}</p>
                      <p><strong>Name:</strong> {attendee.full_name}</p>
                      <p><strong>Email:</strong> {attendee.email}</p>
                      <p><strong>Phone:</strong> {attendee.phone_number || '-'}</p>
                      <p><strong>Organization:</strong> {attendee.organization || '-'}</p>
                      <p><strong>Position:</strong> {attendee.position || '-'}</p>
                      <p><strong>Attendance:</strong> {attendee.attendance_type || '-'}</p>
                      <p><strong>Sessions:</strong> {attendee.interested_sessions || '-'}</p>
                      <p><strong>Certificate:</strong> {attendee.certificate_required ? 'Yes' : 'No'}</p>
                      <p><strong>Reg Type:</strong> {attendee.registration_type || '-'}</p>
                      <p><strong>Payment:</strong> {attendee.payment_method || '-'}</p>
                      <p><strong>Invoice:</strong> {attendee.invoice_requested ? 'Yes' : 'No'}</p>
                      <p><strong>Invoice Details:</strong> {attendee.invoice_details || '-'}</p>
                      <p><strong>Hotel:</strong> {attendee.hotel_recommendations ? 'Yes' : 'No'}</p>
                      <p><strong>Transfer:</strong> {attendee.airport_transfer ? 'Yes' : 'No'}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="no-data">No attendees match your filters.</p>
            )}
          </div>
        )}

        {activeSection === 'subscribers' && (
          <div className="data-section">
            <div className="section-header">
              <h3>Newsletter Subscribers ({filteredSubscribers.length})</h3>
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
      </main>
    </div>
  );
}

export default AdminPage;