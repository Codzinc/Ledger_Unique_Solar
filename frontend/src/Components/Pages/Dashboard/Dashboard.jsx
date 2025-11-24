import React from "react";
import MiniCard from "./MiniCard";
import AllTimePaymentsChart from "./AllTimePaymentsChart";
import MonthlyPaymentsChart from "./MonthlyPaymentsChart";
import Zarorrat from "./Zarorrat";
import { useAuth } from "../../Common/Auth/AuthProvider";

const Dashboard = () => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-[#f6f7fb] min-h-screen py-4 px-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#181829]">
            Welcome back Mr {user?.username || ""}
          </h1>
          <p className="text-gray-500 text-sm">{today}</p>
        </div>

        <div className="space-y-6">
          {/* Top Charts Row */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <AllTimePaymentsChart />
            </div>
            <div className="flex-1">
              <Zarorrat />
            </div>
          </div>

          {/* Bottom Section - Chart + MiniCards */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Monthly Payments Chart */}
            <div className="w-full lg:w-1/2">
              <MonthlyPaymentsChart />
            </div>

            {/* Mini Cards Grid */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <MiniCard title="Total Projects" />
                <MiniCard title="Total Products" />
                <MiniCard title="Total Profit" />
                <MiniCard title="This Month Profit" />
                <MiniCard title="Total Expenses" />
                <MiniCard title="Total Salaries" />
                <MiniCard title="Pending Projects" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
