import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginNavBar } from "../components/NavBar";
import { useRole } from "../components/RoleContext";
import Button from "../components/Button";
import "./LandingPage.css";
import "./AddEmployee.css";

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAs } = useRole();

  useEffect(() => {
    // Check for existing session on component mount
    fetch("http://localhost:8080/api/users/session", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          loginAs(data.roleLabel);
          navigate(data.roleLabel === "admin" ? "/admin" : "/hr");
        }
      })
      .catch((error) => {
        console.error("Session check error:", error);
      });
  }, [loginAs, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        loginAs(data.roleLabel);
        navigate(data.roleLabel === "admin" ? "/admin" : "/hr");
      } else {
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div>
      <LoginNavBar
        onHome={() => window.location.reload()}
        onIssueTicket={() => navigate("/issue-ticket")}
      />
      <div className="add-employee-container" style={{ maxWidth: "400px" }}>
        <h2>PayrollPro Login</h2>

        <form onSubmit={handleLogin} className="employee-form">
          <div className="form-section">
            <h3>Sign In</h3>

            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
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

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleSignup}
                disabled={isLoading}
              >
                Sign Up
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
