import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getDashboardData } from "../../../ApiComps/Dasbhoard/dashboardDataService";

const AllTimePaymentsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const response = await getDashboardData(currentYear);
        setData(
          response.chart_data.map((item) => ({
            name: item.month,
            payment: item.total_profit,
          }))
        );
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="bg-white rounded-lg shadow p-4 w-full">Loading...</div>
    );
  if (error)
    return <div className="bg-white rounded-lg shadow p-4 w-full">{error}</div>;

  return (
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
};

export default AllTimePaymentsChart;
