import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const atpData = [
  { name: "Jan", payment: 4000 },
  { name: "Feb", payment: 3000 },
  { name: "Mar", payment: 5000 },
  { name: "Apr", payment: 3500 },
  { name: "May", payment: 6000 },
  { name: "Jun", payment: 4500 },
  { name: "Jul", payment: 7000 },
  { name: "Aug", payment: 6500 },
  { name: "Sep", payment: 8000 },
  { name: "Oct", payment: 7500 },
  { name: "Nov", payment: 9000 },
  { name: "Dec", payment: 8500 },
];

const mpData = [
  { name: "1 Jul", payment: 500 },
  { name: "2 Jul", payment: 700 },
  { name: "3 Jul", payment: 1200 },
  { name: "4 Jul", payment: 900 },
  { name: "5 Jul", payment: 1400 },
  { name: "6 Jul", payment: 1000 },
  { name: "7 Jul", payment: 1600 },
];

const Zarorrat = () => {
  const [mode, setMode] = useState("ATP");
  const handleToggle = () => setMode((prev) => (prev === "ATP" ? "MP" : "ATP"));

  const chartData = mode === "ATP" ? atpData : mpData;
  const chartLabel = mode === "ATP" ? "All Time Payments" : "Monthly Payments";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-[#181829]">Zarorrat.com</h2>
        <button
          onClick={handleToggle}
          className="bg-[#d8f276] hover:bg-[#e6fa9c] text-[#181829] font-medium px-4 py-2 rounded-full transition"
        >
          {mode === "ATP" ? "Switch to MP" : "Switch to ATP"}
        </button>
      </div>

      <div className="w-full h-[176px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="payment"
              stroke="#d8f276"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-gray-500 text-right mt-2">{chartLabel}</p>
    </div>
  );
};

export default Zarorrat;
