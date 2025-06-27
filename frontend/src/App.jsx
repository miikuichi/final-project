import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import HRDashboard from './pages/HRDashboard';
import ManageEmployee from './pages/ManageEmployee';
import Payroll from './pages/Payroll';
import IssueTicket from './pages/IssueTicket';
import ManageTickets from './pages/ManageTickets';
import ModifyRequests from './pages/ModifyRequests';
import { TicketProvider } from './components/TicketContext';
import { RoleProvider } from './components/RoleContext';
import AddEmployee from './pages/AddEmployee';
import SignUp from './pages/SignUp';

function App() {

  return (
    <RoleProvider>
      <TicketProvider>
        <Router>
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/manage-employee" element={<ManageEmployee />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/issue-ticket" element={<IssueTicket />} />
            <Route path="/manage-tickets" element={<ManageTickets />} />
            <Route path="/modify-requests" element={<ModifyRequests />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </TicketProvider>
    </RoleProvider>
  )
}

export default App
