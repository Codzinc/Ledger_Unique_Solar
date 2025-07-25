import { FaDollarSign, FaChartLine, FaWallet } from "react-icons/fa";
import { SiReact } from "react-icons/si";

import { SiExpensify } from "react-icons/si";

const iconMap = {
  Sales: <FaChartLine className="text-[#d8f276] text-[22px]" />,
  Profit: <FaDollarSign className="text-[#d8f276] text-[22px]" />,
  "Today Received": <FaWallet className="text-[#d8f276] text-[22px]" />,
  Expense: <SiExpensify className="text-[#d8f276] text-[22px]" />,
};

const MiniCard = ({ title, amount, label, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md px-6 py-4 lg:px-3 lg:py-1 flex flex-col justify-center items-center max-w-[140px] lg:max-w-[110px] h-[140px] ${className}`}
    >
      <div className="mb-2 lg:mb-1">
        {/* Icon size smaller on large screens */}
        <span className="block lg:hidden">{iconMap[title]}</span>
        <span className="hidden lg:block text-[18px]">{iconMap[title]}</span>
      </div>
      <h3 className="text-sm lg:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 whitespace-nowrap">
        {title}
      </h3>
      <div className="text-3xl lg:text-xl font-bold text-[#181829] mb-1">
        {amount}
      </div>
      {label && (
        <p className="text-xs lg:text-[10px] text-gray-400 whitespace-nowrap">
          {label}
        </p>
      )}
    </div>
  );
};

export default MiniCard;
