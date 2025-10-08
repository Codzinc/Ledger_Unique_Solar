import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Calendar, Image as ImageIcon } from 'lucide-react';
// ✅ Import both add and update functions
import { addProduct, updateProduct } from '../../../ApiComps/Product/ProductList';

const AddProduct = ({ product, onSave, onClose, isEdit = false }) => {
  const getInitialFormData = () => {
    if (!product) {
      return {
        name: '',
        brand: '',
        customer_name: '',
        purchase_price: '',
        sale_price: '',
        description: '',
        category: '',
        quantity: '1',
        date: new Date().toISOString().split('T')[0],
      };
    }
    return {
      name: product.name || product.product || '',
      brand: product.brand || '',
      customer_name: product.customer_name || product.cName || '',
      purchase_price: product.purchase_price?.toString() || product.purchPrice?.toString() || '',
      sale_price: product.sale_price?.toString() || product.salePrice?.toString() || '',
      description: product.description || '',
      category: product.category || '',
      quantity: product.quantity?.toString() || '1',
      date: product.date || product.dateAdded || new Date().toISOString().split('T')[0],
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData(getInitialFormData());
    setImages([]);
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const requiredFields = ['name', 'brand', 'customer_name', 'purchase_price', 'sale_price', 'category', 'date'];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (parseFloat(formData.purchase_price) < 0 || parseFloat(formData.sale_price) < 0) {
      setError('Prices cannot be negative');
      return false;
    }

    return true;
  };

  // ✅ Updated handleSubmit with correct product.id handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'purchase_price' || key === 'sale_price') {
        formDataToSend.append(key, parseFloat(value).toString());
      } else if (key === 'quantity') {
        formDataToSend.append(key, (parseInt(value, 10) || 1).toString());
      } else {
        formDataToSend.append(key, value);
      }
    });

    images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    console.log('Submitting product:', {
      isEdit,
      productId: product?.id,
      formData,
    });

    try {
      // ✅ FIXED HERE: include product.id for update calls
      const result = isEdit
        ? await updateProduct(product.id, formDataToSend)
        : await addProduct(formDataToSend);

      console.log('API Response:', result);

      if (result.success && result.data) {
        onSave(result.data);
      } else {
        setError(result.error || `Failed to ${isEdit ? 'update' : 'save'} product`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const profit =
    formData.sale_price && formData.purchase_price
      ? (parseFloat(formData.sale_price) - parseFloat(formData.purchase_price)).toFixed(2)
      : '0.00';

  const profitMargin =
    formData.sale_price &&
    formData.purchase_price &&
    parseFloat(formData.purchase_price) > 0
      ? (
          ((parseFloat(formData.sale_price) - parseFloat(formData.purchase_price)) /
            parseFloat(formData.purchase_price)) *
          100
        ).toFixed(1)
      : '0.0';


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Plus className="w-6 h-6 text-blue-600" />
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Price *
              </label>
              <input
                type="number"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price *
              </label>
              <input
                type="number"
                name="sale_price"
                value={formData.sale_price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter category"
              />
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
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Product Images
            </label>

            <div className="flex flex-wrap gap-4 items-center">
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Add Images
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                multiple
                className="hidden"
              />

              {images.length > 0 && (
                <span className="text-sm text-gray-600">
                  {images.length} image{images.length !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="p-2 text-xs truncate bg-white">{image.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {(formData.purchase_price && formData.sale_price) && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Profit Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Profit Amount</p>
                  <p className={`text-xl font-bold ${parseFloat(profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {profit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Profit Margin</p>
                  <p className={`text-xl font-bold ${parseFloat(profitMargin) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {profitMargin}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Quantity</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formData.quantity || 1} units
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-white rounded-lg ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#181829] hover:text-[#181829] hover:bg-[#d8f276]'
              } transition-colors flex items-center gap-2`}
            >
              <Plus className="w-4 h-4" />
              {isSubmitting ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;