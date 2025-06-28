import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginNavBar } from "../components/NavBar";
import { useRole } from "../components/RoleContext";
import Button from "../components/Button";
import "./LandingPage.css";

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
      <div className="login-container">
        <h2>PayrollPro Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button
            label={isLoading ? "Logging in..." : "Log In"}
            type="submit"
            style={{
              width: "100%",
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            disabled={isLoading}
          />
          {error && (
            <div
              className="error"
              style={{
                color: "#e11d48",
                backgroundColor: "#ffe4e6",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                marginTop: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
        </form>
        <Button
          label="Sign Up"
          onClick={handleSignup}
          className="signup-btn"
          style={{ width: "100%", marginTop: "1rem" }}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
