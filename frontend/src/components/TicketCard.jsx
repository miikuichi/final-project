import React from "react";
import "./TicketCard.css";

export default function TicketCard({ ticket, onClick, currentUser }) {
  const getCardStyle = () => {
    let backgroundColor = "#f9fafb";
    let textColor = "#334155";
    let borderColor = "#e5e7eb";

    switch (ticket.status?.toLowerCase()) {
      case "under process":
        backgroundColor = "#fef3c7";
        borderColor = "#f59e0b";
        break;
      case "high priority":
        backgroundColor = "#fee2e2";
        textColor = "#7f1d1d";
        borderColor = "#ef4444";
        break;
      case "issue fixed":
        backgroundColor = "#d1fae5";
        textColor = "#064e3b";
        borderColor = "#10b981";
        break;
      default:
        break;
    }

    return {
      backgroundColor,
      color: textColor,
      borderColor,
      border: `2px solid ${borderColor}`,
      borderRadius: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      marginBottom: "1.5rem",
      padding: "1.5rem",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
    };
  };

  const getStatusStyle = () => {
    switch (ticket.status?.toLowerCase()) {
      case "under process":
        return { backgroundColor: "#f59e0b", color: "white" };
      case "high priority":
        return { backgroundColor: "#ef4444", color: "white" };
      case "issue fixed":
        return { backgroundColor: "#10b981", color: "white" };
      default:
        return { backgroundColor: "#6b7280", color: "white" };
    }
  };

  return (
    <div
      className="ticket-card"
      style={getCardStyle()}
      onClick={() => onClick && onClick(ticket)}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h3 style={{ margin: 0 }}>{ticket.category}</h3>
        <span
          style={{
            ...getStatusStyle(),
            borderRadius: "0.5rem",
            padding: "0.3rem 0.8rem",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          {ticket.status}
        </span>
      </div>
      <p style={{ margin: "0.5rem 0", fontWeight: 500, opacity: 0.8 }}>
        By: {currentUser && ticket.name === currentUser ? "You" : ticket.name}
      </p>
      <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.5 }}>
        {ticket.details?.length > 100
          ? ticket.details.slice(0, 97) + "..."
          : ticket.details}
      </p>
    </div>
  );
}
