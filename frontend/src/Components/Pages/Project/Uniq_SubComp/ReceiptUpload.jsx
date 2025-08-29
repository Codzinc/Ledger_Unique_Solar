import React from "react";
import Section from "./Section";

const ReceiptUpload = ({ handleReceiptUpload, receiptImage }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      handleReceiptUpload(e);
    }
  };

  return (
    <Section title="Receipt Image">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="receipt-upload" className="inline-block">
            <input
              id="receipt-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
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