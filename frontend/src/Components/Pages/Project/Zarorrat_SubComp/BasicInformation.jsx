import React from "react";
import { User, Phone, MapPin, Calendar, Activity } from "lucide-react";

const BasicInformation = ({ formData, handleInputChange, errors }) => {
  const inputStyle = (fieldName) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d8f276] focus:border-transparent ${
      errors?.[fieldName] ? "border-red-500" : "border-gray-300"
    }`;

  const errorText = (fieldName) =>
    errors?.[fieldName] && (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    );

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-[#181829] mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
        Basic Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleInputChange}
            className={inputStyle("customer_name")}
            placeholder="Enter customer name"
          />
          {errorText("customer_name")}
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            className={inputStyle("contact_number")}
            placeholder="Enter contact number"
          />
          {errorText("contact_number")}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={inputStyle("address")}
            placeholder="Enter address"
          />
          {errorText("address")}
        </div>

        {/* Project Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Project Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={inputStyle("date")}
          />
          {errorText("date")}
        </div>

        {/* Valid Until */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Valid Until <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="valid_until"
            value={formData.valid_until}
            onChange={handleInputChange}
            className={inputStyle("valid_until")}
          />
          {errorText("valid_until")}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Activity className="w-4 h-4 inline mr-2" />
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className={inputStyle("status")}
          >
            <option value="">Select status</option>
            <option value="pending">pending</option>
            <option value="in_progress">in_progress</option>
            <option value="complete">complete</option>
          </select>
          {errorText("status")}
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;