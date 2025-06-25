import React, { useState, useEffect } from "react";
import { useRole } from "../components/RoleContext";
import { AdminNavBar, HRNavBar } from "../components/NavBar";
import { getEmployees } from "../components/employeeStorage";
import {
  getModifyRequests,
  addModifyRequest,
  deleteModifyRequest,
} from "../components/modifyRequestStorage";
import "./ManageEmployee.css";

export default function ManageEmployee() {
  const { role } = useRole();
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editEmp, setEditEmp] = useState(null);
  const [reason, setReason] = useState("");
  const [modifyRequests, setModifyRequests] = useState([]);
  const [showConfirmIdx, setShowConfirmIdx] = useState(null);
  const [showRemoveIdx, setShowRemoveIdx] = useState(null);
  const [loading, setLoading] = useState(false);

  // Refresh employees after add
  const refreshEmployees = async () => {
    try {
      const emps = await getEmployees();
      setEmployees(Array.isArray(emps) ? emps : []);
      setFiltered(Array.isArray(emps) ? emps : []);
    } catch (e) {
      setEmployees([]);
      setFiltered([]);
    }
  };

  // Fetch modify requests from backend
  const refreshModifyRequests = async () => {
    try {
      const reqs = await getModifyRequests();
      setModifyRequests(Array.isArray(reqs) ? reqs : []);
    } catch (e) {
      setModifyRequests([]);
    }
  };

  useEffect(() => {
    refreshEmployees();
    refreshModifyRequests();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(employees);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        employees.filter(
          (e) =>
            (e.employeeId && e.employeeId.toLowerCase().includes(s)) ||
            (e.lastName && e.lastName.toLowerCase().includes(s)) ||
            (e.firstName && e.firstName.toLowerCase().includes(s))
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
          maxWidth: "40vw",
          padding: "1.2rem 1.2rem",
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          alignItems: "center",
          marginTop: "12rem auto",
        }}
      >
        <div className="search-bar-row">
          <input
            className="search-bar"
            type="text"
            placeholder="Search by Employee ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="employee-list">
          {filtered.length === 0 && (
            <div className="no-employees">No employees found.</div>
          )}
          {filtered.map((emp, idx) => (
            <div
              className="employee-card"
              key={emp.employeeId || emp.lastName + emp.firstName}
            >
              <div className="employee-card-content">
                <div className="employee-card-img">
                  {emp.image ? (
                    <img
                      src={
                        typeof emp.image === "string"
                          ? emp.image
                          : URL.createObjectURL(emp.image)
                      }
                      alt="Employee"
                      className="card-img-thumb"
                    />
                  ) : (
                    <div className="card-img-placeholder">?</div>
                  )}
                </div>
                <div className="employee-card-main">
                  <span className="employee-name">
                    {emp.lastName}, {emp.firstName}
                  </span>
                  <span className="employee-id">
                    ID: {emp.employeeId || "N/A"}
                  </span>
                </div>
              </div>
              <div
                style={{ display: "flex", gap: "0.7rem", marginTop: "0.7rem" }}
              >
                <button
                  className="show-details-btn"
                  onClick={() => setSelected(emp)}
                >
                  Show full details
                </button>
                <button
                  className="add-btn"
                  style={{ background: "#e53e3e" }}
                  onClick={async () => {
                    setShowRemoveIdx(idx);
                  }}
                  disabled={loading}
                >
                  Remove Employee
                </button>
              </div>
              {showRemoveIdx === idx && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h3>Remove Employee</h3>
                    <p>Are you sure you want to remove this employee?</p>
                    <div className="modal-actions">
                      <button
                        className="add-btn"
                        onClick={async () => {
                          setLoading(true);
                          try {
                            if (!emp.firstName || !emp.lastName)
                              throw new Error(
                                "No firstName or lastName found for this employee."
                              );
                            await import("../components/employeeStorage").then(
                              (m) => m.removeEmployeeByName(emp.firstName, emp.lastName)
                            );
                            setShowRemoveIdx(null);
                            refreshEmployees();
                            alert("Employee removed successfully.");
                          } catch (e) {
                            alert("Failed to remove employee: " + e.message);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                      >
                        Yes
                      </button>
                      <button
                        className="clear-btn"
                        onClick={() => setShowRemoveIdx(null)}
                        disabled={loading}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {selected && (
          <div className="modal-overlay">
            <div className="modal employee-modal">
              <button className="close-btn" onClick={() => setSelected(null)}>
                &times;
              </button>
              <h3>Employee Details</h3>
              <div className="employee-details">
                {selected.image && (
                  <img
                    src={
                      typeof selected.image === "string"
                        ? selected.image
                        : URL.createObjectURL(selected.image)
                    }
                    alt="Employee"
                    className="preview-img"
                  />
                )}
                <div>
                  <b>Database Emp ID:</b> {selected.empId || "N/A"}
                </div>
                <div>
                  <b>Employee ID:</b> {selected.employeeId || "N/A"}
                </div>
                <div>
                  <b>Name:</b> {selected.lastName}, {selected.firstName}{" "}
                  {selected.middleInitial && selected.middleInitial + "."}{" "}
                  {selected.suffix}
                </div>
                <div>
                  <b>Birthday:</b> {selected.birthday}
                </div>
                <div>
                  <b>Cellphone:</b> {selected.cellphone}
                </div>
                <div>
                  <b>Date Hired:</b> {selected.dateHired}
                </div>
                <div>
                  <b>Religion:</b> {selected.religion}
                </div>
                <div>
                  <b>Bloodtype:</b> {selected.bloodtype}
                </div>
                <div>
                  <b>Department:</b> {selected.department}
                </div>
                <div>
                  <b>Position:</b> {selected.position}
                </div>
                <div>
                  <b>Course:</b> {selected.course}
                </div>
                <div>
                  <b>School:</b> {selected.school}
                </div>
                <div>
                  <b>Licenses:</b> {selected.licenses}
                </div>
                <div>
                  <b>PhilHealth:</b> {selected.philhealth}
                </div>
                <div>
                  <b>SSS:</b> {selected.sss}
                </div>
                <div>
                  <b>Pag-IBIG:</b> {selected.pagibig}
                </div>
                <div>
                  <b>TIN:</b> {selected.tin}
                </div>
                <div>
                  <b>Email:</b> {selected.email}
                </div>
                <div>
                  <b>Permanent Address:</b>{" "}
                  {selected.permanentAddress &&
                    Object.values(selected.permanentAddress)
                      .filter(Boolean)
                      .join(", ")}
                </div>
                <div>
                  <b>Current Address:</b>{" "}
                  {selected.currentAddress &&
                    Object.values(selected.currentAddress)
                      .filter(Boolean)
                      .join(", ")}
                </div>
              </div>
              <button
                className="modify-btn"
                onClick={() => {
                  setEditEmp({
                    ...selected,
                    // Remove nested dependents and emergencyContact
                  });
                  setSelected(null);
                }}
              >
                Modify
              </button>
            </div>
          </div>
        )}
        {editEmp && (
          <div className="modal-overlay">
            <div className="modal employee-modal">
              <button className="close-btn" onClick={() => setEditEmp(null)}>
                &times;
              </button>
              <div
                className="add-employee-container wide"
                style={{
                  margin: "0 auto",
                  maxWidth: 900,
                  maxHeight: "90vh",
                  overflowY: "auto",
                }}
              >
                <h2>Edit Employee</h2>
                <form
                  className="add-employee-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await import("../components/employeeStorage").then((m) =>
                        m.updateEmployee(editEmp)
                      );
                      setEditEmp(null);
                      alert("Employee updated successfully.");
                      refreshEmployees();
                    } catch (err) {
                      alert("Failed to update employee: " + err.message);
                    }
                  }}
                  style={{ gap: "1.2rem" }}
                >
                  {/* All fields, similar to AddEmployeeInline, but bound to editEmp */}
                  <div className="form-row image-name-row">
                    <div className="image-upload-container">
                      <label
                        htmlFor="edit-image-upload"
                        className="image-label"
                      >
                        Image
                      </label>
                      <div className="image-preview-box">
                        {editEmp.image ? (
                          <img
                            src={
                              typeof editEmp.image === "string"
                                ? editEmp.image
                                : URL.createObjectURL(editEmp.image)
                            }
                            alt="Employee"
                            className="preview-img-large"
                          />
                        ) : (
                          <span className="image-placeholder">No Image</span>
                        )}
                      </div>
                      <div className="image-upload-center">
                        <input
                          id="edit-image-upload"
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={(e) =>
                            setEditEmp((emp) => ({
                              ...emp,
                              image: e.target.files[0],
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="name-flexbox">
                      <div className="form-row single-field-row">
                        <label>Database Emp ID:</label>
                        <input
                          className="ae-textbox"
                          name="empId"
                          value={editEmp.empId || ""}
                          onChange={(e) =>
                            setEditEmp((emp) => ({
                              ...emp,
                              empId: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="form-row single-field-row">
                        <label>Employee ID:</label>
                        <input
                          className="ae-textbox"
                          name="employeeId"
                          value={editEmp.employeeId || ""}
                          onChange={(e) =>
                            setEditEmp((emp) => ({
                              ...emp,
                              employeeId: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="form-row single-field-row">
                        <label>Last Name:</label>
                        <input
                          className="ae-textbox"
                          name="lastName"
                          value={editEmp.lastName}
                          onChange={(e) =>
                            setEditEmp((emp) => ({
                              ...emp,
                              lastName: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="form-row single-field-row">
                        <label>First Name:</label>
                        <input
                          className="ae-textbox"
                          name="firstName"
                          value={editEmp.firstName}
                          onChange={(e) =>
                            setEditEmp((emp) => ({
                              ...emp,
                              firstName: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="form-row mi-suffix-row-inline">
                        <label style={{ marginRight: "0.5rem" }}>M.I.:</label>
                        <input
                          className="ae-textbox"
                          name="middleInitial"
                          value={editEmp.middleInitial}
                          maxLength={1}
                          onChange={(e) =>
                            setEditEmp((emp) => ({
                              ...emp,
                              middleInitial: e.target.value,
                            }))
                          }
                          style={{ width: "3.5rem", marginRight: "1.5rem" }}
                        />
                        <label style={{ marginRight: "0.5rem" }}>Suffix:</label>
                        <select
                          name="suffix"
                          value={editEmp.suffix}
                          onChange={(e) =>
                            setEditEmp((emp) => ({
                              ...emp,
                              suffix: e.target.value,
                            }))
                          }
                          style={{ minWidth: "80px" }}
                        >
                          <option value="">--</option>
                          <option value="Jr.">Jr.</option>
                          <option value="Sr.">Sr.</option>
                          <option value="II">II</option>
                          <option value="III">III</option>
                          <option value="IV">IV</option>
                          <option value="V">V</option>
                        </select>
                      </div>
                      <div className="form-row single-field-row">
                        <label>Birthday</label>
                        <input
                          type="date"
                          className="ae-textbox"
                          name="birthday"
                          value={editEmp.birthday}
                          onChange={(e) =>
                            setEditEmp((emp) => ({
                              ...emp,
                              birthday: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-row address-row">
                    <label className="address-label">Permanent Address:</label>
                  </div>
                  <div className="form-row address-fields-row">
                    <input
                      className="ae-textbox"
                      name="house"
                      placeholder="House/Building No."
                      value={editEmp.permanentAddress?.house || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          permanentAddress: {
                            ...emp.permanentAddress,
                            house: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                    <input
                      className="ae-textbox"
                      name="barangay"
                      placeholder="Barangay"
                      value={editEmp.permanentAddress?.barangay || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          permanentAddress: {
                            ...emp.permanentAddress,
                            barangay: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                    <input
                      className="ae-textbox"
                      name="city"
                      placeholder="Municipality/City"
                      value={editEmp.permanentAddress?.city || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          permanentAddress: {
                            ...emp.permanentAddress,
                            city: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                    <input
                      className="ae-textbox"
                      name="province"
                      placeholder="Province"
                      value={editEmp.permanentAddress?.province || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          permanentAddress: {
                            ...emp.permanentAddress,
                            province: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                    <input
                      className="ae-textbox"
                      name="zip"
                      placeholder="ZIP Code"
                      value={editEmp.permanentAddress?.zip || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          permanentAddress: {
                            ...emp.permanentAddress,
                            zip: e.target.value,
                          },
                        }))
                      }
                      required
                      style={{ width: "6rem" }}
                    />
                  </div>
                  <div className="form-row address-row">
                    <label className="address-label">Current Address:</label>
                  </div>
                  <div className="form-row address-fields-row">
                    <input
                      className="ae-textbox"
                      name="house"
                      placeholder="House/Building No."
                      value={editEmp.currentAddress?.house || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          currentAddress: {
                            ...emp.currentAddress,
                            house: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                    <input
                      className="ae-textbox"
                      name="barangay"
                      placeholder="Barangay"
                      value={editEmp.currentAddress?.barangay || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          currentAddress: {
                            ...emp.currentAddress,
                            barangay: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                    <input
                      className="ae-textbox"
                      name="city"
                      placeholder="Municipality/City"
                      value={editEmp.currentAddress?.city || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          currentAddress: {
                            ...emp.currentAddress,
                            city: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                    <input
                      className="ae-textbox"
                      name="province"
                      placeholder="Province"
                      value={editEmp.currentAddress?.province || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          currentAddress: {
                            ...emp.currentAddress,
                            province: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                    <input
                      className="ae-textbox"
                      name="zip"
                      placeholder="ZIP Code"
                      value={editEmp.currentAddress?.zip || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          currentAddress: {
                            ...emp.currentAddress,
                            zip: e.target.value,
                          },
                        }))
                      }
                      required
                      style={{ width: "6rem" }}
                    />
                  </div>
                  <div className="form-row">
                    <label>Cellphone:</label>
                    <input
                      name="cellphone"
                      className="ae-textbox"
                      value={editEmp.cellphone || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          cellphone: e.target.value,
                        }))
                      }
                      required
                    />
                    <label>Date Hired:</label>
                    <input
                      type="date"
                      name="dateHired"
                      className="ae-textbox"
                      value={editEmp.dateHired || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          dateHired: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="form-row">
                    <label>Religion:</label>
                    <input
                      name="religion"
                      className="ae-textbox"
                      value={editEmp.religion || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          religion: e.target.value,
                        }))
                      }
                    />
                    <label>Bloodtype:</label>
                    <input
                      name="bloodtype"
                      className="ae-textbox"
                      value={editEmp.bloodtype || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          bloodtype: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-row">
                    <label>Department:</label>
                    <input
                      name="department"
                      className="ae-textbox"
                      value={editEmp.department || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          department: e.target.value,
                        }))
                      }
                      required
                    />
                    <label>Position Title:</label>
                    <input
                      name="position"
                      className="ae-textbox"
                      value={editEmp.position || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          position: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="form-row">
                    <label>Course:</label>
                    <input
                      name="course"
                      className="ae-textbox"
                      value={editEmp.course || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          course: e.target.value,
                        }))
                      }
                    />
                    <label>School:</label>
                    <input
                      name="school"
                      className="ae-textbox"
                      value={editEmp.school || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          school: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-row">
                    <label>Licenses:</label>
                    <input
                      name="licenses"
                      className="ae-textbox"
                      value={editEmp.licenses || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          licenses: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-row">
                    <label>PhilHealth:</label>
                    <input
                      name="philhealth"
                      className="ae-textbox"
                      value={editEmp.philhealth || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          philhealth: e.target.value,
                        }))
                      }
                    />
                    <label>SSS:</label>
                    <input
                      name="sss"
                      className="ae-textbox"
                      value={editEmp.sss || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({ ...emp, sss: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-row">
                    <label>Pag-IBIG:</label>
                    <input
                      name="pagibig"
                      className="ae-textbox"
                      value={editEmp.pagibig || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({
                          ...emp,
                          pagibig: e.target.value,
                        }))
                      }
                    />
                    <label>TIN:</label>
                    <input
                      name="tin"
                      className="ae-textbox"
                      value={editEmp.tin || ""}
                      onChange={(e) =>
                        setEditEmp((emp) => ({ ...emp, tin: e.target.value }))
                      }
                    />
                  </div>
                  <button className="add-btn" type="submit">
                    Confirm changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
