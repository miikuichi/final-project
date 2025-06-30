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

  // Password validation function
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const getPasswordRequirements = () => {
    return "Password must be at least 8 characters long and contain: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    if (!validatePassword(password)) {
      setError(getPasswordRequirements());
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password, role: 1 }), // role=1 for employee
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created! You can now log in.");
        setTimeout(() => navigate("/"), 1200);
      } else {
        setError(data.error || "Sign up failed.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
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
              <small
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.8rem",
                  marginTop: "0.25rem",
                  display: "block",
                }}
              >
                Password must contain at least 8 characters with 1 uppercase, 1
                lowercase, 1 number, and 1 special character
              </small>
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
              <div
                style={{
                  color: "#ef4444",
                  backgroundColor: "#fef2f2",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #fecaca",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  color: "#059669",
                  backgroundColor: "#f0fdf4",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #bbf7d0",
                  marginBottom: "1rem",
                }}
              >
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
              <button type="submit" className="btn-submit">
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
