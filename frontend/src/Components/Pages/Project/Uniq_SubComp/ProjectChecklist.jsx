import React from 'react';
import Section from './Section';

const ProjectChecklist = ({ checklist, handleChecklistChange }) => (
  <Section title="Project Checklist">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries({
        signedProposal: 'Signed Proposal',
        advancePaymentCheck: 'Advance Payment Check',
        sanctionedLoad: 'Sanctioned Load',
        cnicCopy: 'CNIC Copy/NTN Certificate',
        lastMonthBill: 'Last Month Bill Copy',
        meterName: 'Meter Name'
      }).map(([key, label]) => (
        <label key={key} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checklist[key]}
            onChange={() => handleChecklistChange(key)}
            className="w-4 h-4 text-[#181829] border-gray-300 rounded focus:ring-[#181829]"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  </Section>
);

export default ProjectChecklist;
