import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavBar, HRNavBar } from "../components/NavBar";
import { useTickets } from "../components/TicketContext";
import { useRole } from "../components/RoleContext";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";
import ContentContainer from "../components/ContentContainer";
import Button from "../components/Button";
import "../styles.css";

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

      <ContentContainer
        title="Manage Tickets"
        error={error}
        onClearError={() => setError("")}
        isLoading={isLoading}
        loadingText="Loading tickets..."
        emptyText="No tickets found."
      >
        {tickets.length > 0 &&
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={handleCardClick}
            />
          ))}
      </ContentContainer>

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
