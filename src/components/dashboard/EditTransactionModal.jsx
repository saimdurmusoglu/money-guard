// src/components/dashboard/EditTransactionModal.jsx
import React, { useState, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RiCalendar2Fill } from 'react-icons/ri';

import { useUpdateTransactionMutation } from '../../store/api/transactionsApi';
import { toast } from 'react-toastify';

import './EditTransactionModal.css';

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <div className="etm-custom-date-input-container" onClick={onClick} ref={ref}>
    <input
      type="text"
      className="etm-form-input etm-date"
      value={value}
      readOnly
    />
    <RiCalendar2Fill className="etm-date-picker-icon" />
  </div>
));
CustomDateInput.displayName = 'CustomDateInput';

const EditTransactionModal = ({ onClose, transactionToEdit, categoryMap }) => {
  const [isExpense, setIsExpense] = useState(true);
  const [amount, setAmount] = useState('0.00');
  const [startDate, setStartDate] = useState(new Date());
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('');

  const [updateTransaction, { isLoading }] = useUpdateTransactionMutation();

  useEffect(() => {
    if (transactionToEdit && transactionToEdit.id) {
      const isExpenseType = transactionToEdit.type === 'EXPENSE';
      setIsExpense(isExpenseType);

      setAmount(
        typeof transactionToEdit.amount === 'number'
          ? Math.abs(transactionToEdit.amount).toFixed(2)
          : '0.00',
      );

      const dateString =
        transactionToEdit.transactionDate ||
        new Date().toISOString().split('T')[0];
      setStartDate(new Date(`${dateString}T12:00:00Z`));

      setComment(transactionToEdit.comment || '');

      if (isExpenseType && transactionToEdit.categoryId && categoryMap) {
        const categoryNameFromMap = categoryMap[transactionToEdit.categoryId];
        setCategory(categoryNameFromMap || 'Unknown Category');
      } else {
        setCategory('');
      }
    } else {
      setIsExpense(true);
      setAmount('0.00');
      setStartDate(new Date());
      setComment('');
      setCategory('');
    }
  }, [transactionToEdit, categoryMap]);

  const handleAmountFocus = (e) => {
    if (e.target.value === '0.00') setAmount('');
  };
  const handleAmountBlur = (e) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) || value === 0 ? '0.00' : value.toFixed(2));
  };
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*(\.\d{0,2})?$/;
    if (regex.test(value) || value === '') setAmount(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !transactionToEdit || !transactionToEdit.id) return;

    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      toast.error('Amount must be greater than 0.');
      return;
    }
    if (isExpense && (!category.trim() || category === 'Unknown Category')) {
      toast.error('Please specify a valid category.');
      return;
    }

    const updatedTransactionData = {
      amount: isExpense ? -Math.abs(parsedAmount) : Math.abs(parsedAmount),
      transactionDate: startDate.toISOString(),
      type: isExpense ? 'EXPENSE' : 'INCOME',
      comment: comment,
      ...(isExpense && { categoryId: transactionToEdit.categoryId }),
    };

    const payload = {
      id: transactionToEdit.id,
      ...updatedTransactionData,
    };

    try {
      await updateTransaction(payload).unwrap();

      toast.success('Transaction updated successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to update transaction:', err);
      toast.error(err.data?.message || 'Failed to update transaction.');
    }
  };

  return (
    <div className="etm-modal-backdrop" onClick={onClose}>
      <div className="etm-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="etm-modal-close-btn" onClick={onClose}>
          <RiCloseLine size={24} />
        </button>

        <h2>Edit transaction</h2>

        <form onSubmit={handleSubmit} className="etm-transaction-form">
          <div className="etm-edit-toggle-group">
            <span
              className={`etm-edit-toggle-label ${
                !isExpense ? 'etm-active-income' : ''
              }`}
              onClick={() => setIsExpense(false)}
            >
              Income
            </span>
            <span className="etm-edit-toggle-separator">/</span>
            <span
              className={`etm-edit-toggle-label ${
                isExpense ? 'etm-active-expense' : ''
              }`}
              onClick={() => setIsExpense(true)}
            >
              Expense
            </span>
          </div>

          <div className="etm-form-inputs">
            {isExpense && (
              <input
                type="text"
                placeholder="Category"
                className="etm-form-input"
                value={category}
                readOnly
                required
              />
            )}

            <div className="etm-amount-date-group">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                className="etm-form-input etm-amount"
                value={amount}
                onChange={handleAmountChange}
                onFocus={handleAmountFocus}
                onBlur={handleAmountBlur}
                required
              />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MM/dd/yyyy"
                customInput={<CustomDateInput />}
                className="etm-form-input etm-date"
              />
            </div>

            <textarea
              placeholder="Comment"
              className="etm-form-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="etm-form-actions">
            <button
              type="submit"
              className="etm-form-action-button etm-add-button"
              disabled={isLoading}
            >
              {isLoading ? 'SAVING...' : 'SAVE'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="etm-form-action-button etm-cancel-button"
              disabled={isLoading}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;