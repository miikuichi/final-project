import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/SignUpForm";
import "../styles.css";

export default function SignUp() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (formData) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
          role: 1, // role=1 for employee
        }),
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {success && <div className="success-message">{success}</div>}

        <SignUpForm
          onSubmit={handleSignUp}
          isSubmitting={isLoading}
          error={error}
          onLogin={handleLogin}
        />
      </div>
    </div>
  );
}
