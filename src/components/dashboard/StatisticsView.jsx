// src/components/dashboard/StatisticsView.jsx
import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import DoughnutChart from './DoughnutChart';
import { useGetTransactionsSummaryQuery } from '../../store/api/transactionsApi';
import { useOutletContext } from 'react-router-dom';

import {
  getCurrentMonth,
  getMonthsOptions,
  getYearsOptions,
} from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';

import './StatisticsView.css';

const MONTH_OPTIONS = getMonthsOptions();
const YEAR_OPTIONS = getYearsOptions(2023);

const CHART_COLOR_PALETTE = [
  '#FED057',
  '#FFD8D0',
  '#FD9498',
  '#C5BAFF',
  '#6E78E8',
  '#4A56E2',
  '#81E1FF',
  '#24CCA7',
  '#00AD84',
  '#9B59B6',
  '#3498DB',
  '#E67E22',
];

const categoryColors = {
  'Main expenses': '#FED057',
  Products: '#FFD8D0',
  Car: '#FD9498',
  'Self care': '#C5BAFF',
  'Child care': '#6E78E8',
  'Household products': '#4A56E2',
  Education: '#81E1FF',
  Leisure: '#24CCA7',
  'Other expenses': '#00AD84',
  Income: '#00AD84',
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

const StatisticsView = () => {
  const defaultYear =
    YEAR_OPTIONS.find((y) => y.value === new Date().getFullYear()) ||
    YEAR_OPTIONS[0];

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const {
    data: summary,
    isLoading,
    isError,
  } = useGetTransactionsSummaryQuery({
    month: selectedMonth.value,
    year: selectedYear.value,
  });

  const processedData = useMemo(() => {
    if (!summary) {
      return { totalExpenses: 0, totalIncome: 0, expenseCategories: [] };
    }

    const totalExpenses = Math.abs(summary.expenseSummary) || 0;
    const rawCategories = summary.categoriesSummary || [];

    const calculatedTotalIncome = rawCategories
      .filter((cat) => cat.type === 'INCOME')
      .reduce((acc, cat) => acc + Math.abs(cat.total || 0), 0);

    const totalIncome = calculatedTotalIncome;

    let colorIndex = 0;

    const expenseCategories = rawCategories
      .filter((cat) => cat.type === 'EXPENSE')
      .map((cat) => {
        let assignedColor = cat.color || categoryColors[cat.name];

        if (!assignedColor) {
          assignedColor =
            CHART_COLOR_PALETTE[colorIndex % CHART_COLOR_PALETTE.length];
          colorIndex++;
        }
        return {
          ...cat,
          sum: Math.abs(cat.total) || 0,
          color: assignedColor,
        };
      });

    expenseCategories.sort((a, b) => b.sum - a.sum);

    return {
      totalExpenses,
      totalIncome,
      expenseCategories,
    };
  }, [summary]);

  if (isLoading) {
    return <p className="statistics-loading">Loading statistics...</p>;
  }

  const hasExpenseData =
    processedData.totalExpenses > 0 ||
    processedData.expenseCategories.length > 0;

  if (isError) {
    return (
      <p className="statistics-error">
        Failed to load statistics data.
      </p>
    );
  }

  return (
    <div className="dashboard-card statistics-view-main">
      <h2 className="statistics-title">Statistics</h2>
      <div className="chart-area">
        <DoughnutChart
          data={processedData.expenseCategories}
          total={processedData.totalExpenses}
        />
        <div className="chart-center-balance">
          ₴ {formatCurrency(processedData.totalExpenses)}
        </div>
      </div>
      <div className="selectors-group">
        <Select
          options={MONTH_OPTIONS}
          value={selectedMonth}
          onChange={setSelectedMonth}
          styles={customSelectStyles}
          classNamePrefix="stats-select"
          maxMenuHeight={200}
        />
        <Select
          options={YEAR_OPTIONS}
          value={selectedYear}
          onChange={setSelectedYear}
          styles={customSelectStyles}
          classNamePrefix="stats-select"
          maxMenuHeight={200}
        />
      </div>

      {!hasExpenseData && (
        <p className="no-data-message">
          No expense transactions found for the selected period ({selectedMonth.label} {selectedYear.value}).
        </p>
      )}

      <div className="stats-content-wrapper">
        {hasExpenseData && (
          <>
            <div className="category-list-header">
              <span className="category-list-title">Category</span>
              <span className="category-list-sum">Sum</span>
            </div>
            <div className="category-list-body">
              {processedData.expenseCategories.map((category) => (
                <div key={category.name} className="category-item">
                  <div className="category-name">
                    <span
                      className="color-indicator"
                      style={{ backgroundColor: category.color }}
                    ></span>
                    {category.name}
                  </div>
                  <span className="category-sum">
                    {formatCurrency(category.sum)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="totals-summary">
          <p className="expenses-total">
            Expenses:
            <span className="expense-value expense-text">
              {formatCurrency(processedData.totalExpenses)}
            </span>
          </p>
          <p className="income-total">
            Income:
            <span className="income-value income-text">
              {formatCurrency(processedData.totalIncome)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;