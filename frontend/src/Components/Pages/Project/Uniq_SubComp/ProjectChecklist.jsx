import React from "react";
import Section from "./Section";

const ProjectChecklist = ({ checklist, handleChecklistChange, checklistItems }) => {
  // If checklistItems is provided from API, use that
  const itemsToRender = checklistItems.length > 0 
    ? checklistItems 
    : Object.entries({
        signed_proposal: "Signed Proposal",
        advance_payment_check: "Advance Payment Check",
        sanctioned_load: "Sanctioned Load",
        cnic_copy: "CNIC Copy/NTN Certificate",
        last_month_bill: "Last Month Bill Copy",
        meter_name: "Meter Name",
      }).map(([key, label]) => ({ item_name: label }));

  return (
    <Section title="Project Checklist">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {itemsToRender.map((item) => {
          const key = item.item_name.toLowerCase().replace(/\s+/g, '_');
          return (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checklist[key] || false}
                onChange={() => handleChecklistChange(key)}
                className="w-4 h-4 text-[#181829] border-gray-300 rounded "
              />
              <span>{item.item_name}</span>
            </label>
          );
        })}
      </div>
    </Section>
  );
};

export default ProjectChecklist;