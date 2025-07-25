import React from "react";
import InputField from "./InputField";
import Section from "./Section";

const PaymentTerms = ({ formData, handleInputChange }) => (
  <Section title="Payment Terms">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InputField
        label="Advance Payment"
        name="advancePayment"
        type="number"
        placeholder="0.00"
        value={formData.advancePayment}
        onChange={handleInputChange}
      />
      <InputField
        label="Total Payment"
        name="deliveryPayment"
        type="number"
        placeholder="0.00"
        value={formData.deliveryPayment}
        onChange={handleInputChange}
      />
      <InputField
        label="Pending Payment"
        name="pendingPayment"
        type="number"
        placeholder="0.00"
        value={formData.pendingPayment}
        onChange={handleInputChange}
      />
    </div>
  </Section>
);

export default PaymentTerms;
