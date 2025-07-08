import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const AddProduct = ({ onAddProduct, onClose, nextSrNo }) => {
  const [formData, setFormData] = useState({
    product: '',
    brand: '',
    cName: '',
    purchPrice: '',
    salePrice: '',
    description: '',
    category: '',
    inStock: true,
    quantity: '',
   
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      inStock: formData.inStock,
      quantity: formData.quantity,
     
      dateAdded: new Date().toISOString().split('T')[0]
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product *
              </label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-all"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand }
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-all"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                name="cName"
                value={formData.cName }
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-all"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase *
              </label>
              <input
                type="number"
                name="purchPrice"
                value={formData.purchPrice}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale *
              </label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-all"
              >
                <option value="Solar Panels">Select category</option>
                <option value="Solar Panels">Solar Panels</option>
                <option value="Inverters">Inverters</option>
                <option value="Batteries">Batteries</option>
                <option value="Controllers">Controllers</option>
                <option value="Mounting">Mounting</option>
                <option value="Water Heaters">Water Heaters</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-all"
                placeholder="0.00"
              />
            </div>

           
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-all resize-none"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Status
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label className="ml-2 text-sm text-gray-700">In Stock</label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Profit will be calculated automatically: {formData.salePrice && formData.purchPrice ? 
                `$${(parseFloat(formData.salePrice) - parseFloat(formData.purchPrice)).toFixed(2)}` : 
                '$0.00'
              }
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
                className="px-6 py-2  text-white rounded-lg  bg-[#181829] cursor-pointer  hover:text-[#181829]  hover:bg-[#d8f276] transition-colors flex items-center gap-2"
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