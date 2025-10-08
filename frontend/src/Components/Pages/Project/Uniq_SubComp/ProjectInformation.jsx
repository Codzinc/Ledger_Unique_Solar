import React from "react";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Activity,
} from "lucide-react";

const ProjectInformation = ({ formData, handleInputChange, formErrors }) => {
  const inputClass = (field) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d8f276] focus:border-transparent ${
      formErrors[field] ? "border-red-500" : "border-gray-300"
    }`;

  const errorMsg = (field) =>
    formErrors[field] && (
      <p className="text-sm text-red-600 mt-1">{formErrors[field]}</p>
    );

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-[#181829] mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
        Project Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Customer Name *
          </label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleInputChange}
            className={inputClass("customer_name")}
            placeholder="Enter customer name"
          />
          {errorMsg("customer_name")}
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Contact Number *
          </label>
          <input
            type="number"
            name="contact_no"
            value={formData.contact_no}
            onChange={handleInputChange}
            className={inputClass("contact_no")}
            placeholder="Enter contact number"
          />
          {errorMsg("contact_no")}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={inputClass("address")}
            placeholder="Enter address"
          />
          {errorMsg("address")}
        </div>

        {/* Project Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Project Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={inputClass("date")}
          />
          {errorMsg("date")}
        </div>

        {/* Valid Until */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Valid Until *
          </label>
          <input
            type="date"
            name="valid_until"
            value={formData.valid_until}
            onChange={handleInputChange}
            className={inputClass("valid_until")}
          />
          {errorMsg("valid_until")}
        </div>

        {/* Project Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Project Type *
          </label>
          <select
            name="project_type"
            value={formData.project_type}
            onChange={handleInputChange}
            className={inputClass("project_type")}
          >
            <option value="">Select Project Type</option>
            <option value="on_grid">On-Grid</option>
            <option value="off_grid">Off-Grid</option>
            <option value="hybrid">Hybrid</option>
          </select>
          {errorMsg("project_type")}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Activity className="w-4 h-4 inline mr-2" />
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className={inputClass("status")}
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="complete">Complete</option>
          </select>
          {errorMsg("status")}
        </div>
      </div>
    </div>
  );
};

export default ProjectInformation;