import React from "react";
import { Plus, Trash2 } from "lucide-react";
import InputField from "./InputField";
import Section from "./Section";

const ProductDetails = ({
  products,
  handleProductChange,
  addProduct,
  removeProduct,
  formErrors
}) => {
  const inputClass = (field, productId) => {
    const errorKey = `products[${productId}].${field}`;
    return `w-full px-3 py-2 border rounded-lg hover:border-gray-400 transition-colors ${
      formErrors[errorKey] ? "border-red-500" : "border-gray-300"
    }`;
  };

  const errorMsg = (field, productId) => {
    const errorKey = `products[${productId}].${field}`;
    return formErrors[errorKey] && (
      <p className="text-sm text-red-600 mt-1">{formErrors[errorKey]}</p>
    );
  };

  return (
    <Section title="Product Details">
      <button
        type="button"
        onClick={addProduct}
        className="mb-4 bg-[#181829] text-white px-4 py-2 rounded-lg hover:bg-[#d8f276] hover:text-[#181829] transition-colors flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Product
      </button>
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type <span className="text-red-500">*</span>
              </label>
              <select
                value={product.product_type}
                onChange={(e) =>
                  handleProductChange(product.id, "product_type", e.target.value)
                }
                className={inputClass("product_type", product.id)}
              >
                <option value="">Select Product Type</option>
                {[
                  "solar_panel",
                  "inverter",
                  "structure",
                  "allied_material",
                  "battery",
                  "turnkey_activities",
                  "earthing_boring",
                  "net_metering",
                  "others"
                ].map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
              {errorMsg("product_type", product.id)}
            </div>
            
            {product.product_type === "others" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specify Product <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={product.specify_product}
                  onChange={(e) =>
                    handleProductChange(product.id, "specify_product", e.target.value)
                  }
                  className={inputClass("specify_product", product.id)}
                  placeholder="Specify product"
                />
                {errorMsg("specify_product", product.id)}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) =>
                  handleProductChange(product.id, "quantity", e.target.value)
                }
                className={inputClass("quantity", product.id)}
                placeholder="Enter quantity"
              />
              {errorMsg("quantity", product.id)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={product.unit_price}
                onChange={(e) =>
                  handleProductChange(product.id, "unit_price", e.target.value)
                }
                className={inputClass("unit_price", product.id)}
                placeholder="Enter price"
              />
              {errorMsg("unit_price", product.id)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total
              </label>
              <input
                type="number"
                value={product.line_total}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeProduct(product.id)}
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                disabled={products.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default ProductDetails;