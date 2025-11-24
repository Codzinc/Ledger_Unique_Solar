import React from "react";
import { Search, Plus, Calendar, X } from "lucide-react";

const SalaryHeader = ({
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  onAddSalary,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#181829] flex items-center gap-3">
            Salary
          </h2>
          <p className="text-gray-600 mt-1">Manage employee salary payments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => onDateFilterChange(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              {dateFilter && (
                <button
                  onClick={() => onDateFilterChange("")}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Clear date filter"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Add Salary Button */}
          <button
            onClick={onAddSalary}
            className="bg-[#181829] cursor-pointer text-white hover:text-[#181829] px-4 py-2 rounded-lg hover:bg-[#d8f276] transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Salary Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaryHeader;
