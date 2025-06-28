import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HRNavBar } from "../components/NavBar";
import { useTickets } from "../components/TicketContext";
import "./IssueTicket.css";

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

  useEffect(() => {
    // Fetch username from session
    fetch("http://localhost:8080/api/users/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.username) {
          setName(data.username);
        }
      });
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
        const interval = setInterval(() => {
          timer -= 1;
          setCountdown(timer);
          if (timer === 0) {
            clearInterval(interval);
            navigate("/hr"); // redirect to HR dashboard
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
      <HRNavBar
        onHome={() => navigate("/hr")}
        onIssueTicket={() => window.location.reload()}
        onLogout={() => navigate("/")}
      />
      <div
        className="issue-ticket-container"
        style={{
          background: "#fff",
          borderRadius: "1.5rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          maxWidth: 400,
          margin: "4.5rem auto 0 auto",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Issue Ticket</h2>
        {error && (
          <div
            style={{
              color: "#e11d48",
              backgroundColor: "#ffe4e6",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <form
          className="issue-ticket-form"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
          }}
          onSubmit={handleSubmit}
        >
          <label style={{ fontWeight: 500, marginBottom: "0.2rem" }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "0.7rem 1rem",
              borderRadius: "1rem",
              border: "1.5px solid #4f8cff",
              fontSize: "1rem",
            }}
            disabled={isSubmitting}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label style={{ fontWeight: 500, marginBottom: "0.2rem" }}>
            Details <span style={{ color: "#e11d48" }}>*</span>
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            style={{
              padding: "0.7rem 1rem",
              borderRadius: "1rem",
              border: "1.5px solid #4f8cff",
              fontSize: "1rem",
              resize: "vertical",
            }}
            disabled={isSubmitting}
          />
          <label style={{ fontWeight: 500, marginBottom: "0.2rem" }}>
            Name <span style={{ color: "#e11d48" }}>*</span>
          </label>
          <input
            value={name}
            readOnly
            style={{
              padding: "0.7rem 1rem",
              borderRadius: "1rem",
              border: "1.5px solid #4f8cff",
              fontSize: "1rem",
              background: "#f3f4f6",
              color: "#64748b",
              cursor: "not-allowed",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#4f8cff",
              color: "white",
              padding: "0.75rem",
              borderRadius: "1rem",
              border: "none",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating ticket..." : "Submit Ticket"}
          </button>
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
