import React from 'react';
import InputField from './InputField';
import Section from './Section';

const PaymentTerms = ({ formData, handleInputChange }) => (
  <Section title="Payment Terms">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InputField 
        label="Advance Payment" 
        name="advancePayment" 
        type="number" 
        min="0"
        step="0.01"
        placeholder="0.00"
        value={formData.advancePayment}
        onChange={handleInputChange}
      />
      <InputField 
        label="Total Payment" 
        name="deliveryPayment"  
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        value={formData.deliveryPayment}
        onChange={handleInputChange}
      />
      <InputField 
        label="Completion Payment" 
        name="completionPayment"  
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        value={formData.completionPayment}
        onChange={handleInputChange}
      />
    </div>
  </Section>
);

export default PaymentTerms;
