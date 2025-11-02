// src/components/dashboard/LogoutModal.jsx
import React from 'react';

import './LogoutModal.css';

const MoneyGuardLogo2 = () => (
  <img src="/img/Logo.svg" alt="Money Guard Logo" className="app-logo" />
);

const LogoutModal = ({ onClose, onLogout }) => {
  return (
    <div className="logout-modal-backdrop" onClick={onClose}>
      <div
        className="logout-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="logout-logo-container">
          <MoneyGuardLogo2 />
          <h2>Money Guard</h2>
        </div>

        <p className="logout-text2">Are you sure you want to log out?</p>

        <div className="logout-actions">
          <button className="logout-btn logout-btn-primary" onClick={onLogout}>
            LOGOUT
          </button>
          <button className="logout-btn logout-btn-secondary" onClick={onClose}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
