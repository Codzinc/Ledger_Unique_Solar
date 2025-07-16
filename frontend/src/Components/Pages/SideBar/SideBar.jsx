import React from 'react'
import { FaMoneyBill, FaProductHunt, FaRProject } from 'react-icons/fa'
import { MdOutlineDashboard } from "react-icons/md";
import { CiBadgeDollar } from "react-icons/ci";
import logo from '../../../assets/logo1.png'
import codzinc_logo from '../../../assets/codzinc_logo.png'

const menuItems = [
  { icon: <MdOutlineDashboard />, label: 'Dashboard' },
  { icon: <FaProductHunt />, label: 'Product' },
  { icon: <FaRProject />, label: 'Project' },
  { icon: <FaMoneyBill />, label: 'Expense' },
  { icon: <CiBadgeDollar />, label: 'Salary' },
]

const SideBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed top-0 left-0 h-screen w-[250px] bg-[#181829] p-4 flex flex-col justify-between shadow-xl z-40">
      {/* Logo */}
      <div className=" items-center mb-8 mt-2 flex gap-4 font-bold text-white text-2xl">
        <img src={logo} alt="App Logo" className="w-10 h-10" />
        <h1 className='cursor-pointer'>Unique Solar </h1>
      </div>
      {/* Menu */}
      <ul className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`flex items-center gap-3 px-4 py-3 rounded-full cursor-pointer transition-all text-lg select-none
              ${activeTab === item.label ? 'bg-[#d8f276] text-[#181829]' : 'text-white hover:bg-[#d8f276] hover:text-[#181829]'}
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
            {activeTab === item.label && (
              <span className="ml-auto w-2 h-2 bg-[#d8f276] rounded-full"></span>
            )}
          </li>
        ))}
      </ul>
      {/* Download App Button */}
      <div className="bg-[#d8f276] text-black rounded-2xl flex items-center mt-2 gap-3 px-4 py-3 cursor-pointer shadow-lg hover:bg-[#e6fa9c] transition-all">
        <div>
          <div className=" font-bold text-base">Developed by</div>
          <img src={codzinc_logo} alt="Codzinc" className='w-full ' />
        </div>
      </div>
    </div>
  )
}

export default SideBar