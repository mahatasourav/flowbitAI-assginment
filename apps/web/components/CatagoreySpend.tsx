"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { apiGet } from "@/lib/api";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategorySpend() {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Generate unique colors for any number of categories
  function generateColors(n: number) {
    return Array.from({ length: n }, (_, i) => {
      const hue = (i * 45) % 360;
      return `hsl(${hue}, 70%, 55%)`;
    });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiGet("/category-spend");

        setLabels(
          data.map((d: any) =>
            d.category === "null" || d.category === null
              ? "Uncategorized"
              : d.category
          )
        );

        setValues(data.map((d: any) => d.totalSpend));
      } catch (err) {
        console.error("Category spend fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const dynamicColors = generateColors(labels.length);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: dynamicColors,
        borderWidth: 0,
        hoverOffset: 5,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: { legend: { display: false } },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-medium">Spend by Category</h2>
      <p className="text-sm text-gray-500 mb-4">
        Distribution of spending across different categories.
      </p>

      {/* Chart */}
      <div className="w-[260px] mx-auto">
        <Doughnut data={chartData} options={options} />
      </div>

      {/* Dynamic Legend */}
      <div className="mt-4 space-y-3">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dynamicColors[i] }}
              />
              <span className="text-sm text-gray-600">{label}</span>
            </div>

            <span className="text-sm font-medium">
              ${Number(values[i] ?? 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
