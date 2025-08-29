import React from "react";
import SectionHeading from "./SectionHeading";

const PaymentSummary = ({
  totalAmount,
  formData,
  handleInputChange,
  pendingAmount,
}) => {
  const inputStyle = "w-32 px-3 py-1 border border-gray-300 rounded text-right";

  return (
    <div>
      <SectionHeading title="Payment Summary" />
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div className="flex justify-between">
          <span>Total Amount:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Advance Received:</span>
          <input
            type="number"
            name="advance_received"
            value={formData.advance_received}
            onChange={handleInputChange}
            placeholder="0.00"
            className={inputStyle}
            step="0.01"
            min="0"
            max={totalAmount}
          />
        </div>
        <div className="flex justify-between font-semibold text-lg border-t pt-4">
          <span>Pending Amount:</span>
          <span>₹{pendingAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;