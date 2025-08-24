import React, { useState, useEffect } from "react";
import { FaDollarSign, FaChartLine, FaWallet } from "react-icons/fa";
import { SiExpensify } from "react-icons/si";

import { getFinancialData } from "../../../ApiComps/Dasbhoard/financialService";

const iconMap = {
  Sales: <FaChartLine className="text-[#d8f276] text-[22px]" />,
  Profit: <FaDollarSign className="text-[#d8f276] text-[22px]" />,
  "Today Received": <FaWallet className="text-[#d8f276] text-[22px]" />,
  Expense: <SiExpensify className="text-[#d8f276] text-[22px]" />,
};

const dataKeyMap = {
  Sales: "total_sales",
  Profit: "total_profit",
  "Today Received": "total_revenue",
  Expense: "total_expenses",
};

const MiniCard = ({ title, className = "" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFinancialData();
        setData(response.data);
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
      <div
        className={`bg-white rounded-2xl shadow-md px-6 py-4 flex items-center justify-center h-[140px] ${className}`}
      >
        Loading...
      </div>
    );
  if (error)
    return (
      <div
        className={`bg-white rounded-2xl shadow-md px-6 py-4 flex items-center justify-center h-[140px] ${className}`}
      >
        {error}
      </div>
    );

  const amount = data[dataKeyMap[title]] || 0;

  return (
    <div
      className={`bg-white rounded-2xl shadow-md px-6 py-4 lg:px-3 lg:py-1 flex flex-col justify-center items-center max-w-[140px] lg:max-w-[110px] h-[140px] ${className}`}
    >
      <div className="mb-2 lg:mb-1">
        <span className="block lg:hidden">{iconMap[title]}</span>
        <span className="hidden lg:block text-[18px]">{iconMap[title]}</span>
      </div>
      <h3 className="text-sm lg:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 whitespace-nowrap">
        {title}
      </h3>
      <div className="text-3xl lg:text-xl font-bold text-[#181829] mb-1">
        {amount}
      </div>
    </div>
  );
};

export default MiniCard;
