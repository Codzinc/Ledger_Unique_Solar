import React, { useState, useEffect } from "react";
import {
  FaDollarSign,
  FaChartLine,
  FaWallet,
  FaProjectDiagram,
  FaBox,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";
import { SiExpensify } from "react-icons/si";
import { getDashboardData } from "../../../ApiComps/Dasbhoard/dashboardDataService";
import { getDashboardSummary } from "../../../ApiComps/Dasbhoard/dashboardSummaryService";

const iconMap = {
  "Total Projects": <FaProjectDiagram className="text-[#d8f276] text-[22px]" />,
  "Total Products": <FaBox className="text-[#d8f276] text-[22px]" />,
  "Total Profit": <FaDollarSign className="text-[#d8f276] text-[22px]" />,
  "This Month Profit": <FaWallet className="text-[#d8f276] text-[22px]" />,
  "Total Expenses": <SiExpensify className="text-[#d8f276] text-[22px]" />,
  "Total Salaries": <FaMoneyBillWave className="text-[#d8f276] text-[22px]" />,
  "Pending Projects": <FaClock className="text-[#d8f276] text-[22px]" />,
};

const MiniCard = ({ title, className = "" }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const [summaryResponse, dashboardResponse] = await Promise.all([
          getDashboardSummary(currentYear),
          getDashboardData(currentYear),
        ]);

        setSummaryData(summaryResponse.summary);
        setChartData(dashboardResponse.summary);
      } catch (err) {
        setError("Data fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCardValue = () => {
    if (!summaryData || !chartData) return 0;

    switch (title) {
      case "Total Projects":
        return summaryData.total_projects || 0;
      case "Total Products":
        return summaryData.total_products || 0;
      case "Total Profit":
        return chartData.total_profit || 0;
      case "This Month Profit":
        return chartData.current_month_profit || 0;
      case "Total Expenses":
        return summaryData.total_expenses || 0;
      case "Total Salaries":
        return summaryData.total_salaries || 0;
      case "Pending Projects":
        return summaryData.pending_projects || 0;
      default:
        return 0;
    }
  };

  const formatValue = (value) => {
    if (typeof value !== "number") return "0";
    if (
      [
        "Total Profit",
        "This Month Profit",
        "Total Expenses",
        "Total Salaries",
      ].includes(title)
    ) {
      return `${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    return value.toLocaleString("en-US");
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-2xl shadow-md px-6 py-4 flex items-center justify-center h-[140px] ${className}`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#d8f276] mx-auto mb-2"></div>
          <span className="text-xs text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-white rounded-2xl shadow-md px-6 py-4 flex items-center justify-center h-[140px] ${className}`}
      >
        <div className="text-center">
          <span className="text-red-500 text-xs">{error}</span>
        </div>
      </div>
    );
  }

  const value = getCardValue();
  const formattedValue = formatValue(value);

  return (
    <div
      className={`bg-white rounded-2xl shadow-md px-4 py-4 flex flex-col justify-center items-center max-w-[140px] h-[140px] ${className}`}
    >
      <div className="mb-2">{iconMap[title]}</div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 text-center leading-tight">
        {title}
      </h3>
      <div className="text-xl font-bold text-[#181829] text-center">
        {formattedValue}
      </div>
    </div>
  );
};

export default MiniCard;
