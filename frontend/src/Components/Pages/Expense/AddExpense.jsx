import React, { useState } from 'react';
import {
  X, Plus, DollarSign, FileText, User, Tag, Calendar, Image as ImageIcon
} from 'lucide-react';
import { expenseCategories, utilizers } from './SampleExpense';

const AddExpense = ({ onAddExpense, onClose, nextSrNo, editExpense = null }) => {
  const [formData, setFormData] = useState({
    title: editExpense?.title || '',
    category: editExpense?.category || '',
    utilizer: editExpense?.utilizer || '',
    amount: editExpense?.amount || '',
    description: editExpense?.description || '',
    date: editExpense?.date || new Date().toISOString().split('T')[0],
    receiptImage: editExpense?.receiptImage || null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.utilizer) newErrors.utilizer = 'Utilizer is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const expenseData = {
      id: editExpense?.id || Date.now().toString(),
      srNo: editExpense?.srNo || nextSrNo,
      title: formData.title.trim(),
      category: formData.category,
      utilizer: formData.utilizer,
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      date: formData.date,
      receiptImage: formData.receiptImage,
    };

    onAddExpense(expenseData, editExpense ? 'edit' : 'add');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-[#d8f276]" />
            {editExpense ? 'Edit Expense' : 'Add New Expense'}
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
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Expense Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter expense title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Add Category"
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Utilizer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Utilizer *
              </label>
              <select
                name="utilizer"
                value={formData.utilizer}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  errors.utilizer ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select utilizer</option>
                {utilizers.map(utilizer => (
                  <option key={utilizer} value={utilizer}>{utilizer}</option>
                ))}
              </select>
              {errors.utilizer && <p className="text-red-500 text-sm mt-1">{errors.utilizer}</p>}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            {/* Date Picker */}
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
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Receipt Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Add Receipt Image
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all resize-none"
              placeholder="Enter expense description"
            />
          </div>

          {/* Form Actions */}
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
              className="px-6 py-2 bg-[#d8f276] text-[#181829] rounded-lg hover:bg-[#181829] hover:text-[#d8f276] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {editExpense ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
