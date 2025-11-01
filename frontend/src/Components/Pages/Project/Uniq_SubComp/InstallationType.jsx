import React from "react";
import Section from "./Section";

const InstallationType = ({ formData, handleInputChange, formErrors }) => {
  const inputClass = (field) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d8f276] focus:border-transparent ${
      formErrors[field] ? "border-red-500" : "border-gray-300"
    }`;

  const errorMsg = (field) =>
    formErrors[field] && (
      <p className="text-sm text-red-600 mt-1">{formErrors[field]}</p>
    );

  return (
    <Section title="Installation Type">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              value: "no_installation",
              label: "No Installation",
            },
            {
              value: "standard",
              label: "Standard Installation",
            },
            {
              value: "elevated",
              label: "Elevated Installation",
            },
          ].map(({ value, label }) => (
            <label
              key={value}
              className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.installation_type === value
                  ? "border-[#181829] bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  name="installation_type"
                  value={value}
                  checked={formData.installation_type === value}
                  onChange={handleInputChange}
                  className="mt-1 text-[#181829] focus:ring-[#d8f276]"
                />
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">
                    {label}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>

        {formErrors.installation_type && (
          <div className="text-red-600 text-sm mt-1">
            {formErrors.installation_type}
          </div>
        )}

        {/* Custom installation amount input if standard or elevated is selected */}
        {(formData.installation_type === "standard" ||
          formData.installation_type === "elevated") && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Installation Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="installation_amount"
              value={formData.installation_amount || ""}
              onChange={handleInputChange}
              className={inputClass("installation_amount")}
              placeholder="Enter installation amount"
            />
            {errorMsg("installation_amount")}
          </div>
        )}
      </div>
    </Section>
  );
};

export default InstallationType;
