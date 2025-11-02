// src/components/common/Header.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { TbLogout } from 'react-icons/tb';
import './Header.css';

import LogoutModal from '../dashboard/LogoutModal'; 

const AppLogo = () => (
  <img src="/img/Logo.svg" alt="Money Guard Logo" className="app-logo" />
);

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setIsLogoutModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleExitClick = () => {
    setIsLogoutModalOpen(true);
  };

  let userName = 'User';
  if (user && user.email) {
    userName = user.email.split('@')[0];
  } else if (user && user.username) {
    userName = user.username;
  }

  return (
    <header className="main-header">
      <div className="main-container">
        <div className="header-left">
          <AppLogo />
          <span className="header-app-name">Money Guard</span>
        </div>
        <div className="header-right">
          <span className="header-username">{userName}</span>
          <span className="header-separator">|</span>
          <button
            onClick={handleExitClick}
            className="logout-button"
            aria-label="log out"
          >
            <TbLogout className="logout-icon" />
            <span className="logout-text">Exit</span>
          </button>
        </div>
      </div>

      {isLogoutModalOpen && (
        <LogoutModal 
          onClose={handleCloseModal} 
          onLogout={handleLogoutConfirm} 
        />
      )}
    </header>
  );
};

export default Header;