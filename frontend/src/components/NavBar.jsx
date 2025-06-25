// NavBar for Login, Admin, and HR Employee
import React from 'react';
import './NavBar.css';

export function LoginNavBar({ onHome, onIssueTicket }) {
  return (
    <nav className="navbar login-navbar">
      <div className="navbar-logo">PayrollPro</div>
      <button onClick={onHome}>Home</button>
      <button onClick={onIssueTicket}>Issue Ticket</button>
    </nav>
  );
}

export function AdminNavBar({ onHome, onLogout }) {
  return (
    <nav className="navbar admin-navbar">
      <div className="navbar-logo">PayrollPro</div>
      <button onClick={onHome}>Home</button>
      <button onClick={onLogout}>Log out</button>
    </nav>
  );
}

export function HRNavBar({ onHome, onIssueTicket, onLogout }) {
  return (
    <nav className="navbar hr-navbar">
      <div className="navbar-logo">PayrollPro</div>
      <button onClick={onHome}>Home</button>
      <button onClick={onIssueTicket}>Issue Ticket</button>
      <button onClick={onLogout}>Log out</button>
    </nav>
  );
}
