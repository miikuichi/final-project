import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import "../styles.css";

export default function TicketModal({
  ticket,
  isOpen,
  onClose,
  onDelete,
  onUpdateStatus,
  role,
}) {
  if (!ticket) return null;

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

  const getStatusStyle = () => {
    switch (ticket.status?.toLowerCase()) {
      case "under process":
        return {
          backgroundColor: "var(--warning-color)",
          color: "var(--surface-color)",
          border: "2px solid var(--warning-color)",
        };
      case "high priority":
        return {
          backgroundColor: "var(--danger-color)",
          color: "var(--surface-color)",
          border: "2px solid var(--danger-color)",
        };
      case "issue fixed":
        return {
          backgroundColor: "var(--success-color)",
          color: "var(--surface-color)",
          border: "2px solid var(--success-color)",
        };
      default:
        return {
          backgroundColor: "var(--text-secondary)",
          color: "var(--surface-color)",
          border: "2px solid var(--text-secondary)",
        };
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showDefaultActions={false}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span>{ticket.category}</span>
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
      }
      actions={
        role === "admin" ? (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button
              label="High Priority"
              onClick={() => handleStatusUpdate("high priority")}
              style={{
                backgroundColor: "var(--danger-color)",
                color: "var(--surface-color)",
                border: "2px solid var(--danger-color)",
              }}
            />
            <Button
              label="Issue Fixed"
              onClick={() => handleStatusUpdate("issue fixed")}
              style={{
                backgroundColor: "var(--success-color)",
                color: "var(--surface-color)",
                border: "2px solid var(--success-color)",
              }}
            />
            <Button
              label="Delete"
              onClick={handleDelete}
              style={{
                backgroundColor: "var(--text-secondary)",
                color: "var(--surface-color)",
                border: "2px solid var(--text-secondary)",
              }}
            />
          </div>
        ) : null
      }
    >
      <div
        className="ticket-modal-content"
        style={{
          padding: "1rem",
          minHeight: "150px",
          backgroundColor: "var(--surface-color)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <div className="ticket-info">
          <p style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
            <strong>Submitted by:</strong> {ticket.name || "N/A"}
          </p>
          <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            <strong>Details:</strong>
          </p>
          <div
            className="ticket-details"
            style={{
              marginTop: "0.5rem",
              lineHeight: "1.6",
              color: "var(--text-primary)",
              backgroundColor: "var(--background-color)",
              border: "2px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              minHeight: "60px",
            }}
          >
            {ticket.details || "No details provided"}
          </div>
        </div>
      </div>
    </Modal>
  );
}
