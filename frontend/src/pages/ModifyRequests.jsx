import React, { useState, useEffect } from "react";
import { useRole } from "../components/RoleContext";
import { AdminNavBar } from "../components/NavBar";
import "./ManageTickets.css"; // Use ticket styles for consistency

export default function ModifyRequests() {
  const { role } = useRole();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminComments, setAdminComments] = useState("");

  // Fetch requests from backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8080/api/modify-requests/pending"
      );
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        console.error("Failed to fetch requests");
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Calculate differences between original and updated data
  const getDifferences = (originalData, updatedData) => {
    const differences = [];
    try {
      const original = JSON.parse(originalData);
      const updated = JSON.parse(updatedData);

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
      console.error("Error parsing data:", error);
    }
    return differences;
  };

  // Approve request
  const approveRequest = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/modify-requests/${requestId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comments: adminComments }),
        }
      );

      if (response.ok) {
        alert("Request approved successfully!");
        fetchRequests(); // Refresh the list
        setSelectedRequest(null);
        setAdminComments("");
      } else {
        alert("Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Error approving request");
    }
  };

  // Reject request
  const rejectRequest = async (requestId) => {
    if (!adminComments.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/modify-requests/${requestId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comments: adminComments }),
        }
      );

      if (response.ok) {
        alert("Request rejected successfully!");
        fetchRequests(); // Refresh the list
        setSelectedRequest(null);
        setAdminComments("");
      } else {
        alert("Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Error rejecting request");
    }
  };

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Helper to format object fields (like address) as a readable string
  const formatValue = (value) => {
    if (typeof value === "object" && value !== null) {
      // If it's an address object, join its values
      return Object.values(value).filter(Boolean).join(", ") || "N/A";
    }
    return value === undefined || value === null ? "N/A" : value;
  };

  if (role !== "admin") {
    return (
      <div>
        <h2>Access Denied</h2>
        <p>Only administrators can view modify requests.</p>
      </div>
    );
  }

  return (
    <div>
      <AdminNavBar />

      <div
        className="manage-tickets-container"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "2rem",
          background: "#fff",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          minHeight: "90vh",
          marginTop: "4.5rem",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Employee Modify Requests
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading requests...
          </div>
        ) : (
          <>
            {requests.length === 0 ? (
              <div className="no-tickets">
                <h3>No pending requests</h3>
                <p>All modify requests have been processed.</p>
              </div>
            ) : (
              <div
                className="tickets-list"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                  justifyContent: "center",
                }}
              >
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="ticket-card"
                    style={{
                      background: "#f9fafb",
                      borderRadius: "1rem",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      borderLeft: `6px solid ${
                        request.status === "PENDING"
                          ? "#3b82f6"
                          : request.status === "APPROVED"
                          ? "#10b981"
                          : "#ef4444"
                      }`,
                      padding: "1.5rem 1.5rem 1rem 1.5rem",
                      minWidth: 320,
                      maxWidth: 400,
                      flex: "1 1 320px",
                      transition: "box-shadow 0.2s, transform 0.2s",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(59,130,246,0.15)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 4px 16px rgba(0,0,0,0.08)")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.7rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "#1e293b",
                          flex: 1,
                        }}
                      >
                        Request #{request.id}
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          padding: "0.2rem 0.7rem",
                          borderRadius: "1rem",
                          background:
                            request.status === "PENDING"
                              ? "#e0e7ff"
                              : request.status === "APPROVED"
                              ? "#d1fae5"
                              : "#fee2e2",
                          color:
                            request.status === "PENDING"
                              ? "#3b82f6"
                              : request.status === "APPROVED"
                              ? "#10b981"
                              : "#ef4444",
                          marginLeft: 8,
                        }}
                      >
                        {request.status}
                      </span>
                    </div>
                    <div style={{ marginBottom: "0.5rem", color: "#475569" }}>
                      <strong>Employee ID:</strong> {request.employeeId}
                      <br />
                      <strong>Requested by:</strong> {request.requestedBy}
                      <br />
                      <strong>Date:</strong> {formatDate(request.requestDate)}
                      <br />
                      <strong>Reason:</strong>{" "}
                      <span style={{ color: "#334155" }}>{request.reason}</span>
                    </div>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                        }}
                        style={{
                          background: "#3b82f6",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.5rem 1.2rem",
                          fontWeight: 600,
                          fontSize: "0.97rem",
                          boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#2563eb")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "#3b82f6")
                        }
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Request Details Modal */}
        {selectedRequest && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.45)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              backdropFilter: "blur(2px)",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "1.2rem",
                padding: "2.5rem 2rem 2rem 2rem",
                maxWidth: "600px",
                width: "95%",
                maxHeight: "85vh",
                overflowY: "auto",
                boxShadow: "0 8px 32px rgba(59,130,246,0.18)",
                position: "relative",
              }}
            >
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setAdminComments("");
                }}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  fontSize: 20,
                  color: "#64748b",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}
                aria-label="Close"
              >
                ×
              </button>
              <h3
                style={{
                  marginTop: 0,
                  textAlign: "center",
                  color: "#1e293b",
                  fontWeight: 700,
                  fontSize: "1.4rem",
                }}
              >
                Modify Request Details
              </h3>

              <div style={{ marginBottom: "1.5rem" }}>
                <p>
                  <strong>Request ID:</strong> #{selectedRequest.id}
                </p>
                <p>
                  <strong>Employee ID:</strong> {selectedRequest.employeeId}
                </p>
                <p>
                  <strong>Requested by:</strong> {selectedRequest.requestedBy}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {formatDate(selectedRequest.requestDate)}
                </p>
                <p>
                  <strong>Reason:</strong> {selectedRequest.reason}
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h4>Proposed Changes:</h4>
                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  {getDifferences(
                    selectedRequest.originalData,
                    selectedRequest.updatedData
                  ).map((diff, index) => (
                    <div key={index} style={{ marginBottom: "0.5rem" }}>
                      <strong>{formatFieldName(diff.field)}:</strong>
                      <div style={{ marginLeft: "1rem" }}>
                        <span style={{ color: "#dc3545" }}>
                          From: {formatValue(diff.from)}
                        </span>
                        <br />
                        <span style={{ color: "#28a745" }}>
                          To: {formatValue(diff.to)}
                        </span>
                      </div>
                      {index <
                        getDifferences(
                          selectedRequest.originalData,
                          selectedRequest.updatedData
                        ).length -
                          1 && (
                        <hr
                          style={{ margin: "0.5rem 0", borderColor: "#e9ecef" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Admin Comments:
                </label>
                <textarea
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                  placeholder="Add comments (required for rejection)..."
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    minHeight: "80px",
                    resize: "vertical",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  marginTop: "2rem",
                }}
              >
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setAdminComments("");
                  }}
                  style={{
                    background: "#6b7280",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.75rem 1.5rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => rejectRequest(selectedRequest.id)}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.75rem 1.5rem",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={() => approveRequest(selectedRequest.id)}
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.75rem 1.5rem",
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
