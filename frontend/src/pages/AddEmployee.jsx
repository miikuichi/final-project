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
  addressCountry: "PH",
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
    fetch("http://localhost:8081/api/employees/departments")
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
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

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

    // Phone number validation (flexible format)
    if (form.cellphone && form.cellphone.trim()) {
      // Allow various phone formats - just ensure it's reasonable length and contains numbers
      const phoneDigitsOnly = form.cellphone.replace(/\D/g, "");
      if (phoneDigitsOnly.length < 7 || phoneDigitsOnly.length > 15) {
        newErrors.cellphone = "Please enter a valid phone number (7-15 digits)";
      }
    }

    // Date validation - birthday cannot be in the future
    if (form.birthday && form.birthday > today) {
      newErrors.birthday = "Birthday cannot be in the future";
    }

    // Date validation - date hired cannot be in the future
    if (form.dateHired && form.dateHired > today) {
      newErrors.dateHired = "Date hired cannot be in the future";
    }

    // Address validation (basic)
    if (
      form.addressHouse &&
      form.addressCity &&
      form.addressProvince &&
      form.addressZip
    ) {
      // ZIP/Postal code validation (flexible for international codes)
      // Allow 3-10 digits, with optional letters and hyphens (covers US, Philippines, Canada, UK, etc.)
      if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(form.addressZip)) {
        newErrors.addressZip =
          "Please enter a valid postal/ZIP code (3-10 characters)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submission started");
    console.log("Current form data:", form);

    if (!validateForm()) {
      console.log("Form validation failed, errors:", errors);
      alert("Please fix the validation errors before submitting.");
      return;
    }

    console.log("Form validation passed");
    setIsSubmitting(true);

    try {
      console.log("Sending request to backend...");
      // Send as JSON, not FormData
      const response = await fetch("http://localhost:8081/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

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
      console.log("Form submission completed");
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
                <select
                  name="suffix"
                  value={form.suffix}
                  onChange={handleInputChange}
                >
                  <option value="">Select Suffix</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                  <option value="V">V</option>
                  <option value="MD">MD</option>
                  <option value="PhD">PhD</option>
                  <option value="CPA">CPA</option>
                  <option value="Esq.">Esq.</option>
                  <option value="DDS">DDS</option>
                  <option value="DVM">DVM</option>
                  <option value="RN">RN</option>
                  <option value="J.D.">J.D.</option>
                  <option value="M.D.">M.D.</option>
                  <option value="D.D.S.">D.D.S.</option>
                  <option value="D.O.">D.O.</option>
                  <option value="D.C.">D.C.</option>
                  <option value="Ed.D.">Ed.D.</option>
                  <option value="Other">Other</option>
                </select>
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
                placeholder="e.g., 555-123-4567"
                maxLength={15}
                className={errors.cellphone ? "error" : ""}
              />
              {errors.cellphone && (
                <span className="error-text">{errors.cellphone}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={form.birthday}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split("T")[0]} // Prevent future dates
                  className={errors.birthday ? "error" : ""}
                />
                {errors.birthday && (
                  <span className="error-text">{errors.birthday}</span>
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
                <label>ZIP/Postal Code</label>
                <input
                  type="text"
                  name="addressZip"
                  value={form.addressZip}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000 (PH), 12345 (US), K1A 0A9 (CA)"
                  maxLength={10}
                />
                {errors.addressZip && (
                  <span className="error-text">{errors.addressZip}</span>
                )}
              </div>

              <div className="form-group">
                <label>Country</label>
                <select
                  name="addressCountry"
                  value={form.addressCountry}
                  onChange={handleInputChange}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                  <option value="PH">Philippines</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Optional Information */}
          <div className="form-section">
            <h3>Optional Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Religion</label>
                <select
                  name="religion"
                  value={form.religion}
                  onChange={handleInputChange}
                >
                  <option value="">Select Religion</option>
                  <option value="Christianity">Christianity</option>
                  <option value="Roman Catholic">Roman Catholic</option>
                  <option value="Islam">Islam</option>
                  <option value="Secular/Atheist/Agnostic">
                    Secular/Atheist/Agnostic
                  </option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Buddhism">Buddhism</option>
                  <option value="Chinese traditional religion">
                    Chinese traditional religion
                  </option>
                  <option value="Ethnic religions">Ethnic religions</option>
                  <option value="African traditional religions">
                    African traditional religions
                  </option>
                  <option value="Sikhism">Sikhism</option>
                  <option value="Spiritism">Spiritism</option>
                  <option value="Judaism">Judaism</option>
                  <option value="Baháʼí">Baháʼí</option>
                  <option value="Jainism">Jainism</option>
                  <option value="Shinto">Shinto</option>
                  <option value="Cao Dai">Cao Dai</option>
                  <option value="Zoroastrianism">Zoroastrianism</option>
                  <option value="Tenrikyo">Tenrikyo</option>
                  <option value="Animism">Animism</option>
                  <option value="Other">Other</option>
                </select>
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

          {/* Debug Information (remove this in production) */}
          {process.env.NODE_ENV === "development" && (
            <div
              className="form-section"
              style={{
                backgroundColor: "#f0f0f0",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h4>Debug Info</h4>
              <div style={{ fontSize: "12px" }}>
                <p>
                  <strong>Form Valid:</strong>{" "}
                  {Object.keys(errors).length === 0 ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Current Errors:</strong>{" "}
                  {Object.keys(errors).length > 0
                    ? JSON.stringify(errors, null, 2)
                    : "None"}
                </p>
                <p>
                  <strong>Required Fields:</strong>
                </p>
                <ul>
                  <li>First Name: {form.firstName ? "✓" : "✗"}</li>
                  <li>Last Name: {form.lastName ? "✓" : "✗"}</li>
                  <li>Email: {form.email ? "✓" : "✗"}</li>
                  <li>Date Hired: {form.dateHired ? "✓" : "✗"}</li>
                  <li>Department: {form.department ? "✓" : "✗"}</li>
                  <li>Position: {form.position ? "✓" : "✗"}</li>
                </ul>
                <p>
                  <strong>Backend URL:</strong>{" "}
                  http://localhost:8080/api/employees
                </p>
                <button
                  type="button"
                  onClick={() => console.log("Full form state:", form)}
                  style={{ padding: "5px", margin: "5px" }}
                >
                  Log Form to Console
                </button>
              </div>
            </div>
          )}

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
