import React from "react";
import InputField from "./InputField";
import Section from "./Section";

const PaymentTerms = ({ formData, handleInputChange }) => (
  <Section title="Payment Terms">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InputField
        label="Advance Payment"
        name="advance_payment"
        type="number"
        placeholder="0.00"
        value={formData.advance_payment}
        onChange={handleInputChange}
      />
      <InputField
        label="Total Payment"
        name="total_payment"
        type="number"
        placeholder="0.00"
        value={formData.total_payment}
        onChange={handleInputChange}
        disabled
      />
      <InputField
        label="Completion Payment"
        name="completion_payment"
        type="number"
        placeholder="0.00"
        value={formData.completion_payment}
        onChange={handleInputChange}
        disabled
      />
    </div>
  </Section>
);

export default PaymentTerms;