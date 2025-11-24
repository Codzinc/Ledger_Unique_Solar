import React from "react";
import SectionHeading from "./SectionHeading";

const NotesAndAmount = ({ formData, handleInputChange, errors }) => {
  const inputStyle = (fieldName) =>
    `w-full px-3 py-2 border rounded-lg ${
      errors?.[fieldName] ? "border-red-500" : "border-gray-300"
    }`;

  const errorText = (fieldName) =>
    errors?.[fieldName] && (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    );

  return (
    <div>
      <SectionHeading title="Notes and Amount" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional service details..."
            rows="4"
            className={inputStyle("notes")}
          />
          {errorText("notes")}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            className={inputStyle("amount")}
            step="0.01"
            min="0"
          />
          {errorText("amount")}
        </div>
      </div>
    </div>
  );
};

export default NotesAndAmount;
