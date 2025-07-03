import React from "react";
import "../styles.css";

/**
 * Request Card component for ModifyRequests
 * @param {object} request - The request data
 * @param {function} onClick - Click handler
 */
export default function RequestCard({ request, onClick }) {
  // Parse JSON data from backend
  const parseJsonData = (jsonString) => {
    try {
      return typeof jsonString === "string"
        ? JSON.parse(jsonString)
        : jsonString;
    } catch (error) {
      console.error("Error parsing JSON data:", error);
      return {};
    }
  };

  const originalData = parseJsonData(request.originalData);
  const updatedData = parseJsonData(request.updatedData);

  const getStatusColor = () => {
    switch (request.status) {
      case "PENDING":
        return "#d4a574"; // Warm golden yellow
      case "APPROVED":
        return "#6fa65c"; // Earthy green
      case "REJECTED":
        return "#c4704f"; // Muted red-orange
      default:
        return "#8b7355"; // Warm brown
    }
  };

  const getStatusBg = () => {
    switch (request.status) {
      case "PENDING":
        return "#f9f2e6"; // Light golden cream
      case "APPROVED":
        return "#e8f5e3"; // Light green
      case "REJECTED":
        return "#f5e6dd"; // Light peach
      default:
        return "#f0ede8"; // Light beige
    }
  };

  const getStatusTextColor = () => {
    switch (request.status) {
      case "PENDING":
        return "#8b6914"; // Darker golden brown
      case "APPROVED":
        return "#4a5f3a"; // Dark forest green
      case "REJECTED":
        return "#8b3e2f"; // Dark terracotta
      default:
        return "#5a4a3a"; // Dark brown
    }
  };

  return (
    <div
      className="request-card"
      style={{
        background: "var(--surface-color)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        border: `3px solid ${getStatusColor()}`,
        padding: "1.5rem",
        minWidth: 320,
        maxWidth: 400,
        flex: "1 1 320px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        fontFamily: "var(--font-pixel)",
        backgroundImage: `
          radial-gradient(circle at 20px 20px, rgba(125, 90, 43, 0.05) 2px, transparent 2px),
          linear-gradient(to right, rgba(196, 181, 154, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(196, 181, 154, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px, 20px 20px, 20px 20px",
      }}
      onClick={() => onClick && onClick(request)}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: getStatusColor(),
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "var(--text-primary)",
            flex: 1,
          }}
        >
          Request #{request.id}
        </span>
        <span
          style={{
            fontWeight: 600,
            fontSize: "0.9rem",
            padding: "0.4rem 0.8rem",
            borderRadius: "var(--radius-lg)",
            background: getStatusBg(),
            color: getStatusTextColor(),
            border: `2px solid ${getStatusColor()}`,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {request.status}
        </span>
      </div>

      <div style={{ marginBottom: "0.8rem" }}>
        <p
          style={{
            margin: "0 0 0.4rem 0",
            fontWeight: 600,
            color: "var(--text-primary)",
            fontSize: "1rem",
          }}
        >
          Employee: {originalData?.firstName} {originalData?.lastName}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
          }}
        >
          Department: {originalData?.department}
        </p>
      </div>

      <div style={{ marginBottom: "0.8rem" }}>
        <p
          style={{
            margin: "0 0 0.3rem 0",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
          }}
        >
          Submitted by: {request.requestedBy}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            opacity: 0.8,
          }}
        >
          Date: {new Date(request.requestDate).toLocaleDateString()}
        </p>
      </div>

      {request.reason && (
        <div
          style={{
            background: "var(--warning-bg)",
            borderRadius: "var(--radius-md)",
            padding: "0.8rem",
            marginTop: "0.8rem",
            border: "2px solid var(--warning-color)",
            backgroundImage: `
              radial-gradient(circle at 10px 10px, rgba(212, 165, 116, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.85rem",
              color: "var(--text-primary)",
              fontWeight: 500,
              lineHeight: "1.4",
            }}
          >
            <strong>Reason:</strong>{" "}
            {request.reason.length > 80
              ? request.reason.slice(0, 77) + "..."
              : request.reason}
          </p>
        </div>
      )}
    </div>
  );
}
