// src/components/common/MobileOnlyWrapper.jsx
import React from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Navigate } from 'react-router-dom';

const MobileOnlyWrapper = ({ children }) => {
  const isTabletOrDesktop = useMediaQuery('(min-width: 768px)');

  if (isTabletOrDesktop) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default MobileOnlyWrapper;