import React from "react";
import InputField from "./InputField";
import Section from "./Section";

const PaymentTerms = ({ formData, handleInputChange }) => {
  return (
    <Section title="Payment Terms">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Advance Payment"
          name="advance_payment"
          type="number"
          placeholder="0.00"
          value={formData.advance_payment}
          onChange={handleInputChange}
          min="0"
          step="0.01"
        />
        
        <InputField
          label="Total Payment"
          name="total_payment"
          type="number"
          placeholder="0.00"
          value={formData.total_payment}
          onChange={handleInputChange}
          min="0"
          step="0.01"
        />
        
        <InputField
          label="Pending Amount"
          name="completion_payment"
          type="number"
          placeholder="0.00"
          value={formData.completion_payment}
          readOnly
          className="bg-gray-50 cursor-not-allowed"
        />
      </div>
      
      {/* Calculation summary */}
      {formData.total_payment && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <div className="text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Total:</span>
              <span>₹{(parseFloat(formData.total_payment) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Advance:</span>
              <span>- ₹{(parseFloat(formData.advance_payment) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t mt-1 pt-1">
              <span>Balance:</span>
              <span>₹{(parseFloat(formData.completion_payment) || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

export default PaymentTerms;