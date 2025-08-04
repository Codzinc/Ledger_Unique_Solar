import React from "react";
import SectionHeading from "./SectionHeading";
import { services } from "./servicesList";

const ServicesProvided = ({ selectedServices, handleServiceChange }) => (
  <div>
    <SectionHeading title="Services Provided" />
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#181829] mb-3">
        Select Services:
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {services.map((service) => (
          <label
            key={service.id}
            className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedServices[service.id] || false}
              onChange={() => handleServiceChange(service.id)}
              className="text-[#181829]"
            />
            <span className="text-sm">{service.label}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

export default ServicesProvided;
