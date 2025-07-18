import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import InputField from './InputField';
import Section from './Section';

const ProductDetails = ({ products, handleProductChange, addProduct, removeProduct }) => (
  <Section title="Product Details">
    <button
      onClick={addProduct}
      className="mb-4 bg-[#181829] text-white px-4 py-2 rounded-lg hover:bg-[#d8f276] hover:text-[#181829] transition-colors flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      Add Product
    </button>
    <div className="space-y-4">
      {products.map(product => (
        <div key={product.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Type <span className="text-red-500">*</span></label>
            <select
              value={product.type}
              onChange={(e) => handleProductChange(product.id, 'type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#181829] focus:border-[#181829] hover:border-gray-400 transition-colors"
            >
              {['Solar Panel', 'Inverter', 'Others', 'Select Product'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {product.type === 'Others' && (
            <InputField
              label="Specify Product"
              name="customProduct"
              value={product.customProduct}
              onChange={(e) => handleProductChange(product.id, 'customProduct', e.target.value)}
              required
            />
          )}
          <InputField
            label="Quantity"
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
            min="0"
            step="1"
            placeholder="Enter quantity"
          />
          <InputField
            label="Unit Price"
            type="number"
            name="unitPrice"
            value={product.unitPrice}
            onChange={(e) => handleProductChange(product.id, 'unitPrice', e.target.value)}
            min="0"
            step="0.01"
            placeholder="Enter price"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Line Total</label>
            <input
              type="number"
              value={product.lineTotal}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => removeProduct(product.id)}
              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

export default ProductDetails;
