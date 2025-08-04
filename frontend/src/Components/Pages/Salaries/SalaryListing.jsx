import React, { useState } from "react";
import { MoreVertical, Eye, Edit2, Trash2, DollarSign } from "lucide-react";

const SalaryListing = ({
  salaries,
  searchTerm,
  dateFilter,
  onViewSalary,
  onEditSalary,
  onDeleteSalary,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Filter salaries by search term and month
  const filteredSalaries = salaries.filter((salary) => {
    const matchesSearch =
      salary.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.designation.toLowerCase().includes(searchTerm.toLowerCase());

    if (!dateFilter) return matchesSearch;

    return matchesSearch && salary.month === dateFilter;
  });

  // Calculate total paid and last updated for each salary row
  const getTotalPaid = (salary) => {
    if (salary.wageType === "Daily" && Array.isArray(salary.wages)) {
      return salary.wages.reduce((sum, wage) => sum + (wage.amount || 0), 0);
    }
    if (salary.wageType === "Monthly" && Array.isArray(salary.advances)) {
      // Total Paid is the sum of all advances
      return salary.advances.reduce((sum, adv) => sum + (adv.amount || 0), 0);
    }
    return 0;
  };

  const getLastUpdated = (salary) => {
    let last = salary.lastUpdated ? new Date(salary.lastUpdated) : null;
    if (
      salary.wageType === "Daily" &&
      Array.isArray(salary.wages) &&
      salary.wages.length > 0
    ) {
      const wageDates = salary.wages.map((w) => new Date(w.date));
      const maxWageDate = new Date(
        Math.max(...wageDates.map((d) => d.getTime()))
      );
      if (!last || maxWageDate > last) last = maxWageDate;
    }
    if (
      salary.wageType === "Monthly" &&
      Array.isArray(salary.advances) &&
      salary.advances.length > 0
    ) {
      const advDates = salary.advances.map((a) => new Date(a.date));
      const maxAdvDate = new Date(
        Math.max(...advDates.map((d) => d.getTime()))
      );
      if (!last || maxAdvDate > last) last = maxAdvDate;
    }
    return last
      ? last.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "--";
  };

  const totalAmount = filteredSalaries.reduce(
    (sum, salary) => sum + getTotalPaid(salary),
    0
  );

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
                    key={salary.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      if (!e.target.closest(".dropdown-container")) {
                        onViewSalary(salary);
                      }
                    }}
                  >
                    <td className="px-6 py-4 text-sm text-[#181829]">
                      <div className="font-medium">{salary.employeeName}</div>
                      <div className="text-gray-500 text-xs">
                        {salary.designation}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181829]">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {salary.wageType} Wage
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181829]">
                      {new Date(salary.month + "-01").toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short" }
                      )}
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
