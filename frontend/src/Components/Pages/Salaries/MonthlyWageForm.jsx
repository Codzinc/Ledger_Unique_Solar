import React, { useState } from "react";
import { ArrowLeft, HelpCircle } from "lucide-react";

const MonthlyWageForm = ({ onBack, onSubmit, initialData }) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    id: initialData?.id || null,
    employeeName: initialData?.employeeName || "",
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    baseSalary: initialData?.baseSalary || initialData?.salary_amount || "",
    totalAdvance:
      initialData?.totalAdvance || initialData?.total_advance_taken || 0,
    remainingSalary:
      initialData?.remainingSalary || initialData?.remaining_salary || 0,
    note: initialData?.note || initialData?.description || "",
    wageType: "Monthly",
  });

  const [errors, setErrors] = useState({});

  // ✅ Handle form field changes + live calculations
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (["baseSalary", "totalAdvance"].includes(name)) {
        const base = parseFloat(updated.baseSalary) || 0;
        const advance = parseFloat(updated.totalAdvance) || 0;
        updated.remainingSalary = Math.max(base - advance, 0);
      }

      return updated;
    });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeName)
      newErrors.employeeName = "Employee name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.baseSalary)
      newErrors.baseSalary = "Base salary amount is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      id: formData.id,
      employee: formData.employeeName,
      date: formData.date,
      month: formData.date.substring(0, 7),
      description: formData.note || "",
      wage_type: "Monthly",
      salary_amount: parseFloat(formData.baseSalary) || 0,
      total_advance_taken: parseFloat(formData.totalAdvance) || 0,
      remaining_salary: parseFloat(formData.remainingSalary) || 0,
      status: "Active",
    };

    onSubmit(submitData, isEditMode);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#181829] text-white p-6 flex items-center gap-3">
          <button
            onClick={onBack}
            type="button"
            className="text-[#d8f276] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">
            {isEditMode ? "EDIT MONTHLY SALARY" : "MONTHLY SALARY SETUP"}
          </h2>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Employee Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Employee Name *
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d8f276] focus:border-transparent ${
                    errors.employeeName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.employeeName && (
                  <p className="text-red-500 text-sm">{errors.employeeName}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d8f276] focus:border-transparent ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date}</p>
                )}
              </div>

              {/* Base Salary */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Fixed Salary Amount *
                </label>
                <input
                  type="number"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleChange}
                  placeholder="Enter salary"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d8f276] focus:border-transparent ${
                    errors.baseSalary ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.baseSalary && (
                  <p className="text-red-500 text-sm">{errors.baseSalary}</p>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Note (Optional)
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                placeholder="General note for this monthly card..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none"
              />
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="font-medium text-gray-800">Card Preview</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">Monthly Salary</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee:</span>
                  <span className="font-medium">
                    {formData.employeeName || "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {formData.date
                      ? new Date(formData.date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Salary:</span>
                  <span className="font-medium">
                    ₨ {formData.baseSalary || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Advance:</span>
                  <span className="font-medium">
                    ₨ {formData.totalAdvance || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Salary:</span>
                  <span className="font-medium">
                    ₨ {formData.remainingSalary || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* How it Works */}
            {!isEditMode && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800">How it Works</h4>
                </div>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Create one monthly card per employee.</li>
                  <li>• Add wages or advances after creation.</li>
                  <li>• Prevents duplicate salary records.</li>
                  <li>• Matches real-world salary cycles.</li>
                </ul>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-[#181829] bg-[#d8f276] rounded-lg hover:bg-[#181829] hover:text-[#d8f276] transition-colors"
              >
                {isEditMode
                  ? "Update Monthly Salary Card"
                  : "Create Monthly Salary Card"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MonthlyWageForm;
