import React from "react";
import { X, Clock, Calendar } from "lucide-react";

const AddSalaryModal = ({ onClose, onSelectType }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Select Wage Type</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onSelectType("daily-wage")}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#d8f276] transition-colors group text-left"
          >
            <div className="p-3 rounded-lg bg-[#d8f276] w-fit mb-4">
              <Clock className="w-6 h-6 text-[#181829]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Daily Wage
            </h3>
            <p className="text-gray-600">
              Add salary record for employees paid on a daily basis
            </p>
          </button>

          <button
            onClick={() => onSelectType("monthly-wage")}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#d8f276] transition-colors group text-left"
          >
            <div className="p-3 rounded-lg bg-[#d8f276] w-fit mb-4">
              <Calendar className="w-6 h-6 text-[#181829]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Monthly Wage
            </h3>
            <p className="text-gray-600">
              Add salary record for employees paid on a monthly basis
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSalaryModal;
