import React from 'react';
import MiniCard from './MiniCard';
import AllTimePaymentsChart from './AllTimePaymentsChart';
import MonthlyPaymentsChart from './MonthlyPaymentsChart';
import Zarorrat from './Zarorrat';

const Dashboard = () => {
   const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', // e.g., Monday
    day: '2-digit',  // e.g., 07
    month: 'short',  // e.g., Jul
    year: 'numeric', // e.g., 2025
  });

  return (
    <div className="bg-[#f6f7fb] min-h-screen py-4 px-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#181829]">Welcome back Mr Sajjid</h1>
      <p className="text-gray-500 text-sm mb-6">{today}</p>
       <div className="space-y-6">
  {/* Charts Row */}
  <div className="flex flex-col lg:flex-row gap-6">
    <div className="flex-1"><AllTimePaymentsChart /></div>
    <div className="flex-1"><Zarorrat /></div>
  </div>

  {/* Payments and Mini Cards */}
  <div className="flex flex-col lg:flex-row gap-6">
  {/* Left Side - Chart */}
  <div className="w-full lg:w-1/2">
    <MonthlyPaymentsChart />
  </div>

  {/* Right Side - Mini Cards */}
  <div className="w-full lg:w-1/2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 gap-3">
    <MiniCard title="Sales" amount="$5,200" label="This Month" />
    <MiniCard title="Profit" amount="$2,100" label="This Month" />
    <MiniCard title="Today Received" amount="$2,100" />
    <MiniCard title="Expense" amount="$2,100" />
  </div>
</div>
</div>

      </div>
    </div>
  );
};

export default Dashboard;