import React, { useState, useEffect } from "react";
import { useRole } from "../components/RoleContext";
import { AdminNavBar, HRNavBar } from "../components/NavBar";
import "./ManageEmployee.css";

export default function ManageEmployee() {
  const { role } = useRole();
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editEmp, setEditEmp] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/employees/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert("Employee deleted successfully!");
          refreshEmployees();
          setSelected(null);
        } else {
          alert("Failed to delete employee");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Error deleting employee");
      }
    }
  };

  useEffect(() => {
    refreshEmployees();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(employees);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        employees.filter(
          (e) =>
            (e.id && e.id.toString().includes(s)) ||
            (e.lastName && e.lastName.toLowerCase().includes(s)) ||
            (e.firstName && e.firstName.toLowerCase().includes(s)) ||
            (e.email && e.email.toLowerCase().includes(s))
        )
      );
    }
  }, [search, employees]);

  return (
    <div>
      {role === "admin" ? (
        <AdminNavBar
          onHome={() => window.location.assign("/admin")}
          onLogout={() => {
            localStorage.removeItem("userRole");
            window.location.assign("/");
          }}
        />
      ) : (
        <HRNavBar
          onHome={() => window.location.assign("/hr")}
          onIssueTicket={() => window.location.assign("/issue-ticket")}
          onLogout={() => {
            localStorage.removeItem("userRole");
            window.location.assign("/");
          }}
        />
      )}

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
          marginTop: "4.5rem",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Manage Employees
        </h2>

        <div className="search-bar-row">
          <input
            className="search-bar"
            type="text"
            placeholder="Search by Employee ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                  {search
                    ? "No employees found matching your search."
                    : "No employees found. Add some employees first."}
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
                        <button
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
                        >
                          View Details
                        </button>
                        <button
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
                        >
                          Delete
                        </button>
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
                onSave={async (updatedEmployee) => {
                  try {
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
                      alert("Employee updated successfully!");
                      refreshEmployees();
                      setEditEmp(null);
                      setSelected(null);
                    } else {
                      alert("Failed to update employee");
                    }
                  } catch (error) {
                    console.error("Error updating employee:", error);
                    alert("Error updating employee");
                  }
                }}
                onCancel={() => setEditEmp(null)}
                onUpdate={setEditEmp}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Edit Employee Modal Component
function EditEmployeeModal({ employee, onSave, onCancel, onUpdate }) {
  const [departments] = useState({
    IT: [
      "Software Developer",
      "System Administrator",
      "IT Support",
      "DevOps Engineer",
    ],
    HR: ["HR Manager", "Recruiter", "HR Assistant", "Training Coordinator"],
    Finance: ["Accountant", "Financial Analyst", "Finance Manager", "Auditor"],
    Marketing: [
      "Marketing Manager",
      "Content Creator",
      "Digital Marketer",
      "Brand Manager",
    ],
    Operations: [
      "Operations Manager",
      "Project Manager",
      "Business Analyst",
      "Quality Assurance",
    ],
  });

  const handleInputChange = (field, value) => {
    onUpdate({ ...employee, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(employee);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginTop: 0, textAlign: "center" }}>Edit Employee</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              First Name:
            </label>
            <input
              type="text"
              value={employee.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Last Name:
            </label>
            <input
              type="text"
              value={employee.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Email:
            </label>
            <input
              type="email"
              value={employee.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Department:
            </label>
            <select
              value={employee.department || ""}
              onChange={(e) => handleInputChange("department", e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            >
              <option value="">Select Department</option>
              {Object.keys(departments).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Position:
            </label>
            <select
              value={employee.position || ""}
              onChange={(e) => handleInputChange("position", e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            >
              <option value="">Select Position</option>
              {employee.department &&
                departments[employee.department] &&
                departments[employee.department].map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
            </select>
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
              type="button"
              onClick={onCancel}
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
              type="submit"
              style={{
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Employee Details Modal Component
function EmployeeDetailsModal({ employee, onClose, onEdit }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginTop: 0, textAlign: "center" }}>Employee Details</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <p>
              <strong>Name:</strong> {employee.firstName}{" "}
              {employee.middleInitial} {employee.lastName} {employee.suffix}
            </p>
            <p>
              <strong>Email:</strong> {employee.email}
            </p>
            <p>
              <strong>Phone:</strong> {employee.cellphone || "N/A"}
            </p>
            <p>
              <strong>Birthday:</strong> {employee.birthday || "N/A"}
            </p>
            <p>
              <strong>Date Hired:</strong> {employee.dateHired}
            </p>
            <p>
              <strong>Blood Type:</strong> {employee.bloodType || "N/A"}
            </p>
            <p>
              <strong>Religion:</strong> {employee.religion || "N/A"}
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
            <p>
              <strong>Address:</strong> {employee.addressHouse || ""}{" "}
              {employee.addressBarangay || ""} {employee.addressCity || ""}{" "}
              {employee.addressProvince || ""} {employee.addressZip || ""}
            </p>
          </div>
        </div>
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          <button
            style={{
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.7rem 1.5rem",
              cursor: "pointer",
            }}
            onClick={onEdit}
          >
            Edit Employee
          </button>
          <button
            style={{
              background: "#6b7280",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.7rem 1.5rem",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
