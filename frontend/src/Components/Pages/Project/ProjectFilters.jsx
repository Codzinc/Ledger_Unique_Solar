import React from "react";
import { Filter, RotateCcw } from "lucide-react";

const ProjectFilters = ({ filters, onFiltersChange }) => {
  const filterOptions = {
    company: ["All Companies", "UNIQUE SOLAR", "ZARORRAT.COM"],
    projectType: ["All Types", "on_grid", "hybrid", "off_grid", "Service"],
    status: ["All Status", "Pending", "IN PROGRESS", "COMPLETED"],
  };

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  const handleResetFilters = () => {
    onFiltersChange({
      company: "All Companies",
      projectType: "All Types",
      status: "All Status",
    });
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter By:</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {Object.entries(filterOptions).map(([filterType, options]) => (
            <select
              key={filterType}
              value={filters[filterType]}
              onChange={(e) => handleFilterChange(filterType, e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-[#181829] text-white font-medium"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}

          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#d8f276] text-[#181829] cursor-pointer rounded-lg hover:bg-[#d8f276] transition-colors flex items-center gap-2 font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;
