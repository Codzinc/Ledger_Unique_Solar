import React from "react";

const ActionButtons = ({ onBack, isSubmitting, isEdit = false }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
      <button
        type="button"
        onClick={onBack}
        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Back
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-[#181829] text-white rounded-lg hover:bg-[#d8f276] hover:text-[#181829] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting
          ? "Saving..."
          : isEdit
          ? "Update Project"
          : "Save Project"}
      </button>
    </div>
  );
};

export default ActionButtons;
