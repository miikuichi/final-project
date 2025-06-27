import React from "react";
import { useNavigate } from "react-router-dom";
import { HRNavBar } from "../components/NavBar";
import Button from "../components/Button";
import "./Dashboard.css";

export default function HRDashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <HRNavBar
        onHome={() => window.location.reload()}
        onIssueTicket={() => navigate("/issue-ticket")}
        onLogout={() => navigate("/")}
      />
      <div className="dashboard-container">
        <h2>HR Employee Dashboard</h2>
        <div className="dashboard-buttons">
          <Button
            label="Add Employee"
            onClick={() => navigate("/add-employee")}
          />
          <Button
            label="Edit Employee Details"
            onClick={() => navigate("/manage-employee")}
          />
          <Button label="Payroll" onClick={() => navigate("/payroll")} />
        </div>
      </div>
    </div>
  );
}
