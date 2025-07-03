import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import "../styles.css";

/**
 * Request Modal component for viewing and managing modification requests
 * @param {object} request - The request data
 * @param {boolean} isOpen - Modal open state
 * @param {function} onClose - Close handler
 * @param {function} onApprove - Approve handler
 * @param {function} onReject - Reject handler
 */
export default function RequestModal({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) {
  const [adminComments, setAdminComments] = useState("");

  if (!request) return null;

  // Parse JSON data from backend
  const parseJsonData = (jsonString) => {
    try {
      const parsed =
        typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
      return parsed;
    } catch (error) {
      console.error("Error parsing JSON data:", error);
      return {};
    }
  };

  const originalData = parseJsonData(request.originalData);
  const updatedData = parseJsonData(request.updatedData);

  // Calculate differences between original and updated data
  const getDifferences = (original, updated) => {
    const differences = [];
    try {
      Object.keys(updated).forEach((key) => {
        if (key.startsWith("address")) {
          // Compare all address fields as a group
          const addressFields = [
            "addressHouse",
            "addressBarangay",
            "addressCity",
            "addressProvince",
            "addressZip",
          ];
          if (addressFields.includes(key)) {
            // Only show a diff if the value actually changed
            if ((original[key] || "") !== (updated[key] || "")) {
              differences.push({
                field: key,
                from: original[key] || "N/A",
                to: updated[key] || "N/A",
              });
            }
          }
        } else if (original[key] !== updated[key]) {
          differences.push({
            field: key,
            from: original[key] || "N/A",
            to: updated[key] || "N/A",
          });
        }
      });
    } catch (error) {
      console.error("Error calculating differences:", error);
    }
    return differences;
  };

  const differences = getDifferences(originalData, updatedData);

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") {
      return Object.values(value).filter(Boolean).join(", ") || "N/A";
    }
    return value;
  };

  const handleApprove = () => {
    onApprove(request.id, adminComments);
    setAdminComments("");
  };

  const handleReject = () => {
    onReject(request.id, adminComments);
    setAdminComments("");
  };

  const getStatusColor = () => {
    switch (request.status) {
      case "PENDING":
        return "var(--warning-color)";
      case "APPROVED":
        return "var(--success-color)";
      case "REJECTED":
        return "var(--danger-color)";
      default:
        return "var(--text-secondary)";
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
          <span>Request #{request.id}</span>
          <span
            style={{
              backgroundColor: getStatusColor(),
              color: "var(--surface-color)",
              borderRadius: "var(--radius-md)",
              padding: "0.3rem 0.8rem",
              fontSize: "0.85rem",
              fontWeight: 500,
              border: `2px solid ${getStatusColor()}`,
            }}
          >
            {request.status}
          </span>
        </div>
      }
      actions={
        request.status === "PENDING" ? (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button
              label="Approve"
              onClick={handleApprove}
              style={{
                backgroundColor: "var(--success-color)",
                color: "var(--surface-color)",
                border: "2px solid var(--success-color)",
              }}
            />
            <Button
              label="Reject"
              onClick={handleReject}
              style={{
                backgroundColor: "var(--danger-color)",
                color: "var(--surface-color)",
                border: "2px solid var(--danger-color)",
              }}
            />
          </div>
        ) : null
      }
    >
      <div
        className="request-modal-content"
        style={{
          padding: "1rem",
          minHeight: "200px",
          backgroundColor: "var(--surface-color)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
            Employee Information
          </h4>
          <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            <strong>Name:</strong> {originalData?.firstName || "N/A"}{" "}
            {originalData?.lastName || "N/A"}
          </p>
          <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            <strong>Department:</strong> {originalData?.department || "N/A"}
          </p>
          <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            <strong>Position:</strong> {originalData?.position || "N/A"}
          </p>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
            Request Details
          </h4>
          <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            <strong>Submitted by:</strong> {request.requestedBy || "N/A"}
          </p>
          <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            <strong>Date:</strong>{" "}
            {request.requestDate
              ? new Date(request.requestDate).toLocaleString()
              : "N/A"}
          </p>
          {request.reason && (
            <div style={{ marginTop: "0.5rem" }}>
              <strong style={{ color: "var(--text-primary)" }}>Reason:</strong>
              <div
                style={{
                  background: "var(--warning-bg)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.7rem",
                  marginTop: "0.5rem",
                  fontStyle: "italic",
                  color: "var(--text-primary)",
                  border: "1px solid var(--warning-color)",
                }}
              >
                {request.reason}
              </div>
            </div>
          )}
        </div>

        {differences.length > 0 ? (
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
              Proposed Changes
            </h4>
            <div style={{ display: "grid", gap: "1rem" }}>
              {differences.map((diff, index) => (
                <div
                  key={index}
                  style={{
                    border: "2px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    padding: "1rem",
                    backgroundColor: "var(--background-color)",
                  }}
                >
                  <h5
                    style={{
                      margin: "0 0 0.5rem 0",
                      color: "var(--text-primary)",
                    }}
                  >
                    {formatFieldName(diff.field)}
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <strong style={{ color: "var(--danger-color)" }}>
                        From:
                      </strong>
                      <div
                        style={{
                          background: "var(--error-bg)",
                          borderRadius: "var(--radius-sm)",
                          padding: "0.5rem",
                          marginTop: "0.3rem",
                          color: "var(--text-primary)",
                          border: "1px solid var(--danger-color)",
                        }}
                      >
                        {formatValue(diff.from)}
                      </div>
                    </div>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "1.2rem",
                      }}
                    >
                      →
                    </div>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <strong style={{ color: "var(--success-color)" }}>
                        To:
                      </strong>
                      <div
                        style={{
                          background: "var(--success-bg)",
                          borderRadius: "var(--radius-sm)",
                          padding: "0.5rem",
                          marginTop: "0.3rem",
                          color: "var(--text-primary)",
                          border: "1px solid var(--success-color)",
                        }}
                      >
                        {formatValue(diff.to)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
              Changes
            </h4>
            <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
              No specific field changes detected. This might be a general update
              request.
            </p>
          </div>
        )}

        {request.status === "PENDING" && (
          <div style={{ marginBottom: "1rem" }}>
            <h4
              style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}
            >
              Admin Comments (Optional)
            </h4>
            <textarea
              value={adminComments}
              onChange={(e) => setAdminComments(e.target.value)}
              placeholder="Add any comments about this decision..."
              style={{
                width: "100%",
                minHeight: "80px",
                border: "2px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "0.5rem",
                resize: "vertical",
                fontFamily: "var(--font-pixel)",
                backgroundColor: "var(--surface-color)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
          </div>
        )}

        {request.adminComments && (
          <div style={{ marginTop: "1rem" }}>
            <h4
              style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}
            >
              Admin Comments
            </h4>
            <div
              style={{
                background: "var(--background-color)",
                borderRadius: "var(--radius-md)",
                padding: "0.7rem",
                border: "2px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              {request.adminComments}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
