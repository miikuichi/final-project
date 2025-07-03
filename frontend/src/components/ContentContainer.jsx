import React from "react";
import Button from "./Button";
import "../styles.css";

/**
 * Reusable content container component for main pages
 * @param {string} title - The page title
 * @param {string} error - Error message to display
 * @param {function} onClearError - Function to clear error
 * @param {boolean} isLoading - Loading state
 * @param {string} loadingText - Loading message
 * @param {string} emptyText - Message when no items
 * @param {React.ReactNode} children - Content to render
 * @param {object} containerStyle - Additional container styles
 */
export default function ContentContainer({
  title,
  error,
  onClearError,
  isLoading,
  loadingText = "Loading...",
  emptyText = "No items found.",
  children,
  containerStyle = {},
}) {
  const defaultStyle = {
    background: "#fff",
    borderRadius: "1.5rem",
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    minWidth: "50vw",
    minHeight: "80vh",
    margin: "4.5rem auto 0 auto",
    marginTop: "6rem",
    padding: "2.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ...containerStyle,
  };

  return (
    <div className="content-container" style={defaultStyle}>
      <h2>{title}</h2>

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
          {onClearError && (
            <Button
              onClick={onClearError}
              style={{
                marginLeft: "1rem",
                background: "none",
                border: "none",
                color: "#e11d48",
                cursor: "pointer",
                fontSize: "1.2rem",
                padding: "0",
              }}
              label="×"
            />
          )}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          {loadingText}
        </div>
      ) : !children || (Array.isArray(children) && children.length === 0) ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>{emptyText}</div>
      ) : (
        <div style={{ width: "100%", marginTop: "1rem" }}>{children}</div>
      )}
    </div>
  );
}
