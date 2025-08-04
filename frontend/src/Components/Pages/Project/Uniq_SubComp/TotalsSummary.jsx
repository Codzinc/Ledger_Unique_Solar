import React from "react";
import Section from "./Section";

const TotalsSummary = ({
  subtotal,
  installationCost,
  formData,
  handleInputChange,
  grandTotal,
}) => (
  <Section title="Totals Summary">
    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
      <div className="flex justify-between items-center text-gray-600">
        <span>Subtotal:</span>
        <span className="font-medium text-gray-900">
          ₹
          {subtotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {formData.installationType !== "none" && (
        <div className="flex justify-between items-center text-gray-600">
          <span>Installation Cost:</span>
          <span className="font-medium text-gray-900">
            ₹{installationCost.toLocaleString()}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center text-gray-600">
        <span>Tax (Optional):</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleInputChange}
            placeholder="0.00"
            className="w-20 px-2 py-1 border border-gray-300 rounded text-right "
          />
          <span>%</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-gray-900">
            Grand Total:
          </span>
          <span className="font-bold text-lg text-[#181829]">
            ₹
            {grandTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  </Section>
);

export default TotalsSummary;
