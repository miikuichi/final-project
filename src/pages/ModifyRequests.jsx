import React, { useState, useEffect } from 'react';
import { useRole } from '../components/RoleContext';
import { AdminNavBar } from '../components/NavBar';

export default function ModifyRequests() {
  const { role } = useRole();
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const reqs = JSON.parse(localStorage.getItem('modifyRequests') || '[]');
    setRequests(reqs);
  }, []);

  const handleApprove = req => {
    // Approve: update employee in localStorage
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const idx = employees.findIndex(e => e.employeeId === req.employeeId);
    if (idx !== -1) {
      employees[idx] = req.updated;
      localStorage.setItem('employees', JSON.stringify(employees));
    }
    // Remove request
    const newReqs = requests.filter(r => r !== req);
    localStorage.setItem('modifyRequests', JSON.stringify(newReqs));
    setRequests(newReqs);
    setSelected(null);
    alert('Modification approved and applied.');
  };

  const handleReject = req => {
    // Remove request
    const newReqs = requests.filter(r => r !== req);
    localStorage.setItem('modifyRequests', JSON.stringify(newReqs));
    setRequests(newReqs);
    setSelected(null);
    alert('Modification request rejected.');
  };

  if (role !== 'admin') {
    return <div style={{padding:'2rem'}}>Only admin can view modification requests.</div>;
  }

  return (
    <div>
      <AdminNavBar onHome={() => window.location.assign('/admin')} onLogout={() => { localStorage.removeItem('userRole'); window.location.assign('/'); }} />
      <div className="modify-requests-container">
        <h2>Modification Requests</h2>
        <div className="modify-requests-list">
          {requests.length === 0 && <div className="no-requests">No modification requests.</div>}
          {requests.map((req, i) => (
            <div className="modify-request-card" key={i} onClick={() => setSelected(req)}>
              <div><b>Employee ID:</b> {req.employeeId}</div>
              <div><b>Reason:</b> {req.reason}</div>
              <div><b>Requested By:</b> {req.requestedBy}</div>
              <div><b>Date:</b> {new Date(req.date).toLocaleString()}</div>
            </div>
          ))}
        </div>
        {selected && (
          <div className="modal-overlay">
            <div className="modal employee-modal">
              <button className="close-btn" onClick={() => setSelected(null)}>&times;</button>
              <h3>Review Modification</h3>
              <div className="employee-details">
                <div><b>Employee ID:</b> {selected.employeeId}</div>
                <div><b>Reason:</b> {selected.reason}</div>
                <div><b>Requested By:</b> {selected.requestedBy}</div>
                <div><b>Date:</b> {new Date(selected.date).toLocaleString()}</div>
                <div style={{marginTop:'1rem'}}><b>New Data:</b></div>
                <pre style={{background:'#f3f4f6',padding:'0.7rem',borderRadius:'0.7rem',fontSize:'0.98rem'}}>{JSON.stringify(selected.updated, null, 2)}</pre>
              </div>
              <div style={{display:'flex',gap:'1rem',marginTop:'1.2rem'}}>
                <button className="add-btn" onClick={() => handleApprove(selected)}>Approve</button>
                <button className="clear-btn" onClick={() => handleReject(selected)}>Reject</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
