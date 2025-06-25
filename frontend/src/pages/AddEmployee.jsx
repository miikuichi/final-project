import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../components/RoleContext";
import { AdminNavBar, HRNavBar } from "../components/NavBar";
import { addEmployee } from "../components/employeeStorage";
import "./AddEmployee.css";

const initialState = {
  image: "",
  lastName: "",
  firstName: "",
  middleInitial: "",
  suffix: "",
  birthday: "",
  cellphone: "",
  dateHired: "",
  religion: "",
  email: "",
  course: "",
  school: "",
  licenses: "",
  philhealth: "",
  sss: "",
  pagibig: "",
  tin: "",
  bloodtype: "",
  department: "",
  position: "",
  permanentAddress: {
    house: "",
    barangay: "",
    city: "",
    province: "",
    zip: "",
  },
  currentAddress: {
    house: "",
    barangay: "",
    city: "",
    province: "",
    zip: "",
  },
  sameAsPermanent: false,
};

export default function AddEmployee() {
  const [form, setForm] = useState(initialState);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { role } = useRole();

  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;
    if (name === "sameAsPermanent") {
      setForm((f) => ({
        ...f,
        sameAsPermanent: checked,
        currentAddress: checked ? { ...f.permanentAddress } : f.currentAddress,
      }));
    } else if (name === "image") {
      setForm((f) => ({ ...f, image: e.target.files[0] }));
    } else if (dataset.addrtype) {
      setForm((f) => ({
        ...f,
        [dataset.addrtype]: {
          ...f[dataset.addrtype],
          [name]: value,
        },
      }));
      if (form.sameAsPermanent && dataset.addrtype === "permanentAddress") {
        setForm((f) => ({
          ...f,
          currentAddress: { ...f.permanentAddress, [name]: value },
        }));
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const validateEmail = () => {
    const email = form.email.user + form.email.domain;
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!re.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleClear = () => {
    setForm(initialState);
    setShowClearModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await addEmployee(form);
      setForm(initialState);
      setShowConfirmModal(false);
      alert("Employee added successfully!");
      navigate(-1); // Go back to previous page
    } catch (err) {
      alert("Failed to add employee: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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
        style={{
          background: "#fff",
          borderRadius: "1.5rem",
          maxWidth: "60%",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0.5rem auto",
        }}
        className="wide"
      >
        <h2>Add Employee</h2>
        <form className="add-employee-form" onSubmit={handleSubmit}>
          <div className="form-row image-name-row">
            <div className="image-upload-container">
              <label htmlFor="image-upload" className="image-label">
                Image
              </label>
              <div className="image-preview-box">
                {form.image ? (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Employee"
                    className="preview-img-large"
                  />
                ) : (
                  <span className="image-placeholder">No Image</span>
                )}
              </div>
              <div className="image-upload-center">
                <input
                  id="image-upload"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="name-flexbox">
              <div className="form-row single-field-row">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  id="lastName"
                  className="ae-textbox"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row single-field-row">
                <label htmlFor="firstName">First Name:</label>
                <input
                  id="firstName"
                  className="ae-textbox"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row mi-suffix-row-inline">
                <label
                  htmlFor="middleInitial"
                  style={{ marginRight: "0.5rem" }}
                >
                  M.I.:
                </label>
                <input
                  id="middleInitial"
                  className="ae-textbox"
                  name="middleInitial"
                  value={form.middleInitial}
                  onChange={handleChange}
                  maxLength={1}
                  style={{ width: "3.5rem", marginRight: "1.5rem" }}
                />
                <label htmlFor="suffix" style={{ marginRight: "0.5rem" }}>
                  Suffix:
                </label>
                <select
                  id="suffix"
                  name="suffix"
                  value={form.suffix}
                  onChange={handleChange}
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
                <label htmlFor="birthday">Birthday</label>
                <input
                  id="birthday"
                  type="date"
                  className="ae-textbox"
                  name="birthday"
                  value={form.birthday}
                  onChange={handleChange}
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
              id="house-perm"
              className="ae-textbox"
              name="house"
              data-addrtype="permanentAddress"
              placeholder="House/Building No."
              value={form.permanentAddress.house}
              onChange={handleChange}
              required
            />
            <input
              id="barangay-perm"
              className="ae-textbox"
              name="barangay"
              data-addrtype="permanentAddress"
              placeholder="Barangay"
              value={form.permanentAddress.barangay}
              onChange={handleChange}
              required
            />
            <input
              id="city-perm"
              className="ae-textbox"
              name="city"
              data-addrtype="permanentAddress"
              placeholder="Municipality/City"
              value={form.permanentAddress.city}
              onChange={handleChange}
              required
            />
            <input
              id="province-perm"
              className="ae-textbox"
              name="province"
              data-addrtype="permanentAddress"
              placeholder="Province"
              value={form.permanentAddress.province}
              onChange={handleChange}
              required
            />
            <input
              id="zip-perm"
              className="ae-textbox"
              name="zip"
              data-addrtype="permanentAddress"
              placeholder="ZIP Code"
              value={form.permanentAddress.zip}
              onChange={handleChange}
              required
              style={{ width: "6rem" }}
            />
          </div>
          <div className="form-row address-row">
            <label className="address-label">Current Address:</label>
          </div>
          <div className="form-row address-fields-row">
            <input
              id="house-curr"
              className="ae-textbox"
              name="house"
              data-addrtype="currentAddress"
              placeholder="House/Building No."
              value={
                form.sameAsPermanent
                  ? form.permanentAddress.house
                  : form.currentAddress.house
              }
              onChange={handleChange}
              required
              disabled={form.sameAsPermanent}
            />
            <input
              id="barangay-curr"
              className="ae-textbox"
              name="barangay"
              data-addrtype="currentAddress"
              placeholder="Barangay"
              value={
                form.sameAsPermanent
                  ? form.permanentAddress.barangay
                  : form.currentAddress.barangay
              }
              onChange={handleChange}
              required
              disabled={form.sameAsPermanent}
            />
            <input
              id="city-curr"
              className="ae-textbox"
              name="city"
              data-addrtype="currentAddress"
              placeholder="Municipality/City"
              value={
                form.sameAsPermanent
                  ? form.permanentAddress.city
                  : form.currentAddress.city
              }
              onChange={handleChange}
              required
              disabled={form.sameAsPermanent}
            />
            <input
              id="province-curr"
              className="ae-textbox"
              name="province"
              data-addrtype="currentAddress"
              placeholder="Province"
              value={
                form.sameAsPermanent
                  ? form.permanentAddress.province
                  : form.currentAddress.province
              }
              onChange={handleChange}
              required
              disabled={form.sameAsPermanent}
            />
            <input
              id="zip-curr"
              className="ae-textbox"
              name="zip"
              data-addrtype="currentAddress"
              placeholder="ZIP Code"
              value={
                form.sameAsPermanent
                  ? form.permanentAddress.zip
                  : form.currentAddress.zip
              }
              onChange={handleChange}
              required
              disabled={form.sameAsPermanent}
              style={{ width: "6rem" }}
            />
          </div>
          <div className="form-row checkbox-row">
            <label className="checkbox-label" htmlFor="sameAsPermanent">
              <input
                id="sameAsPermanent"
                type="checkbox"
                name="sameAsPermanent"
                checked={form.sameAsPermanent}
                onChange={handleChange}
              />{" "}
              Similar with permanent address
            </label>
          </div>
          <div className="form-row">
            <label htmlFor="cellphone">Cellphone:</label>
            <input
              id="cellphone"
              name="cellphone"
              className="ae-textbox"
              value={form.cellphone}
              onChange={handleChange}
              required
            />
            <label htmlFor="dateHired">Date Hired:</label>
            <input
              id="dateHired"
              type="date"
              name="dateHired"
              className="ae-textbox"
              value={form.dateHired}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="religion">Religion:</label>
            <input
              id="religion"
              name="religion"
              className="ae-textbox"
              value={form.religion}
              onChange={handleChange}
            />
            <label htmlFor="bloodtype">Bloodtype:</label>
            <input
              id="bloodtype"
              name="bloodtype"
              className="ae-textbox"
              value={form.bloodtype}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="department">Department:</label>
            <input
              id="department"
              name="department"
              className="ae-textbox"
              value={form.department}
              onChange={handleChange}
              required
            />
            <label htmlFor="position">Position Title:</label>
            <input
              id="position"
              name="position"
              className="ae-textbox"
              value={form.position}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="course">Course:</label>
            <input
              id="course"
              name="course"
              className="ae-textbox"
              value={form.course}
              onChange={handleChange}
            />
            <label htmlFor="school">School:</label>
            <input
              id="school"
              name="school"
              className="ae-textbox"
              value={form.school}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="licenses">Licenses:</label>
            <input
              id="licenses"
              name="licenses"
              className="ae-textbox"
              value={form.licenses}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="philhealth">PhilHealth:</label>
            <input
              id="philhealth"
              name="philhealth"
              className="ae-textbox"
              value={form.philhealth}
              onChange={handleChange}
            />
            <label htmlFor="sss">SSS:</label>
            <input
              id="sss"
              name="sss"
              className="ae-textbox"
              value={form.sss}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="pagibig">Pag-IBIG:</label>
            <input
              id="pagibig"
              name="pagibig"
              className="ae-textbox"
              value={form.pagibig}
              onChange={handleChange}
            />
            <label htmlFor="tin">TIN:</label>
            <input
              id="tin"
              name="tin"
              className="ae-textbox"
              value={form.tin}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="emailUser">Email:</label>
            <input
              id="emailUser"
              name="emailUser"
              className="ae-textbox"
              value={form.email.user}
              onChange={handleChange}
              required
              style={{ width: "200px" }}
            />
            <label htmlFor="emailDomain" style={{ marginLeft: "0.5rem" }}>
              Domain:
            </label>
            <select
              id="emailDomain"
              name="emailDomain"
              className="ae-textbox"
              value={form.email.domain}
              onChange={handleChange}
              required
              style={{ width: "140px" }}
            >
              <option value="@gmail.com">@gmail.com</option>
              <option value="@yahoo.com">@yahoo.com</option>
              <option value="@outlook.com">@outlook.com</option>
              <option value="@company.com">@company.com</option>
            </select>
            {emailError && <span className="error-message">{emailError}</span>}
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="clear-btn"
              onClick={() => setShowClearModal(true)}
            >
              Clear
            </button>
            <button type="submit" className="add-btn" disabled={loading}>
              Add Employee
            </button>
          </div>
        </form>
        {showClearModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Clear Form</h3>
              <p>
                Clearing this form will remove all input data. Are you sure?
              </p>
              <div className="modal-actions">
                <button onClick={handleClear}>Yes</button>
                <button onClick={() => setShowClearModal(false)}>No</button>
              </div>
            </div>
          </div>
        )}
        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="close-btn"
                onClick={() => setShowConfirmModal(false)}
              >
                &times;
              </button>
              <h3>Confirm Employee Details</h3>
              <div className="confirm-details">
                {form.image && (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Employee"
                    className="preview-img"
                  />
                )}
                <div>
                  <b>Name:</b> {form.lastName}, {form.firstName}{" "}
                  {form.middleInitial && form.middleInitial + "."} {form.suffix}
                </div>
                <div>
                  <b>Birthday:</b> {form.birthday}
                </div>
                <div>
                  <b>Cellphone:</b> {form.cellphone}
                </div>
                <div>
                  <b>Date Hired:</b> {form.dateHired}
                </div>
                <div>
                  <b>Religion:</b> {form.religion}
                </div>
                <div>
                  <b>Bloodtype:</b> {form.bloodtype}
                </div>
                <div>
                  <b>Department:</b> {form.department}
                </div>
                <div>
                  <b>Position:</b> {form.position}
                </div>
                <div>
                  <b>Course:</b> {form.course}
                </div>
                <div>
                  <b>School:</b> {form.school}
                </div>
                <div>
                  <b>Licenses:</b> {form.licenses}
                </div>
                <div>
                  <b>PhilHealth:</b> {form.philhealth}
                </div>
                <div>
                  <b>SSS:</b> {form.sss}
                </div>
                <div>
                  <b>Pag-IBIG:</b> {form.pagibig}
                </div>
                <div>
                  <b>TIN:</b> {form.tin}
                </div>
                <div>
                  <b>Email:</b> {form.email.user}
                  {form.email.domain}
                </div>
                <div>
                  <b>Permanent Address:</b>{" "}
                  {Object.values(form.permanentAddress)
                    .filter(Boolean)
                    .join(", ")}
                </div>
                <div>
                  <b>Current Address:</b>{" "}
                  {Object.values(form.currentAddress)
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
              <button
                className="confirm-btn"
                onClick={handleConfirm}
                style={{ float: "right" }}
                disabled={loading}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
