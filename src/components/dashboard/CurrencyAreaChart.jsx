// src/components/dashboard/CurrencyAreaChart.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

const generateDailyMockData = (liveBaseRate, days = 30) => {
  const data = [];
  const now = new Date();
  const fluctuation = 0.01;

  if (!liveBaseRate || liveBaseRate <= 0) return [];

  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    
    const label = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const rate =
      liveBaseRate +
      Math.sin(i * 0.4) * (fluctuation * 0.7) +
      ((i % 5) * 0.0001);

    data.unshift({
      label: label,
      rate: parseFloat(rate.toFixed(4)),
    });
  }
  return data;
};

const CurrencyAreaChart = ({ liveBaseRate }) => {
  const [themeColors, setThemeColors] = useState({
    lineColor: '#FFFFFF',
    pointBorderColor: '#FFFFFF',
  });

  useEffect(() => {
    try {
      const rootStyles = getComputedStyle(document.documentElement);
      const dashboardTextColor = rootStyles
        .getPropertyValue('--color-dashboard-text')
        .trim();
      if (dashboardTextColor) {
        setThemeColors((prev) => ({
          ...prev,
          lineColor: dashboardTextColor,
          pointBorderColor: dashboardTextColor,
        }));
      }
    } catch (e) {
    }
  }, []);

  const historicalRates = useMemo(() => {
    const rates = generateDailyMockData(liveBaseRate || 30.0, 30);
    return rates;
  }, [liveBaseRate]);

  if (!historicalRates || historicalRates.length === 0) {
    return (
      <div className="currency-chart-inner-wrapper">
        <p
          style={{
            textAlign: 'center',
            color: 'gray',
            padding: '10px',
          }}
        >
          Awaiting data...
        </p>
      </div>
    );
  }

  const ratesOnly = historicalRates.map((item) => item.rate);
  const minRate = Math.min(...ratesOnly);
  const maxRate = Math.max(...ratesOnly);

  const yMin = minRate - 0.005;
  const yMax = maxRate + 0.005;

  const pointRadii = useMemo(() => {
    const radii = ratesOnly.map((rate, i) => {
      const prev = ratesOnly[i - 1];
      const next = ratesOnly[i + 1];

      if (i === 0 || i === ratesOnly.length - 1) return 4;
      const isPeak = rate > prev && rate > next;

      return isPeak ? 4 : 0;
    });
    return radii;
  }, [ratesOnly]);

  const data = {
    labels: historicalRates.map((item) => item.label),
    datasets: [
      {
        label: 'Area Fill',
        data: ratesOnly.map((rate) => rate - (yMax - yMin) * 0.05),
        fill: true,
        borderColor: 'transparent',
        borderWidth: 0,
        pointRadius: 0,
        order: 2,

        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );

          gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
          gradient.addColorStop(0.37, 'rgba(255, 255, 255, 0.54)');
          gradient.addColorStop(0.61, 'rgba(255, 255, 255, 0.27)');
          gradient.addColorStop(0.77, 'rgba(255, 255, 255, 0.15)');
          gradient.addColorStop(1, 'rgba(57, 0, 150, 0.2)');

          return gradient;
        },
      },
      {
        label: 'Trend Line',
        data: ratesOnly,
        fill: false,

        borderColor: themeColors.lineColor,
        borderWidth: 2,
        tension: 0.4,

        pointRadius: pointRadii,
        pointBackgroundColor: '#563EAF',
        pointBorderColor: themeColors.pointBorderColor,
        pointBorderWidth: 1.5,
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { display: false, grid: { display: false } },
      y: {
        display: false,
        grid: { display: false },
        beginAtZero: false,
        min: yMin,
        max: yMax,
      },
    },
    layout: {
      padding: { top: 6, bottom: 0, left: 0, right: 0 },
    },
  };

  return (
    <div className="currency-chart-inner-wrapper">
      <Line data={data} options={options} />
    </div>
  );
};

export default CurrencyAreaChart;