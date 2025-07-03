import React from "react";
import { useNavigate } from "react-router-dom";
import { HRNavBar } from "../components/NavBar";
import Button from "../components/Button";
import "../styles.css";

export default function HRDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // Optionally handle error
    } finally {
      navigate("/");
    }
  };

  return (
    <div>
      <HRNavBar />
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
          <Button
            label="Track Tickets"
            onClick={() => navigate("/track-tickets")}
            style={{
              backgroundColor: "#8b5cf6",
              color: "white",
            }}
          />
        </div>
      </div>
    </div>
  );
}
