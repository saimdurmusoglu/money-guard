// src/components/dashboard/DeleteConfirmationModal.jsx
import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ onClose, onConfirm }) => {
  return (
    <div className="del-modal-backdrop" onClick={onClose}>

      <div 
        className="del-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <p className="del-modal-text">
          Are you sure you want to delete this transaction?
        </p>

        <div className="del-modal-actions">
          <button 
            className="del-btn del-btn-primary" 
            onClick={onConfirm}
          >
            DELETE
          </button>
          <button 
            className="del-btn del-btn-secondary" 
            onClick={onClose}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;