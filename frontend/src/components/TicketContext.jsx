import React, { createContext, useContext, useState } from 'react';

const TicketContext = createContext();

export function useTickets() {
  return useContext(TicketContext);
}

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState([]);

  const addTicket = (ticket) => {
    setTickets((prev) => [...prev, { ...ticket, id: Date.now() }]);
  };

  const removeTicket = (id) => {
    setTickets((prev) => prev.filter(ticket => ticket.id !== id));
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, removeTicket }}>
      {children}
    </TicketContext.Provider>
  );
}
