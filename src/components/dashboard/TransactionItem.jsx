// src/components/dashboard/TransactionItem.jsx
import React from 'react';
import { RiPencilFill } from 'react-icons/ri';
import './TransactionItem.css';

import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';

const TransactionItem = ({
  transaction,
  onEdit,
  onDelete,
  isActive,
  onSelect,
  categoryMap,
}) => {
  const { id, transactionDate, type, comment, amount, categoryId } =
    transaction || {};

  const cardClasses = `transaction-item-card ${isActive ? 'active' : ''}`;
  const sumClass = `transaction-sum ${
    type === 'INCOME' ? 'income' : 'expense'
  }`;
  const displayType = type === 'INCOME' ? '+' : '-';

  const displayDate = formatDate(transactionDate) || 'N/A';

  const formattedAmount = formatCurrency(Math.abs(amount || 0));

  const getCategoryName = (type, catId, map) => {
    if (type === 'INCOME') {
      return 'Income';
    }
    if (catId && map && map[catId]) {
      return map[catId];
    }
    return 'Unknown Category';
  };

  const displayCategory = getCategoryName(type, categoryId, categoryMap);

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(transaction);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className={cardClasses} onClick={onSelect}>
      <div className="transaction-row">
        <span className="transaction-label">Date</span>
        <span className="transaction-value">{displayDate}</span>
      </div>
      <div className="transaction-row">
        <span className="transaction-label">Type</span>
        <span className="transaction-value">{displayType}</span>
      </div>
      <div className="transaction-row">
        <span className="transaction-label">Category</span>
        <span className="transaction-value">{displayCategory}</span>
      </div>
      <div className="transaction-row">
        <span className="transaction-label">Comment</span>
        <span className="transaction-value">{comment || ''}</span>
      </div>
      <div className="transaction-row">
        <span className="transaction-label">Sum</span>
        <span className={sumClass}>{formattedAmount}</span>
      </div>
      <div className="transaction-actions">
        <button
          onClick={handleDeleteClick}
          className="action-button delete-button"
        >
          Delete
        </button>
        <button onClick={handleEditClick} className="action-button edit-button">
          <RiPencilFill className="icon" /> Edit
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;