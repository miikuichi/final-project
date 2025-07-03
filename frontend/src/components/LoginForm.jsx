import React, { useState } from "react";
import Button from "./Button"; // Adjust the import path as necessary

const LoginForm = ({
  onSubmit,
  isSubmitting = false,
  error = "",
  onSignUp,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-header">
        <h2>PayrollPro Login</h2>
        <p>Sign in to access your account</p>
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
          className="auth-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="auth-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="auth-submit-btn"
        label={isSubmitting ? "Logging in..." : "Login"}
      />

      <div className="auth-link">
        <p>
          Don't have an account?
          <button type="button" onClick={onSignUp} className="link-button">
            Sign Up
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
