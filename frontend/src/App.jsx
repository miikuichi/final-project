import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./styles.css";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import HRDashboard from "./pages/HRDashboard";
import ManageEmployee from "./pages/ManageEmployee";
import Payroll from "./pages/Payroll";
import IssueTicket from "./pages/IssueTicket";
import ManageTickets from "./pages/ManageTickets";
import TrackTickets from "./pages/TrackTickets";
import ModifyRequests from "./pages/ModifyRequests";
import { TicketProvider } from "./components/TicketContext";
import { RoleProvider } from "./components/RoleContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AddEmployee from "./pages/AddEmployee";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <RoleProvider>
      <TicketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin-only routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/modify-requests"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ModifyRequests />
                </ProtectedRoute>
              }
            />

            {/* HR-only routes */}
            <Route
              path="/hr"
              element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <HRDashboard />
                </ProtectedRoute>
              }
            />

            {/* Routes accessible by both admin and hr */}
            <Route
              path="/manage-employee"
              element={
                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                  <ManageEmployee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payroll"
              element={
                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                  <Payroll />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issue-ticket"
              element={
                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                  <IssueTicket />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-tickets"
              element={
                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                  <ManageTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/track-tickets"
              element={
                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                  <TrackTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-employee"
              element={
                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                  <AddEmployee />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </TicketProvider>
    </RoleProvider>
  );
}

export default App;
