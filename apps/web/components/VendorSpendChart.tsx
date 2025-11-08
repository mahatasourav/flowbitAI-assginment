// apps/web/components/VendorSpendChart.tsx
"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const labels = [
  "Phunix GmbH",
  "AcmeCorp",
  "DeltaServices",
  "PrimeVendors",
  "Global Supply",
  "OmegaLtd",
  "Test Solutions",
  "Other",
];

const rawValues = [15000, 12000, 9800, 7600, 5400, 3800, 2200, 1200]; // mock values

const data = {
  labels,
  datasets: [
    {
      label: "Spend (€)",
      data: rawValues,
      backgroundColor: labels.map((_, i) =>
        // subtle color ramp
        i === 0 ? "rgba(189,188,214,0.9)" : "rgba(189,188,214,0.9)"
      ),
      hoverBackgroundColor: labels.map(
        (_, i) => "rgba(27, 20, 100, 1)" // ALL bars on hover become this color
      ),
      borderRadius: 0,
      maxBarThickness: 28,
    },
  ],
};

const options = {
  indexAxis: "y" as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const v = context.parsed.x ?? context.parsed;
          return `€ ${Number(v).toLocaleString()}`;
        },
      },
      bodyFont: { size: 12 },
      titleFont: { size: 12 },
      padding: 8,
    },
  },
  scales: {
    x: {
      ticks: {
        callback: function (val: any) {
          const n = Number(val);
          if (Math.abs(n) >= 1000) return `€ ${n / 1000}k`;
          return `€ ${n}`;
        },
        color: "#475569",
        font: { size: 12 },
      },
      grid: { display: false },
    },
    y: {
      ticks: { color: "#334155", font: { size: 13 } },
      grid: { display: false },
    },
  },
};

export default function VendorSpendChart({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className={`bg-white p-4 rounded shadow `}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">Spend by Vendor (Top 10)</h3>
          <div className="text-sm text-gray-500">
            Vendor spend with cumulative percentage distribution.
          </div>
        </div>
      </div>

      <div className="mt-3 h-[220px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
