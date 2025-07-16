import React, { useState } from 'react';
import {
  X,
  Plus,
  DollarSign,
  User,
  Briefcase,
  Calendar,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

const AddSalary = ({ onAddSalary, onClose, nextSrNo, editSalary = null }) => {
  const [formData, setFormData] = useState({
    employeeName: editSalary?.employeeName || '',
    designation: editSalary?.designation || '',
    salary: editSalary?.salary || '',
    month: editSalary?.month || '',
    remarks: editSalary?.remarks || '',
    receiptImage: editSalary?.receiptImage || null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
    if (!formData.employeeName.trim()) newErrors.employeeName = 'Employee name is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.salary || parseFloat(formData.salary) <= 0) newErrors.salary = 'Valid salary is required';
    if (!formData.month) newErrors.month = 'Month/Year is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const salaryData = {
      id: editSalary?.id || Date.now().toString(),
      srNo: editSalary?.srNo || nextSrNo,
      employeeName: formData.employeeName.trim(),
      designation: formData.designation.trim(),
      salary: parseFloat(formData.salary),
      month: formData.month,
      remarks: formData.remarks.trim(),
      receiptImage: formData.receiptImage || null,
      datePaid: editSalary?.datePaid || new Date().toISOString().split('T')[0]
    };

    onAddSalary(salaryData, editSalary ? 'edit' : 'add');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-[#d8f276]" />
            {editSalary ? 'Edit Salary' : 'Add Salary'}
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
            {/* Employee Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Employee Name *
              </label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  errors.employeeName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter employee name"
              />
              {errors.employeeName && <p className="text-red-500 text-sm mt-1">{errors.employeeName}</p>}
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Salary *
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  errors.salary ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  errors.designation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter designation"
              />
              {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
            </div>

            {/* Month/Year Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Month/Year *
              </label>
              <input
                type="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  errors.month ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month}</p>}
            </div>

            {/* Receipt Upload */}
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

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Remarks / Notes
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all resize-none"
              placeholder="Enter any remarks or notes"
            />
          </div>

          {/* Actions */}
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
              className="px-6 py-2 text-[#181829] rounded-lg bg-[#d8f276] cursor-pointer hover:text-[#d8f276] hover:bg-[#181829] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {editSalary ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalary;
