import React, { useState, useEffect } from "react";
import { useRole } from "../components/RoleContext";
import { AdminNavBar } from "../components/NavBar";
import Button from "../components/Button";
import "./ManageTickets.css"; // Use ticket styles for consistency

function diffFields(original, updated) {
  const diffs = [];
  for (const key in updated) {
    if (original[key] !== updated[key]) {
      diffs.push({
        field: key,
        from: original[key],
        to: updated[key],
      });
    }
  }
  return diffs;
}

export default function ModifyRequests() {
  const { role } = useRole();
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [original, setOriginal] = useState(null);

  useEffect(() => {
    const reqs = JSON.parse(localStorage.getItem("modifyRequests") || "[]");
    setRequests(reqs);
  }, []);

  const handleShowDetails = async (req) => {
    // Simulate fetching the original employee data (replace with API if needed)
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    const orig = employees.find((e) => e.employeeId === req.employeeId) || {};
    setOriginal(orig);
    setSelected(req);
  };

  const handleApprove = (req) => {
    // Approve: update employee in localStorage (flat fields)
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    const idx = employees.findIndex((e) => e.employeeId === req.employeeId);
    if (idx !== -1) {
      // Flat merge: just overwrite fields
      employees[idx] = { ...employees[idx], ...req.updated };
      localStorage.setItem("employees", JSON.stringify(employees));
    }
    // Remove request
    const newReqs = requests.filter((r) => r !== req);
    localStorage.setItem("modifyRequests", JSON.stringify(newReqs));
    setRequests(newReqs);
    setSelected(null);
    setOriginal(null);
    alert("Modification approved and applied.");
  };

  const handleReject = (req) => {
    // Remove request
    const newReqs = requests.filter((r) => r !== req);
    localStorage.setItem("modifyRequests", JSON.stringify(newReqs));
    setRequests(newReqs);
    setSelected(null);
    setOriginal(null);
    alert("Modification request rejected.");
  };

  if (role !== "admin") {
    return (
      <div style={{ padding: "2rem" }}>
        Only admin can view modification requests.
      </div>
    );
  }

  return (
    <div>
      <AdminNavBar
        onHome={() => window.location.assign("/admin")}
        onLogout={() => {
          localStorage.removeItem("userRole");
          window.location.assign("/");
        }}
      />
      <div
        className="manage-tickets-container"
        style={{
          background: "#fff",
          borderRadius: "1.5rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          minWidth: "50vw",
          minHeight: "80vh",
          margin: "4.5rem auto 0 auto",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Modification Requests</h2>
        <div className="ticket-list">
          {requests.length === 0 && (
            <div className="no-tickets">No modification requests.</div>
          )}
          {requests.map((req, i) => (
            <div className="ticket-bar" key={i}>
              <span className="ticket-name">{req.employeeId}</span>
              <span className="ticket-category">{req.reason}</span>
              <span className="ticket-details">
                Requested by: {req.requestedBy}
              </span>
              <Button
                style={{ marginLeft: "1rem" }}
                label="Show Details"
                onClick={() => handleShowDetails(req)}
              />
            </div>
          ))}
        </div>
        {selected && (
          <div className="modal-overlay">
            <div className="modal ticket-modal">
              <Button
                className="close-btn"
                label="×"
                onClick={() => {
                  setSelected(null);
                  setOriginal(null);
                }}
              />
              <h3>Request Details</h3>
              <div>
                <b>Employee ID:</b> {selected.employeeId}
              </div>
              <div>
                <b>Reason:</b> {selected.reason}
              </div>
              <div>
                <b>Requested By:</b> {selected.requestedBy}
              </div>
              <div>
                <b>Date:</b> {new Date(selected.date).toLocaleString()}
              </div>
              <div style={{ marginTop: "1rem" }}>
                <b>Changes:</b>
              </div>
              {original && diffFields(original, selected.updated).length > 0 ? (
                <ul style={{ margin: "0.5rem 0 1rem 1rem" }}>
                  {diffFields(original, selected.updated).map((diff, idx) => (
                    <li key={idx}>
                      <b>{diff.field}:</b>{" "}
                      <span style={{ color: "#f59e42" }}>
                        {String(diff.from)}
                      </span>{" "}
                      →{" "}
                      <span style={{ color: "#10b981" }}>
                        {String(diff.to)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ margin: "0.5rem 0 1rem 1rem" }}>
                  No changes detected.
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  maxWidth: "370px",
                  alignItems: "center",
                }}
              >
                <Button
                  className="issue-fixed-btn"
                  style={{ minWidth: "110px", height: "2.7rem" }}
                  label="Confirm"
                  onClick={() => handleApprove(selected)}
                />
                <Button
                  className="clear-btn"
                  style={{
                    background: "#e11d48",
                    color: "#fff",
                    minWidth: "110px",
                    height: "2.7rem",
                    marginTop: "21px",
                  }}
                  label="Reject"
                  onClick={() => handleReject(selected)}
                />
                <Button
                  className="close-btn"
                  style={{ position: "static" }}
                  label="Close"
                  onClick={() => {
                    setSelected(null);
                    setOriginal(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
