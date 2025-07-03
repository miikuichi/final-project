import React, { useState, useEffect } from "react";
import { useRole } from "../components/RoleContext";
import { AdminNavBar, HRNavBar } from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import { useModal } from "../components/useModal";
import EmployeeForm from "../components/EmployeeForm";
import Button from "../components/Button";
import "../styles.css";

export default function ManageEmployee() {
  const { role } = useRole();
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editEmp, setEditEmp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const {
    isOpen,
    modalConfig,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  } = useModal();

  // Fetch employees from backend
  const refreshEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/employees");
      if (response.ok) {
        const data = await response.json();
        setEmployees(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch employees");
        setEmployees([]);
        setFiltered([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    showConfirm(
      "Are you sure you want to delete this employee? This action cannot be undone.",
      "Confirm Delete",
      async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/employees/${id}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            showSuccess("Employee deleted successfully!");
            refreshEmployees();
            setSelected(null);
          } else {
            showError("Failed to delete employee");
          }
        } catch (error) {
          console.error("Error deleting employee:", error);
          showError("Error deleting employee");
        }
      }
    );
  };

  // Submit modify request (for HR users)
  const submitModifyRequest = async (
    originalEmployee,
    updatedEmployee,
    reason
  ) => {
    try {
      setIsSubmitting(true);
      setFormErrors({});
      const modifyRequest = {
        employeeId: originalEmployee.id,
        originalData: JSON.stringify(originalEmployee),
        updatedData: JSON.stringify(updatedEmployee),
        reason: reason,
        requestedBy: role, // "admin" or "hr"
        status: "PENDING",
      };

      const response = await fetch(
        "http://localhost:8080/api/modify-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modifyRequest),
        }
      );

      if (response.ok) {
        showSuccess(
          "Modify request submitted successfully! Waiting for admin approval."
        );
        setEditEmp(null);
        setSelected(null);
      } else {
        const errorText = await response.text();
        showError(errorText || "Failed to submit modify request");
      }
    } catch (error) {
      console.error("Error submitting modify request:", error);
      showError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct update (for Admin users)
  const directUpdateEmployee = async (updatedEmployee) => {
    try {
      setIsSubmitting(true);
      setFormErrors({});
      const response = await fetch(
        `http://localhost:8080/api/employees/${updatedEmployee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEmployee),
        }
      );
      if (response.ok) {
        showSuccess("Employee updated successfully!");
        refreshEmployees();
        setEditEmp(null);
        setSelected(null);
      } else {
        const errorText = await response.text();
        showError(errorText || "Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      showError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    refreshEmployees();
  }, []);

  return (
    <div>
      {role === "admin" ? <AdminNavBar /> : <HRNavBar />}

      <div
        className="manage-employee-container"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem",
          background: "#fff",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          minHeight: "90vh",
          marginTop: "6.0rem",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Manage Employees
        </h2>

        <div className="search-bar-row">
          <SearchBar
            data={employees}
            onFilter={setFiltered}
            placeholder="Search by name..."
            searchKeys={["firstName", "lastName", "employeeId"]}
            className="manage-employee-search"
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading employees...
          </div>
        ) : (
          <>
            <div className="employee-list">
              {filtered.length === 0 ? (
                <div className="no-employees">
                  {employees.length === 0
                    ? "No employees found. Add some employees first."
                    : "No employees found matching your search."}
                </div>
              ) : (
                filtered.map((emp) => (
                  <div key={emp.id} className="employee-card">
                    <div className="employee-card-content">
                      <div className="employee-card-img">
                        <div className="card-img-placeholder">👤</div>
                      </div>
                      <div className="employee-card-main">
                        <div className="employee-name">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="employee-id">ID: {emp.id}</div>
                        <div className="employee-id">Email: {emp.email}</div>
                        <div className="employee-id">
                          {emp.department} - {emp.position}
                        </div>
                        <div className="employee-id">
                          Salary: ₱{emp.salary?.toLocaleString()}
                        </div>
                      </div>
                      <div className="employee-card-actions">
                        <Button
                          style={{
                            background: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                            marginBottom: "0.5rem",
                            fontSize: "0.9rem",
                          }}
                          onClick={() => setSelected(emp)}
                          label="View Details"
                        />
                        <Button
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                          }}
                          onClick={() => deleteEmployee(emp.id)}
                          label="Delete"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selected && (
              <EmployeeDetailsModal
                employee={selected}
                onClose={() => setSelected(null)}
                onEdit={() => {
                  setEditEmp({ ...selected });
                  setSelected(null);
                }}
              />
            )}

            {editEmp && (
              <EditEmployeeModal
                employee={editEmp}
                originalEmployee={
                  employees.find((e) => e.id === editEmp.id) || editEmp
                }
                userRole={role}
                showWarning={showWarning}
                isSubmitting={isSubmitting}
                errors={formErrors}
                onSave={(updatedEmployee, reason) => {
                  const originalEmployee =
                    employees.find((e) => e.id === updatedEmployee.id) ||
                    updatedEmployee;
                  if (role === "admin") {
                    // Admin can directly update
                    directUpdateEmployee(updatedEmployee);
                  } else {
                    // HR needs to submit modify request
                    submitModifyRequest(
                      originalEmployee,
                      updatedEmployee,
                      reason
                    );
                  }
                }}
                onCancel={() => setEditEmp(null)}
                onUpdate={setEditEmp}
              />
            )}
          </>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={hideModal} {...modalConfig} />
    </div>
  );
}

// Edit Employee Modal Component
function EditEmployeeModal({
  employee,
  originalEmployee,
  userRole,
  showWarning,
  onSave,
  onCancel,
  onUpdate,
  isSubmitting = false,
  errors = {},
}) {
  const [reason, setReason] = useState("");

  const handleSubmit = (formData) => {
    // For HR users, reason is required
    if (userRole === "hr" && !reason.trim()) {
      showWarning("Please provide a reason for the changes.");
      return;
    }

    onSave(formData, reason);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Edit Employee">
      <EmployeeForm
        initialData={employee}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errors={errors}
        showReasonField={userRole === "hr"}
        reasonValue={reason}
        onReasonChange={handleReasonChange}
        submitButtonText={userRole === "hr" ? "Submit Request" : "Save Changes"}
        cancelButtonText="Cancel"
        onCancel={onCancel}
      />
    </Modal>
  );
}

// Employee Details Modal Component
function EmployeeDetailsModal({ employee, onClose, onEdit }) {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Employee Details"
      actions={
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            label="Edit Employee"
            onClick={onEdit}
            style={{
              backgroundColor: "#10b981",
              color: "#fff",
            }}
          />
          <Button
            label="Close"
            onClick={onClose}
            style={{
              backgroundColor: "#6b7280",
              color: "#fff",
            }}
          />
        </div>
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        <div>
          <p>
            <strong>Name:</strong> {employee.firstName} {employee.lastName}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Phone:</strong> {employee.cellphone || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <strong>Department:</strong> {employee.department}
          </p>
          <p>
            <strong>Position:</strong> {employee.position}
          </p>
          <p>
            <strong>Salary:</strong> ₱{employee.salary?.toLocaleString()}
          </p>
        </div>
      </div>
    </Modal>
  );
}
