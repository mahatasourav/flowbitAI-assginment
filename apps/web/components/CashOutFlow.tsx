"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { apiGet } from "@/lib/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CashOutFlow() {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCashOutflow() {
      try {
        const data = await apiGet("/cash-outflow");

        // ✅ dynamic: uses backend's keys
        setLabels(data.map((d: any) => d.range));
        setValues(data.map((d: any) => d.value));
      } catch (err) {
        console.error("Cash outflow fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCashOutflow();
  }, []);

  if (loading) return <p>Loading...</p>;

  const maxVal = Math.max(...values, 1) * 1.15;

  const chartData = {
    labels,
    datasets: [
      {
        label: "bucket-max",
        data: labels.map(() => Math.round(maxVal)),
        backgroundColor: "rgba(15, 23, 42, 0.06)",
        barPercentage: 0.9,
        categoryPercentage: 1.0,
        maxBarThickness: 80,
      },
      {
        label: "outflow",
        data: values,
        backgroundColor: "#1e1b5f",
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
          label: (ctx: any) => `€ ${ctx.parsed.y.toLocaleString()}`,
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
          callback: (val: any) =>
            Math.abs(val) >= 1000 ? `€ ${val / 1000}k` : `€ ${val}`,
          color: "#475569",
          font: { size: 12 },
        },
        grid: { color: "rgba(15,23,42,0.04)" },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium">Cash Outflow Forecast</h3>
      <p className="text-sm text-gray-500 mb-3">
        Expected payment obligations grouped by due date ranges.
      </p>

      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
