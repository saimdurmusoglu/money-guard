// src/components/common/Navigation.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdHome, MdTimeline } from "react-icons/md";
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="main-navigation">
      <NavLink
        to="."
        end
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        <div className="nav-icon-wrapper">
          <MdHome className="nav-icon" />
        </div>
        <span className="nav-text">Home</span>
      </NavLink>

      <NavLink
        to="statistics"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        <div className="nav-icon-wrapper">
          <MdTimeline className="nav-icon" />
        </div>
        <span className="nav-text">Statistics</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;