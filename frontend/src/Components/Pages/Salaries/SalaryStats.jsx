import React from "react";
import { Users, DollarSign, Clock, Calendar } from "lucide-react";

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4">
    <div className="p-3 rounded-lg bg-[#d8f276]">
      <Icon className="w-6 h-6 text-[#181829]" />
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">
        {title.includes("Total Salaries")
          ? `$${value.toLocaleString()}`
          : value}
      </p>
    </div>
  </div>
);

const SalaryStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Total Employees"
        value={stats.totalEmployees}
        icon={Users}
      />
      <StatCard
        title="Total Amount"
        value={stats.totalSalaries}
        icon={DollarSign}
      />
      <StatCard
        title="Monthly Wage Employees"
        value={stats.monthlyWageEmployees}
        icon={Calendar}
      />
      <StatCard
        title="Daily Wage Employees"
        value={stats.dailyWageEmployees}
        icon={Clock}
      />
    </div>
  );
};

export default SalaryStats;
