// apps/web/components/VendorSpendChart.tsx
"use client";

import React, { useEffect, useState } from "react";
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
import { apiGet } from "@/lib/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function VendorSpendChart({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiGet("/vendors/top10");

        setLabels(data.map((item: any) => item.vendorName));
        setValues(data.map((item: any) => item.totalSpend));
      } catch (error) {
        console.error("Vendor spend fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const chartData = {
    labels,
    datasets: [
      {
        label: "Spend (€)",
        data: values,
        backgroundColor: labels.map(() => "rgba(189,188,214,0.9)"), // same for all
        hoverBackgroundColor: labels.map(() => "rgba(27, 20, 100, 1)"),
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
        ticks: {
          color: "#334155",
          font: { size: 13 },
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className=" flex flex-col h-full">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">Spend by Vendor (Top 10)</h3>
          <div className="text-sm text-gray-500">
            Vendor spend with cumulative percentage distribution.
          </div>
        </div>
      </div>

      <div className="mt-3 h-[260px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
