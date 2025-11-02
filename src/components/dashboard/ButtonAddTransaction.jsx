// src/components/dashboard/ButtonAddTransaction.jsx
import React from 'react';
import { RiAddLine } from 'react-icons/ri';
import './ButtonAddTransaction.css';

const ButtonAddTransaction = ({ onClick }) => {
  return (
    <button className="fab-add-transaction" onClick={onClick}>
      <RiAddLine size={28} />
    </button>
  );
};

export default ButtonAddTransaction;