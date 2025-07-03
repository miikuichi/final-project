import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../components/RoleContext";
import { AdminNavBar, HRNavBar } from "../components/NavBar";
import Modal from "../components/Modal";
import { useModal } from "../components/useModal";
import EmployeeForm from "../components/EmployeeForm";
import "../styles.css";

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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { role } = useRole();
  const {
    isOpen,
    modalConfig,
    hideModal,
    showSuccess,
    showError,
    showWarning,
  } = useModal();

  const validateForm = (formData) => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    // Required fields
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.dateHired.trim())
      newErrors.dateHired = "Date hired is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.position.trim()) newErrors.position = "Position is required";

    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation (flexible format)
    if (formData.cellphone && formData.cellphone.trim()) {
      const phoneDigitsOnly = formData.cellphone.replace(/\D/g, "");
      if (phoneDigitsOnly.length < 7 || phoneDigitsOnly.length > 15) {
        newErrors.cellphone = "Please enter a valid phone number (7-15 digits)";
      }
    }

    // Date validation - birthday cannot be in the future
    if (formData.birthday && formData.birthday > today) {
      newErrors.birthday = "Birthday cannot be in the future";
    }

    // Date validation - date hired cannot be in the future
    if (formData.dateHired && formData.dateHired > today) {
      newErrors.dateHired = "Date hired cannot be in the future";
    }

    // Address validation (basic)
    if (
      formData.addressHouse &&
      formData.addressCity &&
      formData.addressProvince &&
      formData.addressZip
    ) {
      if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(formData.addressZip)) {
        newErrors.addressZip =
          "Please enter a valid postal/ZIP code (3-10 characters)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData) => {
    console.log("Form submission started");
    console.log("Current form data:", formData);

    if (!validateForm(formData)) {
      console.log("Form validation failed");
      showWarning("Please fix the validation errors before submitting.");
      return;
    }

    console.log("Form validation passed");
    setIsSubmitting(true);

    try {
      console.log("Sending request to backend...");
      const response = await fetch("http://localhost:8080/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log("Employee created successfully:", result);
        showSuccess("Employee added successfully!");
        // Clear errors on successful submission
        setErrors({});
        navigate("/manage-employee");
      } else {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        showError(errorText || "Failed to add employee. Please try again.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      showError("Network error. Please check your connection and try again.");
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

        <EmployeeForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          errors={errors}
          submitButtonText="Add Employee"
          cancelButtonText="Cancel"
          onCancel={() => navigate("/manage-employee")}
        />
      </div>

      <Modal isOpen={isOpen} onClose={hideModal} {...modalConfig} />
    </div>
  );
}
