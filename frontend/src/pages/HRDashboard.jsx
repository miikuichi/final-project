import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HRNavBar } from '../components/NavBar';
import './Dashboard.css';

export default function HRDashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <HRNavBar 
        onHome={() => window.location.reload()} 
        onIssueTicket={() => navigate('/issue-ticket')} 
        onLogout={() => navigate('/')} 
      />
      <div className="dashboard-container">
        <h2>HR Employee Dashboard</h2>
        <div className="dashboard-buttons">
          <button onClick={() => navigate('/add-employee')}>Add Employee</button>
          <button onClick={() => navigate('/manage-employee')}>Edit Employee Details</button>
          <button onClick={() => navigate('/payroll')}>Payroll</button>
        </div>
      </div>
    </div>
  );
}
