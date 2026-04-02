import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function ChartComponent({ data, optimal }) {
  const labels = data.map(d => `${d.stock} ${d.type} ${d.strike}`);
  const values = data.map(d => d.annualised);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Annualised Yield (%)",
            data: values,
            backgroundColor: data.map(d =>
              optimal && d.strike === optimal.strike && d.type === optimal.type
                ? "#ff7f0e"
                : "#1f77b4"
            )
          }
        ]
      }}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  );
}

export default ChartComponent;
