import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HRNavBar } from "../components/NavBar";
import { useTickets } from "../components/TicketContext";
import "./IssueTicket.css";
import "./AddEmployee.css";

const categories = ["Log In error", "Forgot Password", "Application Error"];

export default function IssueTicket() {
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  const [category, setCategory] = useState(categories[0]);
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch username from session
    fetch("http://localhost:8080/api/users/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.username) {
          setName(data.username);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim() || !name.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const success = await addTicket({ category, details, name });

      if (success) {
        setShowModal(true);
        let timer = 3;
        setCountdown(timer);
        const interval = setInterval(async () => {
          timer -= 1;
          setCountdown(timer);
          if (timer === 0) {
            clearInterval(interval);
            // Check session before redirecting
            try {
              const res = await fetch(
                "http://localhost:8080/api/users/session",
                { credentials: "include" }
              );
              const data = await res.json();
              if (data && data.username) {
                navigate("/hr");
              } else {
                navigate("/");
              }
            } catch {
              navigate("/");
            }
          }
        }, 1000);
      } else {
        setError("Failed to create ticket. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while creating the ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <HRNavBar />
      <div className="add-employee-container" style={{ maxWidth: "600px" }}>
        <h2>Issue Ticket</h2>

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-section">
            <h3>Ticket Information</h3>

            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoggedIn}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Details *</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe your issue in detail..."
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "0.75rem",
                  fontSize: "1rem",
                  minHeight: "120px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
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
                onClick={() => (isLoggedIn ? navigate("/hr") : navigate("/"))}
              >
                {isLoggedIn ? "Home" : "Cancel"}
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "1rem",
              textAlign: "center",
            }}
          >
            <h3>Ticket Created Successfully!</h3>
            <p>Redirecting in {countdown} seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
}
