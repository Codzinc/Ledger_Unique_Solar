import React, { useState } from 'react';
import { MoreVertical, Eye, Edit, Trash2, Plus, Search, DollarSign, Users } from 'lucide-react';

const SalaryListing = ({
  salaries,
  onViewSalary,
  onEditSalary,
  onDeleteSalary,
  onAddSalary
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSalaries = salaries.filter(salary =>
    salary.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salary.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salary.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salary.salary.toString().includes(searchTerm)
  );

  const totalAmount = filteredSalaries.reduce((sum, salary) => sum + salary.salary, 0);

  const handleDropdownToggle = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleAction = (action, salary) => {
    setActiveDropdown(null);
    switch (action) {
      case 'view':
        onViewSalary(salary);
        break;
      case 'edit':
        onEditSalary(salary);
        break;
      case 'delete':
        onDeleteSalary(salary.id);
        break;
    }
  };

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
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
              />
            </div>
            <button
              onClick={onAddSalary}
              className="bg-[#181829] cursor-pointer text-white hover:text-[#181829] px-4 py-2 rounded-lg hover:bg-[#d8f276] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Salary
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-[#181829] sticky top-0 z-10">
                <tr className="text-white">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[80px]">Sr #</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[100px]">Month</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[200px]">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">Date Paid</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[80px]">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalaries.map((salary) => (
                  <tr
                    key={salary.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      if (!(e.target.closest('.dropdown-container'))) {
                        onViewSalary(salary);
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-[#181829]">
                      #{salary.srNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181829]">
                      <span className=" px-2 py-1 rounded-full text-xs ">{salary.month}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#181829]">
                      <div className="font-medium">{salary.employeeName}</div>
                      <div className="text-gray-500 text-xs">{salary.designation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-[#181829]">
                      ${salary.salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181829]">
                      {salary.datePaid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownToggle(salary.id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeDropdown === salary.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <div className="py-1">
                              <button
                                onClick={() => handleAction('view', salary)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleAction('edit', salary)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Salary
                              </button>
                              <button
                                onClick={() => handleAction('delete', salary)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Salary
                              </button>
                            </div>
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
      
      <div className="p-6 bg-[#181829] text-white border-t border-gray-200 rounded-b-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm">Total Employees</p>
            <p className="text-lg font-bold">{filteredSalaries.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm">Total Salary</p>
            <p className="text-lg font-bold">${totalAmount.toLocaleString()}</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SalaryListing;
