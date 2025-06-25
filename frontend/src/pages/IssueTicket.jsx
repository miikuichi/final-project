import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HRNavBar } from '../components/NavBar';
import { useTickets } from '../components/TicketContext';
import './IssueTicket.css';

const categories = [
  'Log In error',
  'Forgot Password',
  'Application Error',
];

export default function IssueTicket() {
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  const [category, setCategory] = useState(categories[0]);
  const [details, setDetails] = useState('');
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details.trim() || !name.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    addTicket({ category, details, name });
    setShowModal(true);
    setError('');
    let timer = 3;
    setCountdown(timer);
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer === 0) {
        clearInterval(interval);
        navigate('/hr'); // redirect to HR dashboard
      }
    }, 1000);
  };

  return (
    <div>
      <HRNavBar 
        onHome={() => navigate('/hr')} 
        onIssueTicket={() => window.location.reload()} 
        onLogout={() => navigate('/')} 
      />
      <div
        className="issue-ticket-container"
        style={{
          background: '#fff',
          borderRadius: '1.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          maxWidth: 400,
          margin: '4.5rem auto 0 auto',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2>Issue Ticket</h2>
        <form
          className="issue-ticket-form"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
          }}
          onSubmit={handleSubmit}
        >
          <label style={{ fontWeight: 500, marginBottom: '0.2rem' }}>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ padding: '0.7rem 1rem', borderRadius: '1rem', border: '1.5px solid #4f8cff', fontSize: '1rem' }}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <label style={{ fontWeight: 500, marginBottom: '0.2rem' }}>
            Details <span style={{ color: '#e11d48' }}>*</span>
          </label>
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            style={{ padding: '0.7rem 1rem', borderRadius: '1rem', border: '1.5px solid #4f8cff', fontSize: '1rem', resize: 'vertical' }}
          />
          <label style={{ fontWeight: 500, marginBottom: '0.2rem' }}>
            Name <span style={{ color: '#e11d48' }}>*</span>
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ padding: '0.7rem 1rem', borderRadius: '1rem', border: '1.5px solid #4f8cff', fontSize: '1rem' }}
          />
          <button
            type="submit"
            style={{
              background: '#4f8cff',
              color: '#fff',
              border: 'none',
              borderRadius: '1rem',
              padding: '0.7rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
              ...( (!details.trim() || !name.trim()) && { background: '#b3c6f7', cursor: 'not-allowed' })
            }}
            disabled={!details.trim() || !name.trim()}
          >
            Submit Ticket
          </button>
          {error && <div style={{ color: '#e11d48', marginTop: '0.5rem', fontSize: '0.95rem' }}>{error}</div>}
        </form>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Ticket Submitted!</h3>
              <p>Redirecting to dashboard in {countdown}...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
