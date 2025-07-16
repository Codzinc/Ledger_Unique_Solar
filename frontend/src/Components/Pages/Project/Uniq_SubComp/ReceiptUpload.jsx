import React from 'react';
import Section from './Section';

const ReceiptUpload = ({ handleReceiptUpload, receiptImage }) => (
  <Section title="Add Receipt">
    <input
      type="file"
      accept="image/*"
      onChange={handleReceiptUpload}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#181829] file:text-white hover:file:bg-[#d8f276] hover:file:text-[#181829]"
    />
    {receiptImage && (
      <div className="mt-4">
        <img src={URL.createObjectURL(receiptImage)} alt="Receipt Preview" className="max-w-xs border rounded shadow" />
      </div>
    )}
  </Section>
);

export default ReceiptUpload;
