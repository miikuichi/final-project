import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../components/RoleContext";
import { AdminNavBar, HRNavBar } from "../components/NavBar";
import "./AddEmployee.css";

const initialState = {
  firstName: "",
  lastName: "",
  middleInitial: "",
  suffix: "",
  email: "",
  cellphone: "",
  birthday: "",
  dateHired: "",
  department: "",
  position: "",
  religion: "",
  bloodType: "",
  addressHouse: "",
  addressBarangay: "",
  addressCity: "",
  addressProvince: "",
  addressZip: "",
};

export default function AddEmployee() {
  const [departments, setDepartments] = useState({});
  const [availablePositions, setAvailablePositions] = useState([]);
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { role } = useRole();

  // Load departments and positions from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/employees/departments")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
        console.log("Loaded departments:", data);
      })
      .catch((err) => console.error("Error loading departments:", err));
  }, []);

  // Update available positions when department changes
  useEffect(() => {
    if (form.department && departments[form.department]) {
      setAvailablePositions(departments[form.department]);
      // Reset position if current selection is not valid for new department
      if (!departments[form.department].includes(form.position)) {
        setForm((prev) => ({ ...prev, position: "" }));
      }
    } else {
      setAvailablePositions([]);
    }
  }, [form.department, departments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.dateHired.trim()) newErrors.dateHired = "Date hired is required";
    if (!form.department.trim())
      newErrors.department = "Department is required";
    if (!form.position.trim()) newErrors.position = "Position is required";

    // Email format validation
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send as JSON, not FormData
      const response = await fetch("http://localhost:8080/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Employee created successfully:", result);
        alert("Employee added successfully!");
        setForm(initialState);
        navigate("/manage-employee");
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(`Error: ${errorData.error || "Failed to add employee"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-employee">
      {role === "admin" ? <AdminNavBar /> : <HRNavBar />}

      <div className="add-employee-container">
        <h2>Add New Employee</h2>

        <form onSubmit={handleSubmit} className="employee-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? "error" : ""}
                required
              />
              {errors.firstName && (
                <span className="error-text">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? "error" : ""}
                required
              />
              {errors.lastName && (
                <span className="error-text">{errors.lastName}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Middle Initial</label>
                <input
                  type="text"
                  name="middleInitial"
                  value={form.middleInitial}
                  onChange={handleInputChange}
                  maxLength="10"
                />
              </div>

              <div className="form-group">
                <label>Suffix</label>
                <input
                  type="text"
                  name="suffix"
                  value={form.suffix}
                  onChange={handleInputChange}
                  placeholder="Jr., Sr., III, etc."
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className={errors.email ? "error" : ""}
                required
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label>Cellphone</label>
              <input
                type="tel"
                name="cellphone"
                value={form.cellphone}
                onChange={handleInputChange}
                placeholder="+1234567890"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={form.birthday}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Date Hired *</label>
                <input
                  type="date"
                  name="dateHired"
                  value={form.dateHired}
                  onChange={handleInputChange}
                  className={errors.dateHired ? "error" : ""}
                  required
                />
                {errors.dateHired && (
                  <span className="error-text">{errors.dateHired}</span>
                )}
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="form-section">
            <h3>Work Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Department *</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleInputChange}
                  className={errors.department ? "error" : ""}
                  required
                >
                  <option value="">Select Department</option>
                  {Object.keys(departments).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <span className="error-text">{errors.department}</span>
                )}
              </div>

              <div className="form-group">
                <label>Position *</label>
                <select
                  name="position"
                  value={form.position}
                  onChange={handleInputChange}
                  className={errors.position ? "error" : ""}
                  disabled={!form.department}
                  required
                >
                  <option value="">Select Position</option>
                  {availablePositions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
                {errors.position && (
                  <span className="error-text">{errors.position}</span>
                )}
                {form.department && !availablePositions.length && (
                  <span className="info-text">
                    Please select a department first
                  </span>
                )}
              </div>
            </div>

            <div className="info-box">
              <p>
                <strong>Note:</strong> Salary will be automatically assigned
                based on the selected position.
              </p>
            </div>
          </div>

          {/* Address Information */}
          <div className="form-section">
            <h3>Address Information</h3>

            <div className="form-group">
              <label>House/Building Number</label>
              <input
                type="text"
                name="addressHouse"
                value={form.addressHouse}
                onChange={handleInputChange}
                placeholder="123 Main St"
              />
            </div>

            <div className="form-group">
              <label>Barangay</label>
              <input
                type="text"
                name="addressBarangay"
                value={form.addressBarangay}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="addressCity"
                  value={form.addressCity}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Province</label>
                <input
                  type="text"
                  name="addressProvince"
                  value={form.addressProvince}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="addressZip"
                  value={form.addressZip}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Optional Information */}
          <div className="form-section">
            <h3>Optional Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={form.religion}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Blood Type</label>
                <select
                  name="bloodType"
                  value={form.bloodType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/manage-employee")}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-submit"
            >
              {isSubmitting ? "Adding Employee..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
