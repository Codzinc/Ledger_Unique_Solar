import React from "react";
import Section from "./Section";

const InstallationType = ({ formData, handleInputChange }) => (
  <Section title="Installation Type">
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            value: "none",
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
                className="mt-1 text-[#181829] "
              />
              <div className="ml-3">
                <span className="block font-medium text-gray-900">{label}</span>
              </div>
            </div>
          </label>
        ))}
      </div>
      {/* Custom installation amount input if standard or elevated is selected */}
      {(formData.installation_type === "standard" ||
        formData.installation_type === "elevated") && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Installation Amount
          </label>
          <input
            type="number"
            name="installation_amount"
            value={formData.installation_amount || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d8f276] focus:border-transparent"
            placeholder="Enter installation amount"
          />
        </div>
      )}
    </div>
  </Section>
);

export default InstallationType;