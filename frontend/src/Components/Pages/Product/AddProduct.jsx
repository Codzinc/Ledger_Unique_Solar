import React, { useState } from 'react';
import { Plus, X, Calendar, Image as ImageIcon } from 'lucide-react';

const AddProduct = ({ onAddProduct, onClose, nextSrNo }) => {
  const [formData, setFormData] = useState({
    product: '',
    brand: '',
    cName: '',
    purchPrice: '',
    salePrice: '',
    description: '',
    category: '',
    quantity: '',
    dateAdded: new Date().toISOString().split('T')[0],
    receiptImage: null, // NEW: Image state
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        receiptImage: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const purchPrice = parseFloat(formData.purchPrice);
    const salePrice = parseFloat(formData.salePrice);
    const profit = salePrice - purchPrice;

    const newProduct = {
      id: Date.now().toString(),
      srNo: nextSrNo,
      product: formData.product,
      brand: formData.brand,
      cName: formData.cName,
      purchPrice,
      salePrice,
      profit,
      description: formData.description,
      category: formData.category,
      quantity: formData.quantity,
      dateAdded: formData.dateAdded,
      receiptImage: formData.receiptImage, // NEW: include uploaded image
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Plus className="w-6 h-6 text-blue-600" />
            Add New Product
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product *</label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                placeholder="Enter product name"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                placeholder="Enter brand name"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
              <input
                type="text"
                name="cName"
                value={formData.cName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                placeholder="Enter customer name"
              />
            </div>

            {/* Purchase Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase *</label>
              <input
                type="number"
                name="purchPrice"
                value={formData.purchPrice}
                onChange={handleChange}
                required
                
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                placeholder="0.00"
              />
            </div>

            {/* Sale Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sale *</label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                required
                
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                placeholder="0.00"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                placeholder="Enter category"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                placeholder="0"
              />
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date *
              </label>
              <input
                type="date"
                name="dateAdded"
                value={formData.dateAdded}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
              />
            </div>

            {/* Upload Receipt Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Upload Receipt Image
              </label>
              <div className="flex items-center gap-4">
                <label className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-all">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {formData.receiptImage && (
                  <span className="text-sm text-gray-600">Image selected</span>
                )}
              </div>
              {formData.receiptImage && (
                <div className="mt-2">
                  <img
                    src={formData.receiptImage}
                    alt="Receipt Preview"
                    className="h-24 object-contain rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all resize-none"
              placeholder="Enter product description"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Profit: {formData.salePrice && formData.purchPrice
                ? `$${(parseFloat(formData.salePrice) - parseFloat(formData.purchPrice)).toFixed(2)}`
                : '$0.00'}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-lg bg-[#181829] cursor-pointer hover:text-[#181829] hover:bg-[#d8f276] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
