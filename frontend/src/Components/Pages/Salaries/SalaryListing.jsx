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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Filtering logic
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

  // Pagination logic
  const totalPages = Math.ceil(filteredSalaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSalaries = filteredSalaries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
    return Number(salary.salary) || Number(salary.amount) || 0;
  };

  const getLastUpdated = (salary) => {
    if (!salary) return "--";
    try {
      let last = salary.lastUpdated ? new Date(salary.lastUpdated) : null;

      if (salary.wageType === "Daily" && Array.isArray(salary.wages)) {
        const wageDates = salary.wages
          .map((w) => (w.date ? new Date(w.date) : null))
          .filter(Boolean);
        if (wageDates.length) {
          const maxDate = new Date(Math.max(...wageDates.map((d) => d.getTime())));
          if (!last || maxDate > last) last = maxDate;
        }
      }

      if (salary.wageType === "Monthly" && Array.isArray(salary.advances)) {
        const advDates = salary.advances
          .map((a) => (a.date ? new Date(a.date) : null))
          .filter(Boolean);
        if (advDates.length) {
          const maxDate = new Date(Math.max(...advDates.map((d) => d.getTime())));
          if (!last || maxDate > last) last = maxDate;
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

  const totalAmount = filteredSalaries.reduce(
    (sum, salary) => sum + getTotalPaid(salary),
    0
  );

  // ✅ Updated handleEditSalary (supports full date)
  const handleEditSalary = (salary) => {
    const isMonthly =
      (salary.wageType || salary.wage_type)?.toLowerCase() === "monthly";

    const formattedSalary = {
      id: salary.id,
      employeeName: salary.employeeName || salary.employee || "",
      month: salary.month || salary.date || new Date().toISOString().split("T")[0],
      serviceDescription: !isMonthly
        ? salary.serviceDescription || salary.description || ""
        : "",
      baseSalary: isMonthly ? salary.salary_amount || 0 : undefined,
      totalAdvance: isMonthly ? salary.total_advance_taken || 0 : undefined,
      remainingSalary: isMonthly ? salary.remaining_salary || 0 : undefined,
      salary_amount: salary.salary_amount || 0,
      total_advance_taken: salary.total_advance_taken || 0,
      remaining_salary: salary.remaining_salary || 0,
      wageType: salary.wageType || salary.wage_type || "Daily",
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
            <p className="text-gray-600 mt-1">Manage employee salary payments</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
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
                Total Paid
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Last Updated
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
                  <div className="font-medium">
                    {salary.employeeName || salary.employee || "--"}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {salary.designation || "--"}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {salary.wageType || salary.wage_type || "Unknown"} Wage
                  </span>
                </td>

                {/* ✅ Fixed: Full valid date display */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181829]">
                  {salary.month || salary.date
                    ? new Date(salary.month || salary.date).toLocaleDateString(
                        "en-CA",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )
                    : "--"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  Rs. {getTotalPaid(salary).toLocaleString()}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {getLastUpdated(salary)}
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

      {/* Footer Totals + Pagination */}
      <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 p-4 border-t border-gray-200">
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="text-gray-700 text-sm">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SalaryListing;
