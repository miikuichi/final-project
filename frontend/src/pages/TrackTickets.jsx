import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HRNavBar } from "../components/NavBar";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";
import "./TrackTickets.css";

export default function TrackTickets() {
  const navigate = useNavigate();
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
      localStorage.removeItem("userRole");
      navigate("/");
    }
  };

  // Filter tickets to only those submitted by the logged-in user
  const myTickets = tickets.filter((ticket) => ticket.name === username);

  return (
    <div>
      <HRNavBar />
      <div className="track-tickets-container" style={{ marginTop: "6rem" }}>
        <h2>Track My Tickets</h2>
        {error && (
          <div className="error-alert">
            {error}
            <button onClick={() => setError("")} className="error-close-btn">
              ×
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="loading-message">Loading your tickets...</div>
        ) : myTickets.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any tickets yet.</p>
            <button
              onClick={() => navigate("/issue-ticket")}
              className="btn-primary"
              style={{
                margin: "auto",
              }}
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          <div className="tickets-list">
            {myTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={handleCardClick}
                currentUser={username}
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
