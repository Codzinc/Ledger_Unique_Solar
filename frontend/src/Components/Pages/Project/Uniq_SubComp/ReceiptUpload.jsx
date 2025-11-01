import React from "react";
import Section from "./Section";
import { getFullImageUrl } from "../../../../ApiComps/Config";

const ReceiptUpload = ({ handleReceiptUpload, images, formErrors }) => {
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleReceiptUpload(files);
    }
  };

  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    handleReceiptUpload(newImages);
  };

  const getImageUrl = (image) => {
    let imagePath = "";

    if (image && image.image) {
      imagePath = image.image;
    } else if (typeof image === "string") {
      imagePath = image;
    } else if (image instanceof File) {
      return URL.createObjectURL(image);
    } else if (image && image.url) {
      imagePath = image.url;
    }

    if (imagePath) {
      const fullUrl = getFullImageUrl(imagePath);
      return fullUrl;
    }

    return "";
  };

  return (
    <Section title="Project Images">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="image-upload" className="inline-block">
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <span
              className="bg-[#181829] text-white px-4 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[#d8f276] hover:text-[#181829]"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("image-upload").click();
              }}
            >
              Upload Images
            </span>
          </label>
          {images && images.length > 0 && (
            <span className="text-sm text-gray-600">
              {images.length} image(s) selected
            </span>
          )}
        </div>

        {formErrors?.images && (
          <p className="text-red-500 text-sm">{formErrors.images}</p>
        )}

        {/* Show selected images preview */}
        {images && images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {images.map((image, index) => {
              const imageUrl = getImageUrl(image);
              return (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Preview ${index + 1}`}
                    className="h-48 w-full object-contain bg-gray-100 rounded-md border shadow-sm"
                    onError={(e) => {
                      console.error(
                        `❌ Image ${index} failed to load:`,
                        imageUrl
                      );
                      e.target.src =
                        "https://via.placeholder.com/200x200?text=Image+Error";
                      e.target.className =
                        "h-48 w-full object-contain bg-gray-200 rounded-md border";
                    }}
                    onLoad={(e) => {
                      console.log(`✅ Image ${index} loaded:`, imageUrl);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 text-center">
                    Image {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-sm text-gray-500">
          Maximum 7 images allowed. Supported formats: JPG, PNG, GIF, WEBP
        </p>
      </div>
    </Section>
  );
};

export default ReceiptUpload;
