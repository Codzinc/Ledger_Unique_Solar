import React, { useState } from "react";
import { MoreVertical, Eye, Edit2, Trash2, DollarSign } from "lucide-react";

const SalaryListing = ({
  salaries = [], // Add default empty array
  searchTerm = "",
  dateFilter = "",
  onViewSalary,
  onEditSalary,
  onDeleteSalary,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Add null checks for salary properties
  const filteredSalaries = salaries.filter((salary) => {
    if (!salary) return false;

    const employeeName = salary.employeeName || salary.employee || "";
    const designation = salary.designation || "";

    const matchesSearch =
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designation.toLowerCase().includes(searchTerm.toLowerCase());

    if (!dateFilter) return matchesSearch;

    const salaryMonth = salary.month || salary.date?.substring(0, 7) || "";
    return matchesSearch && salaryMonth === dateFilter;
  });

  // Safe getter for total paid
  const getTotalPaid = (salary) => {
    if (!salary) return 0;

    if (salary.wageType === "Daily" && Array.isArray(salary.wages)) {
      return salary.wages.reduce(
        (sum, wage) => sum + (Number(wage.amount) || 0),
        0
      );
    }
    if (salary.wageType === "Monthly" && Array.isArray(salary.advances)) {
      return salary.advances.reduce(
        (sum, adv) => sum + (Number(adv.amount) || 0),
        0
      );
    }
    // Return salary amount if no wages/advances
    return Number(salary.salary) || Number(salary.amount) || 0;
  };

  // Safe getter for last updated
  const getLastUpdated = (salary) => {
    if (!salary) return "--";

    try {
      let last = salary.lastUpdated ? new Date(salary.lastUpdated) : null;

      if (
        salary.wageType === "Daily" &&
        Array.isArray(salary.wages) &&
        salary.wages.length > 0
      ) {
        const wageDates = salary.wages
          .map((w) => (w.date ? new Date(w.date) : null))
          .filter(Boolean);
        if (wageDates.length > 0) {
          const maxWageDate = new Date(
            Math.max(...wageDates.map((d) => d.getTime()))
          );
          if (!last || maxWageDate > last) last = maxWageDate;
        }
      }

      if (
        salary.wageType === "Monthly" &&
        Array.isArray(salary.advances) &&
        salary.advances.length > 0
      ) {
        const advDates = salary.advances
          .map((a) => (a.date ? new Date(a.date) : null))
          .filter(Boolean);
        if (advDates.length > 0) {
          const maxAdvDate = new Date(
            Math.max(...advDates.map((d) => d.getTime()))
          );
          if (!last || maxAdvDate > last) last = maxAdvDate;
        }
      }

      return last
        ? last.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "--";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "--";
    }
  };

  // Safe total calculation
  const totalAmount = filteredSalaries.reduce(
    (sum, salary) => sum + getTotalPaid(salary),
    0
  );

  // Show message if no data
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
          {/* Search and filters are now handled by parent components */}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-[#181829] sticky top-0 z-10">
                <tr className="text-white">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[200px]">
                    Employee Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">
                    Wage Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">
                    Month
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">
                    Total Paid
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[150px]">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalaries.map((salary) => (
                  <tr
                    key={salary.id || `salary-${Date.now()}-${Math.random()}`}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      if (!e.target.closest(".dropdown-container")) {
                        onViewSalary(salary);
                      }
                    }}
                  >
                    <td className="px-6 py-4 text-sm text-[#181829]">
                      <div className="font-medium">
                        {salary.employeeName || salary.employee || "--"}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {salary.designation || "--"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181829]">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {salary.wageType || salary.wage_type || "Unknown"} Wage
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181829]">
                      {salary.month || salary.date
                        ? new Date(
                            (salary.month || salary.date.substring(0, 7)) + "-01"
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                        : "--"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181829]">
                      <span className="text-green-600 font-medium">
                        Rs. {getTotalPaid(salary).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {getLastUpdated(salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181829] dropdown-container">
                      <div className="relative">
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
                                onEditSalary(salary);
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Totals Section */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            Total Entries:{" "}
            <span className="font-semibold text-[#181829]">
              {filteredSalaries.length}
            </span>
          </div>
          <div className="text-gray-600">
            Total Amount:{" "}
            <span className="font-semibold text-green-600">
              Rs. {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryListing;
