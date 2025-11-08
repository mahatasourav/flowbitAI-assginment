// apps/web/components/CashOutflowForecast.tsx
"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CashOutFlow({
  dataOverride,
}: {
  // optional override for real API data: { labels: string[], values: number[] }
  dataOverride?: { labels: string[]; values: number[] };
}) {
  // default/mock values (in euros)
  const labels = dataOverride?.labels ?? [
    "0 - 7 days",
    "8 - 30 days",
    "31 - 60 days",
    "60+ days",
  ];

  const values = dataOverride?.values ?? [45000, 28000, 7000, 60000];

  // pick a max for the background columns (slightly above max value)
  const maxVal = Math.max(...values) * 1.15;
  const data = {
    labels,
    datasets: [
      // background column (light)
      {
        label: "bucket-max",
        data: labels.map(() => Math.round(maxVal)),
        backgroundColor: "rgba(15, 23, 42, 0.06)", // very light column
        barPercentage: 0.9,
        categoryPercentage: 1.0,
        // make background bars thin by using large barThickness + lower zIndex (drawn first)
        maxBarThickness: 80,
      },
      // actual outflow (dark)
      {
        label: "outflow",
        data: values,
        backgroundColor: "#1e1b5f", // dark primary color
        barPercentage: 0.6,
        categoryPercentage: 1.0,
        maxBarThickness: 60,
      },
    ],
  };

  const options = {
    indexAxis: "x" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const v = ctx.parsed.y ?? ctx.parsed;
            return `€ ${Number(v).toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#334155", font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (val: any) {
            const n = Number(val);
            if (Math.abs(n) >= 1000) return `€ ${n / 1000}k`;
            return `€ ${n}`;
          },
          color: "#475569",
          font: { size: 12 },
        },
        grid: { color: "rgba(15,23,42,0.04)" },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow ">
      <h3 className="text-lg font-medium">Cash Outflow Forecast</h3>

      <p className="text-sm text-gray-500 mb-3">
        Expected payment obligations grouped by due date ranges.
      </p>

      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
