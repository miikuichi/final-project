import React, { useState, useEffect } from "react";
import { useRole } from "../components/RoleContext";
import { AdminNavBar } from "../components/NavBar";
import Modal from "../components/Modal";
import { useModal } from "../components/useModal";
import Button from "../components/Button";
import ContentContainer from "../components/ContentContainer";
import RequestCard from "../components/RequestCard";
import RequestModal from "../components/RequestModal";
import "../styles.css";

export default function ModifyRequests() {
  const { role } = useRole();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    isOpen,
    modalConfig,
    hideModal,
    showSuccess,
    showError,
    showWarning,
  } = useModal();

  // Fetch requests from backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      const response = await fetch(
        "http://localhost:8080/api/modify-requests/pending"
      );
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        console.error("Failed to fetch requests");
        setError("Failed to load requests. Please try again.");
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Failed to load requests. Please try again.");
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
  const approveRequest = async (requestId, adminComments = "") => {
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
        showSuccess("Request approved successfully!");
        fetchRequests(); // Refresh the list
        setSelectedRequest(null);
        setIsModalOpen(false);
      } else {
        showError("Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      showError("Error approving request");
    }
  };

  // Reject request
  const rejectRequest = async (requestId, adminComments = "") => {
    if (!adminComments.trim()) {
      showWarning("Please provide a reason for rejection.");
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
        showSuccess("Request rejected successfully!");
        fetchRequests(); // Refresh the list
        setSelectedRequest(null);
        setIsModalOpen(false);
      } else {
        showError("Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      showError("Error rejecting request");
    }
  };

  // Handle card click
  const handleCardClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
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

      <ContentContainer
        title="Employee Modify Requests"
        error={error}
        onClearError={() => setError("")}
        isLoading={loading}
        loadingText="Loading requests..."
        emptyText="No pending requests found. All modify requests have been processed."
        containerStyle={{
          maxWidth: "1000px",
          margin: "0 auto",
          marginTop: "6rem",
        }}
      >
        {requests.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              justifyContent: "center",
            }}
          >
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </ContentContainer>

      <RequestModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={approveRequest}
        onReject={rejectRequest}
      />

      <Modal isOpen={isOpen} onClose={hideModal} {...modalConfig} />
    </div>
  );
}
