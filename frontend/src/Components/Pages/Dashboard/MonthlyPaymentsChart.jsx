import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getDailyDashboardData } from "../../../ApiComps/Dasbhoard/dashboardDailyService";

const MonthlyPaymentsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const response = await getDailyDashboardData(month, year);

        const formattedData = response.data.map((item) => ({
          date: `${item.day} ${new Date(year, month - 1).toLocaleString(
            "default",
            { month: "short" }
          )}`,
          payment: item.profit,
        }));

        setData(formattedData);
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
      <h2 className="text-lg font-semibold text-[#181829] mb-2">
        Monthly Payments (Daily Sales)
      </h2>
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="payment" fill="#d8f276" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyPaymentsChart;
