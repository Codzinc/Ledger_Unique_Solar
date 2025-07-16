import React from 'react';
import { X, DollarSign, User, Briefcase, Calendar, FileText, Edit, CreditCard, Receipt } from 'lucide-react';

const ViewSalary = ({ salary, onClose, onEdit }) => {
  if (!salary) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-[#d8f276]" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Salary Details</h2>
              <p className="text-gray-600">#{salary.srNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Salary Overview */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{salary.employeeName}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {salary.designation}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {salary.month}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">{salary.remarks}</p>
              </div>
              <div className="text-right">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Salary Amount</p>
                  <p className="text-3xl font-bold text-green-600">${salary.salary.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Employee Name */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Employee</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">{salary.employeeName}</p>
              <p className="text-sm text-gray-600 mt-1">{salary.employeeId || 'N/A'}</p>
            </div>

            {/* Designation */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800">Designation</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">{salary.designation}</p>
              <p className="text-sm text-gray-600 mt-1">Job position</p>
            </div>

            {/* Salary Amount */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">Salary</h4>
              </div>
              <p className="text-lg font-medium text-green-600">${salary.salary.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Monthly salary</p>
            </div>

            {/* Month */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-gray-800">Month</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">{salary.month}</p>
              <p className="text-sm text-gray-600 mt-1">Salary period</p>
            </div>

            {/* Date Paid */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-800">Date Paid</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">{salary.datePaid}</p>
              <p className="text-sm text-gray-600 mt-1">Payment date</p>
            </div>

            {/* Receipt Image (replaces Department) */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Receipt className="w-5 h-5 text-teal-600" />
                <h4 className="font-semibold text-gray-800">Receipt Image</h4>
              </div>
              {salary.receiptImage ? (
                <img
                  src={salary.receiptImage}
                  alt="Receipt"
                  className="w-full max-w-xs rounded-md border border-gray-300"
                />
              ) : (
                <p className="text-sm text-gray-500 italic">No receipt image uploaded</p>
              )}
            </div>
          </div>

          {/* Remarks Section */}
          {salary.remarks && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Remarks / Notes
              </h4>
              <p className="text-gray-700 leading-relaxed">{salary.remarks}</p>
            </div>
          )}

          {/* Salary Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Salary Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Employee</p>
                <p className="text-xl font-bold text-blue-600">{salary.employeeName}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Period</p>
                <p className="text-xl font-bold text-purple-600">{salary.month}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-xl font-bold text-green-600">${salary.salary.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(salary)}
            className="px-6 py-2 bg-[#d8f276] text-gray-800 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Salary
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSalary;
