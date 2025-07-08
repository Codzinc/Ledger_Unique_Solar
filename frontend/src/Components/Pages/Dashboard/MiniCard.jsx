import { FaDollarSign, FaChartLine, FaWallet } from 'react-icons/fa';

const iconMap = {
  Sales: <FaChartLine className="text-[#d8f276] text-[22px]" />,
  Profit: <FaDollarSign className="text-[#d8f276] text-[22px]" />,
  'Today Received': <FaWallet className="text-[#d8f276] text-[22px]" />,
};

const MiniCard = ({ title, amount, label, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md px-6 py-4 flex flex-col justify-center items-center max-w-[140px] ${className}`}
    >
      <div className="mb-2">{iconMap[title]}</div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1 whitespace-nowrap">{title}</h3>
      <div className="text-3xl font-bold text-[#181829] mb-1">{amount}</div>
      {label && <p className="text-xs text-gray-400 whitespace-nowrap">{label}</p>}
    </div>
  );
};

export default MiniCard;
