import React from "react";

const SectionHeading = ({ title }) => (
  <h3 className="text-lg font-semibold text-[#181829] mb-4 flex items-center gap-2">
    <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
    {title}
  </h3>
);

export default SectionHeading;
