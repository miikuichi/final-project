import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./LandingPage.css";
import "./AddEmployee.css";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role: 1 }), // role=1 for employee
      });
      if (res.ok) {
        setSuccess("Account created! You can now log in.");
        setTimeout(() => navigate("/"), 1200);
      } else if (res.status === 409) {
        setError("Username already exists.");
      } else {
        setError("Sign up failed.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  return (
    <div className="add-employee-container" style={{ maxWidth: "400px" }}>
      <h2>Sign Up</h2>
      
      <form onSubmit={handleSignUp} className="employee-form">
        <div className="form-section">
          <h3>Create Account</h3>
          
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{
              color: "#ef4444",
              backgroundColor: "#fef2f2",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #fecaca",
              marginBottom: "1rem"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              color: "#059669",
              backgroundColor: "#f0fdf4",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #bbf7d0",
              marginBottom: "1rem"
            }}>
              {success}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
