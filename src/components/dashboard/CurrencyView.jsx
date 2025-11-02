// src/components/dashboard/CurrencyView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useGetCurrencyRatesQuery } from '../../store/api/transactionsApi';
import CurrencyAreaChart from './CurrencyAreaChart';

import './CurrencyView.css';

const USD_CODE = 840;
const EUR_CODE = 978;

const MOCK_RATES = [
  { ccy: 'USD', buy: 27.55, sale: 27.65 },
  { ccy: 'EUR', buy: 30.0, sale: 30.1 },
];

const CurrencyView = () => {
  const { data: rates, isLoading, isError } = useGetCurrencyRatesQuery();

  const displayRates = useMemo(() => {
    if (!rates || !Array.isArray(rates) || rates.length === 0) {
      return MOCK_RATES;
    }

    const parsedRates = [];
    const usdRate = rates.find((rate) => rate.currencyCodeA === USD_CODE);
    const eurRate = rates.find((rate) => rate.currencyCodeA === EUR_CODE);
    if (usdRate) {
      parsedRates.push({
        ccy: 'USD',
        buy: usdRate.rateBuy,
        sale: usdRate.rateSell,
      });
    }
    if (eurRate) {
      parsedRates.push({
        ccy: 'EUR',
        buy: eurRate.rateBuy,
        sale: eurRate.rateSell,
      });
    }
    return parsedRates.length > 0 ? parsedRates : MOCK_RATES;
  }, [rates]);

  const currentBaseRate = useMemo(() => {
    const eurRate = displayRates.find((rate) => rate.ccy === 'EUR');
    return eurRate && Number(eurRate.sale) > 0 ? Number(eurRate.sale) : 30.0;
  }, [displayRates]);

  if (isLoading) {
    return (
      <div className="currency-view-container">
        <p className="currency-loading">Loading exchange rates...</p>
      </div>
    );
  }

  if (isError && displayRates.length === 0) {
    return (
      <div className="currency-view-container">
        <p className="currency-error">Failed to load exchange rates.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card currency-view-container">
      <div className="currency-table-wrapper">
        <table className="currency-table">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Purchase</th>
              <th>Sale</th>
            </tr>
          </thead>
          <tbody>
            {displayRates.map((rate) => (
              <tr key={rate.ccy}>
                <td data-label="Currency">{rate.ccy}</td>
                <td data-label="Purchase">{Number(rate.buy).toFixed(2)}</td>
                <td data-label="Sale">{Number(rate.sale).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="currency-chart-area">
        <CurrencyAreaChart liveBaseRate={currentBaseRate} />
      </div>
    </div>
  );
};

export default CurrencyView;