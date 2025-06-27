import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./LandingPage.css";

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
    <div className="login-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp} className="login-form">
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button label="Sign Up" type="submit" style={{ width: "100%" }} />
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
      <Button
        label="Cancel"
        onClick={() => navigate("/")}
        style={{ width: "100%", marginTop: "0.5rem" }}
      />
    </div>
  );
}
