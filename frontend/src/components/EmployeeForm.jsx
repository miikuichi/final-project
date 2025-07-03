import React, { useState, useEffect } from "react";
import Button from "./Button";

const EmployeeForm = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  errors = {},
  showReasonField = false,
  reasonValue = "",
  onReasonChange = () => {},
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  onCancel = () => {},
}) => {
  const defaultState = {
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

  const [departments, setDepartments] = useState({});
  const [availablePositions, setAvailablePositions] = useState([]);
  const [form, setForm] = useState({ ...defaultState, ...initialData });

  // Load departments and positions from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/employees/departments")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
      })
      .catch((err) => console.error("Error loading departments:", err));
  }, []);

  useEffect(() => {
    setForm({ ...defaultState, ...initialData });
  }, [initialData]);

  useEffect(() => {
    if (form.department && departments[form.department]) {
      setAvailablePositions(departments[form.department]);
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
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
          {errors.email && <span className="error-text">{errors.email}</span>}
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
              max={new Date().toISOString().split("T")[0]}
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
            <strong>Note:</strong> Salary will be automatically assigned based
            on the selected position.
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

      {/* Reason field for edit mode */}
      {showReasonField && (
        <div className="form-section">
          <h3>Reason for Changes</h3>
          <div className="form-group">
            <label>Reason *</label>
            <textarea
              value={reasonValue}
              onChange={onReasonChange}
              placeholder="Please provide a reason for the changes..."
              className="reason-textarea"
              rows={4}
              required
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="form-actions">
        <Button
          type="button"
          onClick={onCancel}
          className="btn-cancel"
          label={cancelButtonText}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn-submit"
          label={isSubmitting ? "Processing..." : submitButtonText}
        />
      </div>
    </form>
  );
};

export default EmployeeForm;
