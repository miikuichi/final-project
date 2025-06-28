import React, { createContext, useContext, useState } from "react";

const TicketContext = createContext();

export function useTickets() {
  return useContext(TicketContext);
}

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/tickets");
      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const addTicket = async (ticket) => {
    try {
      const response = await fetch("http://localhost:8080/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticket),
      });

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      const newTicket = await response.json();
      setTickets((prev) => [...prev, newTicket]);
      return true;
    } catch (error) {
      console.error("Error creating ticket:", error);
      return false;
    }
  };

  const removeTicket = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tickets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete ticket");
      }

      setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting ticket:", error);
      return false;
    }
  };

  const updateTicketStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/tickets/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update ticket status");
      }

      const updatedTicket = await response.json();
      setTickets((prev) =>
        prev.map((ticket) => (ticket.id === id ? updatedTicket : ticket))
      );
      return true;
    } catch (error) {
      console.error("Error updating ticket status:", error);
      return false;
    }
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        removeTicket,
        fetchTickets,
        updateTicketStatus,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}
