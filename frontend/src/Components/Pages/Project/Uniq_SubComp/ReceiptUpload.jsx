import React from "react";
import Section from "./Section";

const ReceiptUpload = ({ handleReceiptUpload, receiptImage }) => {
  return (
    <Section title="Receipt Image">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="receipt-upload" className="inline-block">
            <input
              id="receipt-upload"
              type="file"
              accept="image/*"
              onChange={handleReceiptUpload}
              className="hidden"
            />
            <span
              className="bg-[#181829] text-white px-4 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[#d8f276] hover:text-[#181829]"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("receipt-upload").click();
              }}
            >
              Upload Receipt
            </span>
          </label>
          {receiptImage && (
            <span className="text-sm text-gray-600">Image selected</span>
          )}
        </div>

        {receiptImage && (
          <div className="mt-2">
            <img
              src={receiptImage}
              alt="Receipt Preview"
              className="h-40 object-contain rounded-md border"
            />
          </div>
        )}
      </div>
    </Section>
  );
};

export default ReceiptUpload;
