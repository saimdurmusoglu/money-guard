// src/components/dashboard/DoughnutChart.jsx
import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './DoughnutChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ data, total }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'], 
        datasets: [
          {
            data: [1],
            backgroundColor: ['#CCCCCC'],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      };
    }

    const labels = data.map((item) => item.name);
    const sums = data.map((item) => item.sum);
    const colors = data.map((item) => item.color);

    return {
      labels: labels,
      datasets: [
        {
          data: sums,
          backgroundColor: colors,
          borderWidth: 0,
          cutout: '70%',
          hoverOffset: 4,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            const sum = context.parsed;
            const percentage = ((sum / total) * 100).toFixed(2);

            return `${label}${sum.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="doughnut-chart-wrapper">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;