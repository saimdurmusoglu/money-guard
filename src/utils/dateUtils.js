// src/utils/dateUtils.js
const MONTH_NAMES = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export const getMonthsOptions = () => MONTH_NAMES;

export const getCurrentMonth = () => {
  const currentMonthIndex = new Date().getMonth();
  return MONTH_NAMES[currentMonthIndex];
};

export const getYearsOptions = (startYear) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push({ value: year, label: String(year) });
  }
  return years;
};

export const formatDate = (isoDateString) => {
  if (!isoDateString) return '';

  try {
    const date = new Date(isoDateString);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const fullYear = date.getFullYear();
    const shortYear = String(fullYear).slice(-2);

    return `${month}/${day}/${shortYear}`;

  } catch (error) {
    console.error('formatDate error:', error, isoDateString);
    return '??/??/??';
  }
};