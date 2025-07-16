import React from 'react';
import SectionHeading from './SectionHeading';

const BasicInformation = ({ formData, handleInputChange }) => (
  <div>
    <SectionHeading title="Basic Project Information" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleInputChange}
          placeholder="Enter customer name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="md:col-span-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valid Until <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="validUntil"
          value={formData.validUntil}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  </div>
);

export default BasicInformation;
