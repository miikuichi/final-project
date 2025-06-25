import React, { useState } from 'react';
import { useRole } from '../components/RoleContext';
import { AdminNavBar, HRNavBar } from '../components/NavBar';
import { updateEmployee } from '../components/employeeStorage';
import './ManageEmployee.css';

export default function ModifyRequest() {
  const { role } = useRole();
  const [requests, setRequests] = useState(
    JSON.parse(localStorage.getItem('modifyRequests') || '[]')
  );
  const [confirmIdx, setConfirmIdx] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async idx => {
    setLoading(true);
    const req = requests[idx];
    try {
      await updateEmployee(req.employeeId, req.updated);
      // Remove request from localStorage
      const newReqs = requests.filter((_, i) => i !== idx);
      setRequests(newReqs);
      localStorage.setItem('modifyRequests', JSON.stringify(newReqs));
      setConfirmIdx(null);
      alert('Modification confirmed and applied.');
    } catch (e) {
      alert('Failed to update employee: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {role === 'admin' ? (
        <AdminNavBar onHome={() => window.location.assign('/admin')} onLogout={() => { localStorage.removeItem('userRole'); window.location.assign('/'); }} />
      ) : (
        <HRNavBar onHome={() => window.location.assign('/hr')} onIssueTicket={() => window.location.assign('/issue-ticket')} onLogout={() => { localStorage.removeItem('userRole'); window.location.assign('/'); }} />
      )}
      <div className="manage-employee-layout">
        <div className="manage-employee-main-content">
          <h2>Modification Requests</h2>
          {requests.length === 0 ? (
            <div>No modification requests found.</div>
          ) : (
            <div className="employee-list">
              {requests.map((req, idx) => (
                <div className="employee-card" key={idx}>
                  <div className="employee-card-content">
                    <div className="employee-card-main">
                      <span className="employee-name">{req.updated.lastName}, {req.updated.firstName}</span>
                      <span className="employee-id">ID: {req.employeeId}</span>
                      <span className="employee-id">Requested By: {req.requestedBy}</span>
                      <span className="employee-id">Date: {new Date(req.date).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="employee-details" style={{marginTop:'1rem'}}>
                    <div><b>Reason:</b> {req.reason}</div>
                    <div><b>Proposed Changes:</b> <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(req.updated, null, 2)}</pre></div>
                  </div>
                  {role === 'admin' && (
                    <button className="add-btn" onClick={() => setConfirmIdx(idx)} disabled={loading}>Confirm Modification</button>
                  )}
                  {confirmIdx === idx && (
                    <div className="modal-overlay">
                      <div className="modal">
                        <h3>Confirm Modification</h3>
                        <p>Are you sure you want to apply these changes to employee <b>{req.employeeId}</b>?</p>
                        <div className="modal-actions">
                          <button className="add-btn" onClick={() => handleConfirm(idx)} disabled={loading}>Confirm</button>
                          <button className="clear-btn" onClick={() => setConfirmIdx(null)} disabled={loading}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
