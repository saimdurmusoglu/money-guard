// src/components/common/MobileNavButtons.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdHome, MdTimeline } from 'react-icons/md';
import { FaDollarSign } from 'react-icons/fa';
import './MobileNavButtons.css';

const MobileNavButtons = () => {
  return (
    <div className="mobile-nav-buttons">
      <NavLink
        to="."
        end
        className={({ isActive }) =>
          `nav-button ${isActive ? 'active' : ''}`
        }
        aria-label="Home"
      >
        <MdHome className="icon" />
      </NavLink>

      <NavLink
        to="statistics"
        className={({ isActive }) =>
          `nav-button ${isActive ? 'active' : ''}`
        }
        aria-label="Statistics"
      >
        <MdTimeline className="icon" />
      </NavLink>

      <NavLink
        to="currency"
        className={({ isActive }) =>
          `nav-button ${isActive ? 'active' : ''}`
        }
        aria-label="Currency"
      >
        <FaDollarSign className="icon" />
      </NavLink>
    </div>
  );
};

export default MobileNavButtons;