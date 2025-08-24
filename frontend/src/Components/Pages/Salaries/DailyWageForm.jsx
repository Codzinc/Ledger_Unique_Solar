import React, { useState } from "react";
import { ArrowLeft, User, Calendar, FileText, HelpCircle } from "lucide-react";
import DailyWageCard from "./DailyWageCard";

const DailyWageForm = ({ onBack, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    employeeName: initialData?.employeeName || "",
    month:
      initialData?.month ||
      new Date().toISOString().split("T")[0].substring(0, 7),
    serviceDescription: initialData?.serviceDescription || "",
    wageType: "Daily",
  });

  const [errors, setErrors] = useState({});
  const [showWageCard, setShowWageCard] = useState(false);
  const [currentSalary, setCurrentSalary] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeName)
      newErrors.employeeName = "Employee name is required";
    if (!formData.month) newErrors.month = "Month & Year is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        employee: formData.employeeName,
        date: formData.month + "-01",
        description: formData.serviceDescription || "",
        wage_type: "Daily",
        salary_amount: 0, // Added salary_amount field
        status: "Active",
        total_advance_taken: 0,
        remaining_salary: 0,
      };
      onSubmit(submitData);
    }
  };

  if (showWageCard && currentSalary) {
    return (
      <DailyWageCard
        salary={currentSalary}
        onClose={() => setShowWageCard(false)}
        onUpdate={handleWageCardUpdate}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#181829] text-white p-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-[#d8f276] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">DAILY WAGE SETUP</h2>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two inputs in a single responsive row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Employee Name *
                </label>
                <input
                  name="employeeName"
                  type="text"
                  value={formData.employeeName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d8f276] focus:border-transparent ${
                    errors.employeeName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter employee name"
                />
                {errors.employeeName && (
                  <p className="text-red-500 text-sm">{errors.employeeName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Month & Year *
                </label>
                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d8f276] focus:border-transparent ${
                    errors.month ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.month && (
                  <p className="text-red-500 text-sm">{errors.month}</p>
                )}
              </div>
            </div>

            {/* Service Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Service Description (Optional)
              </label>
              <textarea
                name="serviceDescription"
                value={formData.serviceDescription}
                onChange={handleChange}
                rows={3}
                placeholder="General note for this monthly card..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none"
              />
            </div>

            {/* Card Preview */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="font-medium text-gray-800">Card Preview</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">Daily Wage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee:</span>
                  <span className="font-medium">
                    {formData.employeeName || "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Month:</span>
                  <span className="font-medium">
                    {formData.month
                      ? new Date(formData.month + "-01").toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )
                      : "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">
                    Empty - Ready for wage entries
                  </span>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">How it Works</h4>
              </div>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>
                  • Use this form once per employee at the start of each month.
                </li>
                <li>
                  • After creating, use "Add More Wage" or "Add More Advance"
                  inside the card.
                </li>
                <li>• Keeps records organized by Employee + Month</li>
                <li>• Prevents duplicate monthly cards.</li>
                <li>• Matches real-life monthly salary cycle logic</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-[#181829] rounded-lg bg-[#d8f276] hover:text-[#d8f276] hover:bg-[#181829] transition-colors"
              >
                Create Daily Wage Card
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};



export default DailyWageForm;
