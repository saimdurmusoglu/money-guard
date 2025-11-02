// src/components/dashboard/AddTransactionModal.jsx
import React, { useState, useMemo } from 'react';
import { RiCloseLine, RiCalendar2Fill } from 'react-icons/ri';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  useAddTransactionMutation,
  useGetTransactionCategoriesQuery,
} from '../../store/api/transactionsApi';
import { toast } from 'react-toastify';

import './AddTransactionModal.css';

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <div className="atm-custom-date-input-container" onClick={onClick} ref={ref}>
    <input
      type="text"
      className="atm-form-input atm-date"
      value={value}
      readOnly
    />
    <RiCalendar2Fill className="atm-date-picker-icon" />
  </div>
));
CustomDateInput.displayName = 'CustomDateInput';

const AddTransactionModal = ({ onClose }) => {
  const { data: apiCategories, isLoading: isCategoriesLoading } =
    useGetTransactionCategoriesQuery();
  const categoryOptions = useMemo(() => {
    if (!apiCategories) return [];
    return apiCategories.map((cat) => ({ value: cat.id, label: cat.name }));
  }, [apiCategories]);
  const incomeCategory = useMemo(() => {
    if (!apiCategories) return null;
    return apiCategories.find(
      (cat) =>
        cat.name?.toLowerCase() === 'income' ||
        cat.name?.toLowerCase() === 'transfer',
    );
  }, [apiCategories]);

  const [isExpense, setIsExpense] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [amount, setAmount] = useState('0.00');
  const [comment, setComment] = useState('');
  const [addTransaction, { isLoading }] = useAddTransactionMutation();

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
  const handleToggleChange = () => {
    setIsExpense((prevIsExpense) => !prevIsExpense);
    setSelectedCategory(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || isCategoriesLoading) return;
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      toast.error('Amount must be greater than 0.');
      return;
    }
    if (isExpense && (!selectedCategory || !selectedCategory.value)) {
      toast.error('Please select a category.');
      return;
    }
    if (!isExpense && (!incomeCategory || !incomeCategory.id)) {
      toast.error(
        'Income category could not be loaded from the API. Cannot add transaction.',
      );
      return;
    }
    const finalAmount = Number(Math.abs(parsedAmount).toFixed(2));
    const newTransaction = {
      amount: isExpense ? -finalAmount : finalAmount,
      transactionDate: startDate.toISOString(),
      type: isExpense ? 'EXPENSE' : 'INCOME',
      comment: comment,
      categoryId: isExpense ? selectedCategory.value : incomeCategory.id,
    };

    try {
      await addTransaction(newTransaction).unwrap();
      toast.success('Transaction added successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to add transaction (Full Error):', err);
      console.error('API Error Data:', err.data);

      let errorMessage = 'Failed to add transaction.';
      if (Array.isArray(err.data?.message)) {
        errorMessage = err.data.message.join('; ');
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      }
      toast.error(errorMessage);
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '1px solid var(--color-white-40)',
      borderRadius: 0,
      boxShadow: 'none',
      '&:hover': { borderBottom: '1px solid var(--color-white-40)' },
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: 'normal',
      letterSpacing: 0,
      cursor: 'pointer',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'var(--color-white-60, rgba(255, 255, 255, 0.6))',
      textAlign: 'left',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--color-white, #FFFFFF)',
      textAlign: 'left',
    }),
    input: (provided) => ({
      ...provided,
      color: 'var(--color-white, #FFFFFF)',
      lineHeight: 'normal',
      letterSpacing: 0,
    }),
    menu: (provided) => ({
      ...provided,
      backgroundImage: 'var(--color-small-form-gradient)',
      backgroundColor: '#dbdbdb',
      borderRadius: '8px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
      marginTop: '5px',
      zIndex: 10,
    }),
    menuList: (provided) => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0,
      borderRadius: '8px',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 'normal',
      letterSpacing: 0,
      cursor: 'pointer',
      textAlign: 'left',
      color: state.isFocused
        ? 'var(--color-dashboard-text, #ff868d)'
        : 'var(--color-white, #FFFFFF)',
      backgroundColor: state.isFocused
        ? 'var(--color-select-option-hover, #6E3F9C)'
        : 'transparent',
      '&:active': {
        backgroundColor: 'var(--color-select-option-active, #6E3F9C)',
        color: 'var(--color-dashboard-text, #ff868d)',
      },
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'var(--color-white-60, rgba(255, 255, 255, 0.6))',
      '&:hover': { color: 'var(--color-white, #FFFFFF)' },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  return (
    <div className="atm-modal-backdrop" onClick={onClose}>
      <div className="atm-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="atm-modal-close-btn" onClick={onClose}>
          <RiCloseLine />
        </button>
        <h2>Add transaction</h2>
        <form onSubmit={handleSubmit} className="atm-transaction-form">
          <div className="atm-transaction-type-toggle">
            <span
              className={`atm-toggle-label ${
                !isExpense ? 'atm-active-income' : ''
              }`}
            >
              Income
            </span>
            <label className="atm-switch">
              <input
                type="checkbox"
                checked={isExpense}
                onChange={handleToggleChange}
              />
              <span className="atm-slider atm-round"></span>
            </label>
            <span
              className={`atm-toggle-label ${
                isExpense ? 'atm-active-expense' : ''
              }`}
            >
              Expense
            </span>
          </div>

          <div className="atm-form-inputs">
            {isExpense && (
              <Select
                styles={customSelectStyles}
                options={categoryOptions}
                isLoading={isCategoriesLoading}
                placeholder={
                  isCategoriesLoading
                    ? 'Loading categories...'
                    : 'Select a category'
                }
                onChange={setSelectedCategory}
                value={selectedCategory}
                classNamePrefix="atm-select"
                maxMenuHeight={200}
                isDisabled={isCategoriesLoading || categoryOptions.length === 0}
              />
            )}
            <div className="atm-amount-date-group">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                className="atm-form-input atm-amount"
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
                className="atm-form-input atm-date"
              />
            </div>
            <textarea
              placeholder="Comment"
              className="atm-form-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="atm-form-actions">
            <button
              type="submit"
              className="atm-form-action-button atm-add-button"
              disabled={isLoading || isCategoriesLoading}
            >
              {isLoading ? 'ADDING...' : 'ADD'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="atm-form-action-button atm-cancel-button"
              disabled={isLoading || isCategoriesLoading}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
