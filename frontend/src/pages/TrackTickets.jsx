import React, { useState, useEffect } from "react";
import { HRNavBar } from "../components/NavBar";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";
import "./TrackTickets.css";

export default function TrackTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Fetch username from session
    fetch("http://localhost:8080/api/users/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.username) {
          setUsername(data.username);
        }
      });
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/tickets");
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError("Failed to load tickets. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCardClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      window.location.assign("/");
    }
  };

  // Filter tickets to only those submitted by the logged-in user
  const myTickets = tickets.filter((ticket) => ticket.name === username);

  return (
    <div>
      <HRNavBar
        onHome={() => window.location.assign("/hr")}
        onIssueTicket={() => window.location.assign("/issue-ticket")}
        onLogout={handleLogout}
      />
      <div
        className="track-tickets-container"
        style={{
          background: "#fff",
          borderRadius: "1.5rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          minWidth: "50vw",
          minHeight: "80vh",
          margin: "4.5rem auto 0 auto",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Track My Tickets</h2>
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
            <button
              onClick={() => setError("")}
              style={{
                marginLeft: "1rem",
                background: "none",
                border: "none",
                color: "#e11d48",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading your tickets...
          </div>
        ) : myTickets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>You haven't submitted any tickets yet.</p>
            <button
              onClick={() => window.location.assign("/issue-ticket")}
              style={{
                backgroundColor: "#4f8cff",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          <div style={{ width: "100%", marginTop: "1rem" }}>
            {myTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </div>

      <TicketModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        role="hr"
      />
    </div>
  );
}
