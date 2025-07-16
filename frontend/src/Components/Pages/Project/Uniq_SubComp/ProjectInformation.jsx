import React from 'react';
import InputField from './InputField';
import Section from './Section';

const ProjectInformation = ({ formData, handleInputChange }) => (
  <Section title="Project Information">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputField 
        label="Customer Name" 
        name="customerName" 
        required 
        placeholder="Enter customer name"
        value={formData.customerName}
        onChange={handleInputChange}
      />
      <InputField 
        label="Address" 
        name="address" 
        required 
        placeholder="Enter complete address"
        value={formData.address}
        onChange={handleInputChange}
      />
      <InputField 
        label="Date" 
        name="date" 
        type="date" 
        required 
        value={formData.date}
        onChange={handleInputChange}
      />
      <InputField 
        label="Valid Until" 
        name="validUntil" 
        type="date" 
        required 
        value={formData.validUntil}
        onChange={handleInputChange}
      />
      <InputField
        label="Project Type"
        name="projectType"
        type="select"
        required
        value={formData.projectType}
        onChange={handleInputChange}
        options={[
          { value: '', label: 'Select Project Type' },
          { value: 'On-Grid', label: 'On-Grid' },
          { value: 'Hybrid', label: 'Hybrid' },
          { value: 'Off-Grid', label: 'Off-Grid' }
        ]}
      />
    </div>
  </Section>
);

export default ProjectInformation;
