import React from "react";
import { FaMoneyBill, FaProductHunt, FaRProject } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { CiBadgeDollar } from "react-icons/ci";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logo1.png";
import codzinc_logo from "../../../assets/codzinc_logo.png";

const menuItems = [
  { icon: <MdOutlineDashboard />, label: "Dashboard", path: "/dashboard" },
  { icon: <FaProductHunt />, label: "Product", path: "/products" },
  { icon: <FaRProject />, label: "Project", path: "/projects" },
  { icon: <FaMoneyBill />, label: "Expense", path: "/expenses" },
  { icon: <CiBadgeDollar />, label: "Salary", path: "/salaries" },
];

const SideBar = ({ onLinkClick }) => {
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 h-screen w-[250px] bg-[#181829] p-4 flex flex-col justify-between shadow-xl z-40">
      {/* Logo */}
      <div className="items-center mb-8 mt-2 flex gap-4 font-bold text-white text-2xl">
        <Link to="/dashboard" onClick={onLinkClick} className="flex items-center gap-4">
          <img src={logo} alt="App Logo" className="w-10 h-10" />
          <h1>Unique Solar</h1>
        </Link>
      </div>

      {/* Menu */}
      <ul className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.label}>
              <Link
                to={item.path}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-lg select-none ${
                  isActive
                    ? "bg-[#d8f276] text-[#181829] font-semibold"
                    : "text-white hover:bg-[#d8f276] hover:text-[#181829]"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 bg-[#181829] rounded-full"></span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer / Developed by */}
      <a
        href="https://codzinc.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="bg-[#d8f276] text-black rounded-2xl flex items-center mt-2 gap-3 px-4 py-3 cursor-pointer shadow-lg hover:bg-[#e6fa9c] transition-all">
          <div>
            <div className="font-bold text-base">Developed by</div>
            <img src={codzinc_logo} alt="Codzinc" className="w-full" />
          </div>
        </div>
      </a>
    </div>
  );
};

export default SideBar;
