import React, { useState } from "react";
import { Plus, Search, Building, Calendar } from "lucide-react";

const ProjectHeader = ({
  searchTerm,
  onSearchChange,
  onAddProject,
  onDateFilterChange,
}) => {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className="bg-white rounded-xl shadow-lg mb-2">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#181829] flex items-center gap-3">
              <Building className="w-7 h-7 text-[#d8f276]" />
              Projects
            </h2>
            <p className="text-gray-600 mt-1">
              Manage all your solar and service projects
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID or Customer Name"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
              />
            </div>
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="month"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      onDateFilterChange(e.target.value);
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                    placeholder="Select month..."
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {selectedDate && (
                  <button
                    onClick={() => {
                      setSelectedDate("");
                      onDateFilterChange("");
                    }}
                    className="px-2 py-1 text-gray-500 hover:text-gray-700"
                    title="Clear date filter"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={onAddProject}
              className="bg-[#181829] cursor-pointer text-white hover:text-[#181829] px-4 py-2 rounded-lg hover:bg-[#d8f276] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
