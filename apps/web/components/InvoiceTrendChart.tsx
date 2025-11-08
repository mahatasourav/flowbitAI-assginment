// apps/web/components/InvoiceAndSpendCharts.tsx
"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const lineData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Invoice Count",
      data: [12, 18, 10, 15, 20, 25, 22, 30, 28, 35, 40, 47],
      borderColor: "#1B1464",
      backgroundColor: "rgba(37,99,235,0)",
      tension: 0.4,
      pointRadius: 0, // ✅ removes dots
      pointHoverRadius: 0, // ✅ removes hover dots
      yAxisID: "y1",
    },
    {
      label: "Spend (€)",
      data: [
        1200, 1800, 900, 1500, 2200, 3300, 3000, 4200, 3800, 5600, 7200, 8679,
      ],
      borderColor: "#1B146442",
      backgroundColor: "rgba(5,150,105,0)",
      borderDash: [4, 0],
      tension: 0.4,
      pointRadius: 0, // ✅ removes dots
      pointHoverRadius: 0, // ✅ removes hover dots
      yAxisID: "y2",
    },
  ],
};

const lineOptions = {
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  scales: {
    y1: {
      type: "linear",
      position: "left",
      title: { display: true, text: "Invoices" },
    },
    y2: {
      type: "linear",
      position: "right",
      title: { display: true, text: "Spend (€)" },
      grid: { drawOnChartArea: false },
    },
  },
};

export default function InvoiceTrendCharts() {
  return (
    <section>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-medium mb-2">Invoice Volume + Value Trend</h2>
        <div className="text-sm text-gray-500 mb-3">
          Invoice count and total spend over 12 months.
        </div>
        {/* placeholder chart area */}
        <div className="h-56">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </section>
  );
}
