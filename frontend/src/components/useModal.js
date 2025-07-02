import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const showModal = (config) => {
    setModalConfig(config);
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
    setModalConfig({});
  };

  // Convenience methods for different types
  const showSuccess = (message, title = 'Success') => {
    showModal({
      type: 'success',
      title,
      message,
      confirmText: 'OK'
    });
  };

  const showError = (message, title = 'Error') => {
    showModal({
      type: 'error',
      title,
      message,
      confirmText: 'OK'
    });
  };

  const showWarning = (message, title = 'Warning') => {
    showModal({
      type: 'warning',
      title,
      message,
      confirmText: 'OK'
    });
  };

  const showInfo = (message, title = 'Information') => {
    showModal({
      type: 'info',
      title,
      message,
      confirmText: 'OK'
    });
  };

  const showConfirm = (message, title = 'Confirm', onConfirm, onCancel) => {
    showModal({
      type: 'warning',
      title,
      message,
      showCancel: true,
      confirmText: 'Yes',
      cancelText: 'No',
      onConfirm,
      onCancel
    });
  };

  return {
    isOpen,
    modalConfig,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  };
};
