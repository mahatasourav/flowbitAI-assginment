"use client";

import { useEffect, useState } from "react";
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
import { Line } from "react-chartjs-2";
import { apiGet } from "@/lib/api";
import type { ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function InvoiceTrendCharts() {
  const [labels, setLabels] = useState<string[]>([]); // short (Aug)
  const [fullLabels, setFullLabels] = useState<string[]>([]); // full (Aug 2025)
  const [invoiceCounts, setInvoiceCounts] = useState<number[]>([]);
  const [spends, setSpends] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiGet("/invoice-trend");

        const monthNames = [
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
        ];

        // short labels for X-axis
        setLabels(
          data.map((d: any) => {
            const [year, month] = d.month.split("-");
            return monthNames[Number(month) - 1];
          })
        );

        // full labels for tooltip
        setFullLabels(
          data.map((d: any) => {
            const [year, month] = d.month.split("-");
            return `${monthNames[Number(month) - 1]} ${year}`;
          })
        );

        setInvoiceCounts(data.map((d: any) => d.invoiceCount));
        setSpends(data.map((d: any) => d.totalSpend));
      } catch (e) {
        console.error("Failed loading invoice trend:", e);
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
        label: "Invoice Count",
        data: invoiceCounts,
        borderColor: "#1B1464",
        backgroundColor: "rgba(37,99,235,0)",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        yAxisID: "y1",
      },
      {
        label: "Spend (€)",
        data: spends,
        borderColor: "#1B146442",
        backgroundColor: "rgba(5,150,105,0)",
        borderDash: [4, 0],
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        yAxisID: "y2",
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    interaction: { mode: "index", intersect: false },

    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            return fullLabels[index]; // ✅ Show "Aug 2025"
          },
          label: (ctx) => {
            if (ctx.dataset.label === "Invoice Count") {
              return `Invoices: ${ctx.parsed.y}`;
            }
            if (ctx.dataset.label === "Spend (€)") {
              return `Spend: € ${ctx.parsed.y.toLocaleString()}`;
            }
            return "";
          },
        },
      },
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

  return (
    <section>
      <div className=" h-full flex flex-col">
        <h2 className="font-medium mb-2">Invoice Volume + Value Trend</h2>
        <div className="text-sm text-gray-500 mb-3">
          Invoice count and total spend over time.
        </div>

        <div className="h-56">
          <Line data={chartData} options={lineOptions} />
        </div>
      </div>
    </section>
  );
}
