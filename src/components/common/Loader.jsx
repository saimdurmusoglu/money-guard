// src/components/common/Loader.jsx
import React from 'react';
import './Loader.css'; // ÇEVİRİ (Yorum): For styling (optional)

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;