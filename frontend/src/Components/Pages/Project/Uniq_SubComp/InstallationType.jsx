import React from 'react';
import Section from './Section';

const InstallationType = ({ formData, handleInputChange }) => (
  <Section title="Installation Type">
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            value: 'none',
            label: 'No Installation',
            price: 'Not Required'
          },
          {
            value: 'standard',
            label: 'Standard Installation',
            price: '₹5,000'
          },
          {
            value: 'elevated',
            label: 'Elevated Installation',
            price: '₹8,000'
          }
        ].map(({ value, label, price }) => (
          <label
            key={value}
            className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.installationType === value
                ? 'border-[#181829] bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start">
              <input
                type="radio"
                name="installationType"
                value={value}
                checked={formData.installationType === value}
                onChange={handleInputChange}
                className="mt-1 text-[#181829] "
              />
              <div className="ml-3">
                <span className="block font-medium text-gray-900">{label}</span>
                <span className="block text-sm text-gray-500 mt-1">{price}</span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  </Section>
);

export default InstallationType;
