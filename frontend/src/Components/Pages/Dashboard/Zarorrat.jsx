import React, { useState, useEffect } from "react";
import { getZarorratData } from "../../../ApiComps/Dasbhoard/zarorratService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Zarorrat = () => {
  const [mode, setMode] = useState("ATP");
  const [data, setData] = useState({ monthly_data: [], daily_data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const date = new Date();
        const response = await getZarorratData(
          date.getFullYear(),
          date.getMonth() + 1
        );

        const monthlyData = response.monthly_data.map((item) => ({
          name: item.month_name,
          payment: item.profit,
        }));

        const dailyData = response.daily_data.map((item) => ({
          name: `${item.day} ${response.month_name}`,
          payment: item.profit,
        }));

        setData({ monthly_data: monthlyData, daily_data: dailyData });
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = () => setMode((prev) => (prev === "ATP" ? "MP" : "ATP"));
  const chartData = mode === "ATP" ? data.monthly_data : data.daily_data;
  const chartLabel = mode === "ATP" ? "All Time Payments" : "Monthly Payments";

  if (loading)
    return (
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto">
        {error}
      </div>
    );

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
