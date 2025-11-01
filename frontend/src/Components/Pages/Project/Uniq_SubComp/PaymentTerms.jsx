import React from "react";
import Section from "./Section";

const PaymentTerms = ({ formData, handleInputChange, formErrors = {} }) => {
  const inputClass = (field) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d8f276] focus:border-transparent ${
      formErrors[field] ? "border-red-500" : "border-gray-300"
    }`;

  const errorMsg = (field) =>
    formErrors[field] && (
      <p className="text-sm text-red-600 mt-1">{formErrors[field]}</p>
    );

  return (
    <Section title="Payment Terms">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Advance Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Advance Payment *
          </label>
          <input
            type="number"
            name="advance_payment"
            placeholder="0.00"
            value={formData.advance_payment}
            onChange={handleInputChange}
            className={inputClass("advance_payment")}
            min="0"
            step="0.01"
          />
          {errorMsg("advance_payment")}
        </div>

        {/* Total Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Payment *
          </label>
          <input
            type="number"
            name="total_payment"
            placeholder="0.00"
            value={formData.total_payment}
            onChange={handleInputChange}
            className={inputClass("total_payment")}
            min="0"
            step="0.01"
          />
          {errorMsg("total_payment")}
        </div>

        {/* Pending / Completion Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pending Amount
          </label>
          <input
            type="number"
            name="completion_payment"
            placeholder="0.00"
            value={formData.completion_payment}
            readOnly
            className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed"
          />
        </div>
      </div>

      {/* Calculation summary */}
      {formData.total_payment && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <div className="text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Total:</span>
              <span>
                {(parseFloat(formData.total_payment) || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Advance:</span>
              <span>
                - {(parseFloat(formData.advance_payment) || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-semibold border-t mt-1 pt-1">
              <span>Balance:</span>
              <span>
                {(parseFloat(formData.completion_payment) || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

export default PaymentTerms;
