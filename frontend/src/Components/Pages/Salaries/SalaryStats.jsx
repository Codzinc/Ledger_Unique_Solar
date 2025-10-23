import React from "react";
import { Users, DollarSign, Clock, Calendar } from "lucide-react";

// ✅ Helper function: har salary ka total amount nikalta hai
const getTotalPaid = (salary) => {
  if (!salary) return 0;

  const type = (salary.wageType || salary.wage_type || "").toLowerCase();

  // Daily wage → sum of wages array
  if (type === "daily" && Array.isArray(salary.wages)) {
    return salary.wages.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
  }

  // Monthly wage → direct salary_amount ya salary
  if (type === "monthly") {
    return Number(salary.salary_amount) || Number(salary.salary) || 0;
  }

  return 0;
};

// ✅ StatCard component (single box)
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4">
    <div className="p-3 rounded-lg bg-[#d8f276]">
      <Icon className="w-6 h-6 text-[#181829]" />
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">
        {title.includes("Amount") ? `Rs. ${value.toLocaleString()}` : value}
      </p>
    </div>
  </div>
);

// ✅ Main SalaryStats component
const SalaryStats = ({ salaries = [] }) => {
  // Defensive check
  if (!Array.isArray(salaries)) salaries = [];

  // Stats calculation
  const totalEmployees = salaries.length;

  const totalSalaries = salaries.reduce(
    (sum, sal) => sum + getTotalPaid(sal),
    0
  );

  const monthlyWageEmployees = salaries.filter(
    (s) => (s.wageType || s.wage_type || "").toLowerCase() === "monthly"
  ).length;

  const dailyWageEmployees = salaries.filter(
    (s) => (s.wageType || s.wage_type || "").toLowerCase() === "daily"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard title="Total Employees" value={totalEmployees} icon={Users} />
      <StatCard title="Total Amount" value={totalSalaries} icon={DollarSign} />
      <StatCard
        title="Monthly Wage Employees"
        value={monthlyWageEmployees}
        icon={Calendar}
      />
      <StatCard
        title="Daily Wage Employees"
        value={dailyWageEmployees}
        icon={Clock}
      />
    </div>
  );
};

export default SalaryStats;
