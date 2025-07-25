import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
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

const AllTimePaymentsChart = () => (
  <div className="bg-white rounded-lg shadow p-4 w-full">
    <h2 className="text-lg font-semibold mb-2 text-[#181829]">
      All Time Payments
    </h2>
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
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
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AllTimePaymentsChart;
