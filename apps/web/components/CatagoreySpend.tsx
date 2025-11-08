"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Image from "next/image";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Operations", "Marketing", "Facilities"],
  datasets: [
    {
      data: [1000, 7250, 1000],
      backgroundColor: ["#1E40FF", "#F6A05B", "#F9D8A9"], // blue, dark peach, light peach
      borderWidth: 0,
      hoverOffset: 5,
    },
  ],
};

const options = {
  cutout: "70%", // thickness like the Figma chart
  plugins: {
    legend: { display: false },
  },
};

export default function CategorySpend() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Title */}
      <h2 className="font-medium">Spend by Category</h2>
      <p className="text-sm text-gray-500 mb-4">
        Distribution of spending across different categories.
      </p>

      {/* Chart */}
      <div className="w-[260px] mx-auto">
        <Doughnut data={data} options={options} />
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-3">
        {/* Operations */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#1E40FF]"></span>
            <span className="text-sm text-gray-600">Operations</span>
          </div>
          <span className="text-sm font-medium">$1,000</span>
        </div>

        {/* Marketing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F6A05B]"></span>
            <span className="text-sm text-gray-600">Marketing</span>
          </div>
          <span className="text-sm font-medium">$7,250</span>
        </div>

        {/* Facilities */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F9D8A9]"></span>
            <span className="text-sm text-gray-600">Facilities</span>
          </div>
          <span className="text-sm font-medium">$1,000</span>
        </div>
      </div>
    </div>
  );
}
