import React from "react";

const Section = ({ title, children, dashed = true }) => (
  <div
    className={
      dashed ? "border-2 border-dashed border-gray-200 rounded-lg p-6" : "p-6"
    }
  >
    <h3 className="text-lg font-semibold text-[#181829] mb-4 flex items-center gap-2">
      <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
      {title}
    </h3>
    {children}
  </div>
);

export default Section;
