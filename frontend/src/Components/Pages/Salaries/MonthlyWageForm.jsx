import React, { useState } from "react";
import {
  ArrowLeft,
  HelpCircle,
} from "lucide-react";

const MonthlyWageForm = ({ onBack, onSubmit, initialData }) => {
  const isEditMode = !!initialData; // ✅ detect edit vs create

  const [formData, setFormData] = useState({
    id: initialData?.id || null,
    employeeName: initialData?.employeeName || "",
    date:
      initialData?.date ||
      new Date().toISOString().split("T")[0], // ✅ default full date (YYYY-MM-DD)
    baseSalary: initialData?.baseSalary || initialData?.salary_amount || "",
    totalAdvance:
      initialData?.totalAdvance || initialData?.total_advance_taken || 0,
    remainingSalary:
      initialData?.remainingSalary || initialData?.remaining_salary || 0,
    note: initialData?.note || initialData?.description || "",
    wageType: "Monthly",
  });

  const [errors, setErrors] = useState({});

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // ✅ Auto-calculate remaining salary
      if (name === "baseSalary" || name === "totalAdvance") {
        const base =
          parseFloat(name === "baseSalary" ? value : prev.baseSalary) || 0;
        const advance =
          parseFloat(name === "totalAdvance" ? value : prev.totalAdvance) || 0;
        newData.remainingSalary = base - advance;
      }

      return newData;
    });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeName)
      newErrors.employeeName = "Employee name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.baseSalary)
      newErrors.baseSalary = "Fixed salary amount is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      id: formData.id,
      employee: formData.employeeName,
      date: formData.date, // ✅ use full date now
      salary_amount: parseFloat(formData.baseSalary),
      description: formData.note || "",
      wage_type: "Monthly",
      total_advance_taken: parseFloat(formData.totalAdvance) || 0,
      remaining_salary: parseFloat(formData.remainingSalary) || 0,
      status: "Active",
      month: formData.date.substring(0, 7), // ✅ keep month info if needed in backend
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
            {/* Row 1: Employee, Date, Salary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Employee Name */}
              <div>
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
              <div>
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

              {/* Salary */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Fixed Salary Amount *
                </label>
                <input
                  type="number"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleChange}
                  placeholder="Enter base salary"
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
            <div>
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
            <div className="bg-gray-50 rounded-lg p-6 space-y-2">
              <h3 className="font-medium text-gray-800">Card Preview</h3>
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
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "---"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Salary:</span>
                <span className="font-medium">₨ {formData.baseSalary || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Advance:</span>
                <span className="font-medium">₨ {formData.totalAdvance || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining Salary:</span>
                <span className="font-medium">₨ {formData.remainingSalary || 0}</span>
              </div>
            </div>

            {/* How it Works (only in create mode) */}
            {!isEditMode && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800">How it Works</h4>
                </div>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Use once per employee each month.</li>
                  <li>• Add wages or advances after creation.</li>
                  <li>• Prevents duplicate monthly cards.</li>
                  <li>• Matches real-life salary cycle logic.</li>
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
