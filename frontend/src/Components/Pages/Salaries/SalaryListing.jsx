import React, { useState, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SalaryListing = ({
  salaries = [],
  searchTerm = "",
  dateFilter = "",
  onViewSalary,
  onEditSalary,
  onDeleteSalary,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Filtering logic
  const filteredSalaries = salaries.filter((salary) => {
    if (!salary) return false;

    const employeeName = salary.employee || "";
    const designation = salary.designation || "";
    const matchesSearch =
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designation.toLowerCase().includes(searchTerm.toLowerCase());

    if (!dateFilter) return matchesSearch;

    const salaryDate = salary.month || salary.date;
    if (!salaryDate) return false;

    // Convert to YYYY-MM format for comparison
    const salaryYearMonth = salaryDate.substring(0, 7);
    return matchesSearch && salaryYearMonth === dateFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSalaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSalaries = filteredSalaries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Wage type display
  const getWageTypeDisplay = (salary) => {
    const wageType = salary.wage_type || "Unknown";
    switch (wageType.toLowerCase()) {
      case "monthly":
        return "Monthly Salary";
      case "daily":
        return "Daily Wage";
      case "wage":
        return "Wage";
      default:
        return `${wageType} Wage`;
    }
  };

  const getWageTypeBadgeColor = (salary) => {
    const wageType = salary.wage_type || "";
    if (wageType.toLowerCase().includes("daily")) {
      return "bg-green-100 text-green-800";
    } else if (wageType.toLowerCase().includes("monthly")) {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "--";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "--";
      return d.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "--";
    }
  };

  const handleEditSalary = (salary) => {
    const isMonthly = (salary.wage_type || "").toLowerCase() === "monthly";

    const formattedSalary = {
      id: salary.id,
      employee: salary.employee || "",
      month:
        salary.month || salary.date || new Date().toISOString().split("T")[0],
      date: salary.date || new Date().toISOString().split("T")[0],
      description: salary.description || "",
      salary_amount: salary.salary_amount || 0,
      amount: salary.amount || 0,
      wage_type: salary.wage_type || "Daily",
      status: salary.status || "Active",

      // frontend compatibility
      employeeName: salary.employee || "",
      baseSalary: isMonthly ? salary.salary_amount || 0 : undefined,
      serviceDescription: !isMonthly ? salary.description || "" : "",
    };

    onEditSalary(formattedSalary);
  };

  if (!salaries || salaries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <p className="text-gray-500">No salary records found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#181829] flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-[#d8f276]" />
              Salaries
            </h2>
            <p className="text-gray-600 mt-1">
              Manage employee salary payments
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredSalaries.length} of {salaries.length} records
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead className="bg-[#181829] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Employee Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Wage Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentSalaries.map((salary) => (
              <tr
                key={salary.id || `salary-${Math.random()}`}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={(e) => {
                  if (!e.target.closest(".dropdown-container")) {
                    onViewSalary(salary);
                  }
                }}
              >
                <td className="px-6 py-4 text-sm text-[#181829]">
                  <div className="font-medium">{salary.employee || "--"}</div>
                  {salary.description && (
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                      {salary.description}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getWageTypeBadgeColor(
                      salary
                    )}`}
                  >
                    {getWageTypeDisplay(salary)}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181829]">
                  {formatDisplayDate(salary.month || salary.date)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm dropdown-container relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(
                        activeDropdown === salary.id ? null : salary.id
                      );
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>

                  {activeDropdown === salary.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-2 border border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewSalary(salary);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSalary(salary);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSalary(salary.id);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer - Pagination Only */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 p-4 border-t border-gray-200">
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="text-gray-700 text-sm">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SalaryListing;
