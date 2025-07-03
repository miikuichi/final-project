import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavBar } from "../components/NavBar";
import Button from "../components/Button";
import "../styles.css";

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
          <Button
            onClick={() => navigate("/add-employee")}
            label="Add Employee"
          />
          <Button
            onClick={() => navigate("/manage-employee")}
            label="Edit Employee Details"
          />
          <Button
            onClick={() => navigate("/manage-tickets")}
            label="Manage Tickets"
          />
          <Button
            onClick={() => navigate("/modify-requests")}
            label="Modify Requests"
          />
        </div>
      </div>
    </div>
  );
}
