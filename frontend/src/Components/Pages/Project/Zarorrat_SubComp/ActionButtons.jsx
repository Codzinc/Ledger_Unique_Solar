import React from "react";

const ActionButtons = ({ onBack, onSubmit }) => (
  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
    <button
      onClick={onBack}
      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
    >
      Back
    </button>
    <button
      onClick={onSubmit}
      type="button"
      className="px-6 py-2 bg-[#181829] text-white rounded-lg hover:bg-[#d8f276] hover:text-[#181829] transition-colors"
    >
      Save Project
    </button>
  </div>
);

export default ActionButtons;
