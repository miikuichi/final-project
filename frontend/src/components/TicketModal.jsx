import React from "react";
import Button from "./Button";
import "./TicketModal.css";

export default function TicketModal({
  ticket,
  isOpen,
  onClose,
  onDelete,
  onUpdateStatus,
  role,
}) {
  if (!isOpen || !ticket) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStatusUpdate = async (status) => {
    const success = await onUpdateStatus(ticket.id, status);
    if (success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      const success = await onDelete(ticket.id);
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="ticket-modal-overlay" onClick={handleOverlayClick}>
      <div className="ticket-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>{ticket.category}</h2>
          <span
            className={`status-badge ${ticket.status
              ?.toLowerCase()
              .replace(" ", "-")}`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="modal-content">
          <div className="ticket-info">
            <p>
              <strong>Submitted by:</strong> {ticket.name}
            </p>
            <p>
              <strong>Details:</strong>
            </p>
            <div className="ticket-details">{ticket.details}</div>
          </div>

          {role === "admin" && (
            <div className="modal-actions">
              <Button
                label="High Priority"
                onClick={() => handleStatusUpdate("high priority")}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  marginRight: "0.5rem",
                }}
              />
              <Button
                label="Issue Fixed"
                onClick={() => handleStatusUpdate("issue fixed")}
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  marginRight: "0.5rem",
                }}
              />
              <Button
                label="Delete"
                onClick={handleDelete}
                style={{
                  backgroundColor: "#6b7280",
                  color: "white",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
