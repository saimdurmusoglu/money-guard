// src/utils/formatUtils.js
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};