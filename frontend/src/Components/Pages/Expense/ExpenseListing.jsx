import React, { useState } from 'react';
import { MoreVertical, Eye, Edit, Trash2, Plus, Search, DollarSign, TrendingDown, Filter, RotateCcw } from 'lucide-react';
import { expenseCategories, utilizers } from './SampleExpense';

const ExpenseListing = ({
  expenses,
  onViewExpense,
  onEditExpense,
  onDeleteExpense,
  onAddExpense
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [utilizerFilter, setUtilizerFilter] = useState('');

  // Filter expenses based on search and filters
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm);
    
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    const matchesUtilizer = !utilizerFilter || expense.utilizer === utilizerFilter;
    
    return matchesSearch && matchesCategory && matchesUtilizer;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleDropdownToggle = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleAction = (action, expense) => {
    setActiveDropdown(null);
    switch (action) {
      case 'view':
        onViewExpense(expense);
        break;
      case 'edit':
        onEditExpense(expense);
        break;
      case 'delete':
        onDeleteExpense(expense.id);
        break;
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setUtilizerFilter('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
<div className="p-6 border-b border-gray-200">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h2 className="text-2xl font-bold text-[#181829] flex items-center gap-3">
        <DollarSign className="w-7 h-7 text-[#d8f276]" />
        Expenses
      </h2>
      <p className="text-gray-600 mt-1">Track and manage your business expenses</p>
    </div>
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Title, Amount Or Detail"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
        />
      </div>
      <button
        onClick={onAddExpense}
        className="bg-[#181829] cursor-pointer text-white hover:text-[#181829] px-4 py-2 rounded-lg hover:bg-[#d8f276] transition-colors flex items-center gap-2 whitespace-nowrap"
      >
        <Plus className="w-4 h-4" />
        Add Expense
      </button>
    </div>
  </div>
</div>


      {/* Search and Filters */}
      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter By:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg  bg-[#181829]  text-white font-medium"
            >
              <option value="">Category</option>
              {expenseCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={utilizerFilter}
              onChange={(e) => setUtilizerFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg  bg-[#181829]  text-white font-medium"
            >
              <option value="">Utilizer</option>
              {utilizers.map(utilizer => (
                <option key={utilizer} value={utilizer}>{utilizer}</option>
              ))}
            </select>

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

      

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-[#181829] text-white sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider min-w-[80px]">
                    Sr #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider min-w-[250px]">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider min-w-[120px]">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider min-w-[100px]">
                    Utilizer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider min-w-[120px]">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider min-w-[80px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      if (!(e.target.closest('.dropdown-container'))) {
                        onViewExpense(expense);
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.srNo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{expense.title}</div>
                        <div className="text-gray-500 text-xs">{expense.date}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="text-xs font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className=" px-2 py-1 rounded-full text-xs font-medium">
                        {expense.utilizer}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium ">
                      ${expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownToggle(expense.id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeDropdown === expense.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <div className="py-1">
                              <button
                                onClick={() => handleAction('view', expense)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleAction('edit', expense)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Expense
                              </button>
                              <button
                                onClick={() => handleAction('delete', expense)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Expense
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

      {/* Stats Card */}
      <div className="p-6 bg-[#181829] text-white border-t border-gray-200 rounded-b-xl">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="text-center">
      <p className="text-sm">Total Expenses</p>
      <p className="text-lg font-bold">{filteredExpenses.length}</p>
    </div>
    <div className="text-center">
      <p className="text-sm">Total Amount</p>
      <p className="text-lg font-bold">${totalAmount.toLocaleString()}</p>
    </div>
  </div>
</div>



      
    </div>
  );
};

export default ExpenseListing;