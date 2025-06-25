import React, { useState } from 'react';
import { AdminNavBar, HRNavBar } from '../components/NavBar';
import { useTickets } from '../components/TicketContext';
import { useRole } from '../components/RoleContext';
import './ManageTickets.css';

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 3) + '...' : str;
}

export default function ManageTickets() {
  const { tickets, removeTicket } = useTickets();
  const [selected, setSelected] = useState(null);
  const { role } = useRole();

  return (
    <div>
      {role === 'admin' ? (
        <AdminNavBar onHome={() => window.location.assign('/admin')} onLogout={() => { localStorage.removeItem('userRole'); window.location.assign('/'); }} />
      ) : (
        <HRNavBar onHome={() => window.location.assign('/hr')} onIssueTicket={() => window.location.assign('/issue-ticket')} onLogout={() => { localStorage.removeItem('userRole'); window.location.assign('/'); }} />
      )}
      <div
        className="manage-tickets-container"
        style={{
          background: '#fff',
          borderRadius: '1.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          minWidth: '50vw',
          minHeight: '80vh',
          margin: '4.5rem auto 0 auto',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2>Manage Tickets</h2>
        <div className="ticket-list">
          {tickets.length === 0 && <div className="no-tickets">No tickets issued.</div>}
          {tickets.map(ticket => (
            <div className="ticket-bar" key={ticket.id} onClick={() => setSelected(ticket)}>
              <span className="ticket-name">{ticket.name}</span>
              <span className="ticket-category">{ticket.category}</span>
              <span className="ticket-details">{truncate(ticket.details, 32)}</span>
            </div>
          ))}
        </div>
        {selected && (
          <div className="modal-overlay">
            <div className="modal ticket-modal">
              <button className="close-btn" onClick={() => setSelected(null)}>&times;</button>
              <h3>Ticket Details</h3>
              <div><b>Name:</b> {selected.name}</div>
              <div><b>Category:</b> {selected.category}</div>
              <div><b>Details:</b> {selected.details}</div>
              <button className="issue-fixed-btn" onClick={() => { removeTicket(selected.id); setSelected(null); }}>Issue fixed</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
