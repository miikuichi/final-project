import React from "react";
import "../styles.css";

/**
 * Reusable card component for tickets and requests
 * @param {object} item - The item data (ticket or request)
 * @param {function} onClick - Click handler
 * @param {string} titleField - Field name for the title (e.g., 'category')
 * @param {string} statusField - Field name for the status (e.g., 'status')
 * @param {string} detailsField - Field name for the details (e.g., 'details')
 * @param {string} authorField - Field name for the author (e.g., 'name')
 * @param {string} currentUser - Current user name for "You" display
 * @param {object} customStyles - Custom styles object
 */
export default function ItemCard({
  item,
  onClick,
  titleField = "category",
  statusField = "status",
  detailsField = "details",
  authorField = "name",
  currentUser,
  customStyles = {},
}) {
  const getCardStyle = () => {
    let backgroundColor = "#f9fafb";
    let textColor = "#334155";
    let borderColor = "#e5e7eb";

    const status = item[statusField]?.toLowerCase();

    switch (status) {
      case "under process":
      case "pending":
        backgroundColor = "#fef3c7";
        borderColor = "#f59e0b";
        break;
      case "high priority":
      case "urgent":
        backgroundColor = "#fee2e2";
        textColor = "#7f1d1d";
        borderColor = "#ef4444";
        break;
      case "issue fixed":
      case "approved":
      case "completed":
        backgroundColor = "#d1fae5";
        textColor = "#064e3b";
        borderColor = "#10b981";
        break;
      case "rejected":
      case "denied":
        backgroundColor = "#fee2e2";
        textColor = "#7f1d1d";
        borderColor = "#ef4444";
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
      ...customStyles,
    };
  };

  const getStatusStyle = () => {
    const status = item[statusField]?.toLowerCase();

    switch (status) {
      case "under process":
      case "pending":
        return { backgroundColor: "#f59e0b", color: "white" };
      case "high priority":
      case "urgent":
        return { backgroundColor: "#ef4444", color: "white" };
      case "issue fixed":
      case "approved":
      case "completed":
        return { backgroundColor: "#10b981", color: "white" };
      case "rejected":
      case "denied":
        return { backgroundColor: "#ef4444", color: "white" };
      default:
        return { backgroundColor: "#6b7280", color: "white" };
    }
  };

  const title = item[titleField] || "Item";
  const status = item[statusField] || "Unknown";
  const details = item[detailsField] || "";
  const author = item[authorField] || "Unknown";

  return (
    <div
      className="item-card"
      style={getCardStyle()}
      onClick={() => onClick && onClick(item)}
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
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span
          style={{
            ...getStatusStyle(),
            borderRadius: "0.5rem",
            padding: "0.3rem 0.8rem",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          {status}
        </span>
      </div>
      <p style={{ margin: "0.5rem 0", fontWeight: 500, opacity: 0.8 }}>
        By: {currentUser && author === currentUser ? "You" : author}
      </p>
      <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.5 }}>
        {details?.length > 100 ? details.slice(0, 97) + "..." : details}
      </p>
    </div>
  );
}
