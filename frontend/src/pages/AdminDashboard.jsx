import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavBar } from "../components/NavBar";
import "./Dashboard.css";

export default function AdminDashboard() {
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
      <AdminNavBar />
      <div className="dashboard-container">
        <h2>Admin Dashboard</h2>
        <div className="dashboard-buttons">
          <button onClick={() => navigate("/add-employee")}>
            Add Employee
          </button>
          <button onClick={() => navigate("/manage-employee")}>
            Edit Employee Details
          </button>
          <button onClick={() => navigate("/manage-tickets")}>
            Manage Tickets
          </button>
          <button onClick={() => navigate("/modify-requests")}>
            Modify Requests
          </button>
        </div>
      </div>
    </div>
  );
}
