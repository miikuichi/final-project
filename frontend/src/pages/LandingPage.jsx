import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginNavBar } from "../components/NavBar";
import { useRole } from "../components/RoleContext";
import Button from "../components/Button";
import "../styles.css";
import LoginForm from "../components/LoginForm";

export default function LandingPage() {
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

  const handleLogin = async (formData) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
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
    <div className="landing-page">
      <LoginNavBar
        onHome={() => window.location.reload()}
        onIssueTicket={() => navigate("/issue-ticket")}
      />
      <div className="landing-content">
        <div className="login-container">
          <LoginForm
            onSubmit={handleLogin}
            isSubmitting={isLoading}
            error={error}
            onSignUp={handleSignup}
          />
        </div>
      </div>
    </div>
  );
}
