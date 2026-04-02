import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function ChartComponent({ data, optimal }) {
  // Group data by stock and duration
  const stocks = [...new Set(data.map(d => d.stock))];
  const durations = [...new Set(data.map(d => d.days))];

  const labels = stocks;

  const datasets = durations.map((days, idx) => ({
    label: `${days} days`,
    data: stocks.map(stock => {
      const subset = data.filter(d => d.stock === stock && d.days === days);
      if (subset.length === 0) return 0;
      // average annualised yield for this stock+duration
      return subset.reduce((sum, d) => sum + d.annualised, 0) / subset.length;
    }),
    backgroundColor: idx % 2 === 0 ? "#1f77b4" : "#ff7f0e"
  }));

  return (
    <Bar
      data={{
        labels,
        datasets
      }}
      options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Annualised Yield Comparison by Duration"
          }
        }
      }}
    />
  );
}

export default ChartComponent;
