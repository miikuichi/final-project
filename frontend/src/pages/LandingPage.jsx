import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginNavBar } from "../components/NavBar";
import { useRole } from "../components/RoleContext";
import Button from "../components/Button";
import "./LandingPage.css";

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginAs } = useRole();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "456") {
      loginAs("admin");
      navigate("/admin");
    } else if (username === "hr" && password === "123") {
      loginAs("hr");
      navigate("/hr");
    } else {
      setError("Invalid credentials. Try again.");
    }
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button label="Log In" type="submit" style={{ width: "100%" }} />
          {error && <div className="error">{error}</div>}
        </form>
        <Button
          label="Sign Up"
          to="/signup"
          className="signup-btn"
          style={{ width: "100%", marginTop: "1rem" }}
        />
      </div>
    </div>
  );
}
