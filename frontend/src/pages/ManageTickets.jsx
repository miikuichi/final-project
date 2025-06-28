import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavBar, HRNavBar } from "../components/NavBar";
import { useTickets } from "../components/TicketContext";
import { useRole } from "../components/RoleContext";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";
import "./ManageTickets.css";

export default function ManageTickets() {
  const navigate = useNavigate();
  const { tickets, removeTicket, fetchTickets, updateTicketStatus } =
    useTickets();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { role } = useRole();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        await fetchTickets();
      } catch (err) {
        setError("Failed to load tickets. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };
    loadTickets();
  }, [fetchTickets]);

  const handleRemoveTicket = async (id) => {
    const success = await removeTicket(id);
    if (!success) {
      setError("Failed to delete ticket. Please try again.");
    }
    return success;
  };

  const handleUpdateStatus = async (id, status) => {
    const success = await updateTicketStatus(id, status);
    if (!success) {
      setError("Failed to update ticket status. Please try again.");
    }
    return success;
  };

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

  return (
    <div>
      {role === "admin" ? <AdminNavBar /> : <HRNavBar />}
      <div
        className="manage-tickets-container"
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
        <h2>Manage Tickets</h2>
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
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            No tickets found.
          </div>
        ) : (
          <div style={{ width: "100%", marginTop: "1rem" }}>
            {tickets.map((ticket) => (
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
        onDelete={handleRemoveTicket}
        onUpdateStatus={handleUpdateStatus}
        role={role}
      />
    </div>
  );
}
