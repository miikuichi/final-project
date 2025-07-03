import React from "react";
import Modal from "./Modal";
import { useModal } from "./useModal";
import Button from "./Button"; // Import the Button component

// Example usage component - can be used as reference
const ModalExample = () => {
  const {
    isOpen,
    modalConfig,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  } = useModal();

  const handleSuccessExample = () => {
    showSuccess("Operation completed successfully!");
  };

  const handleErrorExample = () => {
    showError("Something went wrong. Please try again.");
  };

  const handleWarningExample = () => {
    showWarning("Please check your input before continuing.");
  };

  const handleInfoExample = () => {
    showInfo("This is an informational message for the user.");
  };

  const handleConfirmExample = () => {
    showConfirm(
      "Are you sure you want to proceed with this action?",
      "Confirm Action",
      () => {
        // User confirmed
        showSuccess("Action confirmed!");
      },
      () => {
        // User cancelled
        showInfo("Action cancelled.");
      }
    );
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Modal Examples</h2>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <Button onClick={handleSuccessExample} label="Show Success" />
        <Button onClick={handleErrorExample} label="Show Error" />
        <Button onClick={handleWarningExample} label="Show Warning" />
        <Button onClick={handleInfoExample} label="Show Info" />
        <Button onClick={handleConfirmExample} label="Show Confirm" />
      </div>

      <div>
        <h3>Usage Instructions:</h3>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
            fontSize: "0.9rem",
          }}
        >
          {`// 1. Import the components
import Modal from '../components/Modal';
import { useModal } from '../components/useModal';

// 2. Use the hook in your component
const { isOpen, modalConfig, hideModal, showSuccess, showError, showWarning, showInfo, showConfirm } = useModal();

// 3. Replace alert() calls with modal methods
// Instead of: alert("Success!");
showSuccess("Success!");

// Instead of: alert("Error occurred!");
showError("Error occurred!");

// Instead of: if (confirm("Are you sure?")) { ... }
showConfirm("Are you sure?", "Confirm", () => {
  // User confirmed
}, () => {
  // User cancelled (optional)
});

// 4. Add the Modal component to your JSX
<Modal
  isOpen={isOpen}
  onClose={hideModal}
  {...modalConfig}
/>`}
        </pre>
      </div>

      <Modal isOpen={isOpen} onClose={hideModal} {...modalConfig} />
    </div>
  );
};

export default ModalExample;
