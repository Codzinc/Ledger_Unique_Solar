import { useState } from 'react';
import './App.css';
import SideBar from './Components/Pages/SideBar/SideBar';
import Dashboard from './Components/Pages/Dashboard/Dashboard';
import Product from './Components/Pages/Product/Product';
import Project from './Components/Pages/Project/Project';
import Expense from './Components/Pages/Expense/Expense';
import Salary from './Components/Pages/Salaries/Salary';
import Profile from './Components/Common/Profile';
import { FaUserCircle } from 'react-icons/fa';
import { HiMenuAlt3 } from 'react-icons/hi';

const tabComponents = {
  Dashboard: <Dashboard />,
  Product: <Product />,
  Project: <Project />,
  Expense: <Expense />,
  Salary: <Salary />,
};

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleTabClick = (label) => {
    setActiveTab(label);
    setMobileSidebarOpen(false); // Auto-close sidebar on mobile
  };

  return (
    <div className="flex min-h-screen bg-[#f6f7fb] relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[250px]">
        <SideBar activeTab={activeTab} setActiveTab={handleTabClick} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-40 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-[250px] h-screen bg-[#181829] shadow-lg transition-transform transform md:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SideBar activeTab={activeTab} setActiveTab={handleTabClick} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-screen p-4 relative">
        {/* Top bar for mobile */}
        <div className="flex items-center justify-between md:hidden mb-4">
          <button onClick={() => setMobileSidebarOpen(true)} className="text-3xl text-[#181829]">
            <HiMenuAlt3 />
          </button>
          <h1 className="text-xl font-bold text-[#181829]">Unique Solar</h1>
          <button onClick={() => setProfileOpen(true)}>
            <FaUserCircle className="text-2xl text-[#181829]" />
          </button>
        </div>

        {/* Profile Icon for Desktop */}
        <button
          className="hidden md:block absolute top-0 right-0 mt-2 mr-2 z-50"
          onClick={() => setProfileOpen(true)}
          aria-label="Open profile panel"
        >
          <FaUserCircle className="text-3xl text-[#181829] hover:text-[#d8f276] transition sm:text-4xl" />
        </button>

        <Profile open={profileOpen} onClose={() => setProfileOpen(false)} />
        {tabComponents[activeTab]}
      </div>
    </div>
  );
}

export default App;
