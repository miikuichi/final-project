import React, { useEffect } from "react";
import "../styles.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info", // 'info', 'success', 'error', 'warning'
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
  onConfirm,
  onCancel,
  children,
  actions,
  showDefaultActions = true,
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset"; // Restore scrolling
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      default:
        return "ℹ";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content modal-${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          {!children && <div className="modal-icon">{getIcon()}</div>}
          <div className="modal-title-container">
            {typeof title === "string" ? (
              <h3 className="modal-title">{title || "Notification"}</h3>
            ) : (
              <div className="modal-title">{title}</div>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {children ? children : <p className="modal-message">{message}</p>}
        </div>

        {(actions || (showDefaultActions && !children)) && (
          <div className="modal-footer">
            {actions ? (
              actions
            ) : (
              <>
                {showCancel && (
                  <button
                    className="modal-btn modal-btn-cancel"
                    onClick={handleCancel}
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  className="modal-btn modal-btn-confirm"
                  onClick={handleConfirm}
                >
                  {confirmText}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
