import React, { useState, useEffect } from "react";
import { salaryApi } from "../../../ApiComps/Salary/AddSalary";
import { SampleSalaries } from "./SampleSalaries";
import SalaryHeader from "./SalaryHeader";
import SalaryStats from "./SalaryStats";
import SalaryListing from "./SalaryListing";
import AddSalaryModal from "./AddSalaryModal";
import DailyWageForm from "./DailyWageForm";
import MonthlyWageForm from "./MonthlyWageForm";
import DailyWageCard from "./DailyWageCard";
import MonthlyWageCard from "./MonthlyWageCard";

const SalaryContent = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [selectedWageType, setSelectedWageType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [salaries, setSalaries] = useState(SampleSalaries);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch salaries on mount
  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const response = await salaryApi.getAllSalaries();
      setSalaries(response.results);
    } catch (err) {
      setError("Failed to fetch salaries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalEmployees: Array.isArray(salaries) ? salaries.length : 0,
    totalSalaries: Array.isArray(salaries)
      ? salaries.reduce((sum, salary) => sum + Number(salary.salary), 0)
      : 0,
    monthlyWageEmployees: Array.isArray(salaries)
      ? salaries.filter((s) => s.wageType === "Monthly").length
      : 0,
    dailyWageEmployees: Array.isArray(salaries)
      ? salaries.filter((s) => s.wageType === "Daily").length
      : 0,
  };

  // Modal and form handlers
  const handleAddSalary = () => setShowAddModal(true);
  const handleCloseModal = () => setShowAddModal(false);

  const handleWageTypeSelect = (type) => {
    setSelectedWageType(type);
    setShowAddModal(false);
    setShowSalaryForm(true);
  };

  const handleBackToSalaries = () => {
    setShowSalaryForm(false);
    setSelectedWageType("");
    setSelectedSalary(null);
  };

  const handleViewSalary = (salary) => {
    setSelectedSalary(salary);
    let type = salary.wageType || salary.wage_type || "";
    if (type.toLowerCase().includes("daily")) {
      setSelectedWageType("Daily");
    } else {
      setSelectedWageType("Monthly");
    }
  };

  const handleEditSalary = (salary) => {
    const formattedSalary = {
      id: salary.id,
      employeeName: salary.employeeName || salary.employee_name,
      month: salary.month || salary.date?.substring(0, 7),
      serviceDescription:
        salary.serviceDescription || salary.service_description || "",
      baseSalary: salary.baseSalary || salary.salary_amount || "",
      totalAdvance: salary.totalAdvance || salary.total_advance_taken || 0,
      remainingSalary: salary.remainingSalary || salary.remaining_salary || 0,
      note: salary.note || "",
      wages: salary.wages || [],
      advances: salary.advances || [],
      wageType: salary.wageType || salary.wage_type,
    };

    setSelectedSalary(formattedSalary);
    setSelectedWageType(
      (salary.wageType || salary.wage_type || "")
        .toLowerCase()
        .includes("daily")
        ? "daily-wage"
        : "monthly-wage"
    );
    setShowSalaryForm(true);
  };

  const handleDeleteSalary = async (salaryId) => {
    if (window.confirm("Are you sure you want to delete this salary record?")) {
      try {
        await salaryApi.deleteSalary(salaryId);
        await fetchSalaries();
        setSelectedSalary(null);
        setSelectedWageType("");
      } catch (err) {
        console.error(err);
        alert("Failed to delete salary record");
      }
    }
  };

  // ✅ UPDATED handleSalarySubmit with edit mode logic
  const handleSalarySubmit = async (formData, isEditMode) => {
    try {
      // Ensure month is converted to valid date format for backend
      const safeMonth =
        formData.month?.length === 7 ? `${formData.month}-01` : formData.month;

      const apiData = {
        ...formData,
        date: formData.date || safeMonth,
        month: safeMonth, // ✅ make sure both are YYYY-MM-DD
        salary_amount: parseFloat(formData.salary_amount) || 0,
        total_advance_taken: parseFloat(formData.total_advance_taken) || 0,
        remaining_salary:
          parseFloat(formData.remaining_salary) ||
          parseFloat(formData.salary_amount) ||
          0,
        status: formData.status || "Active",
      };

      let response;

      if (isEditMode) {
        response = await salaryApi.updateSalary(formData.id, apiData);
        setSalaries((prev) =>
          prev.map((sal) => (sal.id === formData.id ? response : sal))
        );
      } else {
        // ✅ Create new salary record
        if (formData.wage_type === "Daily" || formData.wageType === "Daily") {
          response = await salaryApi.createDailyWage(apiData);
        } else {
          response = await salaryApi.createMonthlySalary(apiData);
        }

        setSalaries((prev) => [...prev, response.data]);
      }

      handleBackToSalaries();
    } catch (err) {
      console.error("API Error:", err.response?.data || err);
      const errorMessage =
        err.response?.data?.message ||
        Object.values(err.response?.data || {})[0]?.[0] ||
        "Failed to save salary record";
      alert(errorMessage);
    }
  };

  const handleCardUpdate = (updatedSalary) => {
    setSalaries((prev) =>
      prev.map((salary) =>
        salary.id === updatedSalary.id ? updatedSalary : salary
      )
    );
    setSelectedSalary(updatedSalary);
  };

  const handleDateFilterChange = (date) => setDateFilter(date);

  // Loading and Error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // Show Form View
  if (showSalaryForm) {
    return (
      <div className="min-h-screen bg-gray-100">
        {selectedWageType === "daily-wage" ? (
          <DailyWageForm
            onBack={handleBackToSalaries}
            onSubmit={handleSalarySubmit}
            initialData={selectedSalary}
          />
        ) : (
          <MonthlyWageForm
            onBack={handleBackToSalaries}
            onSubmit={handleSalarySubmit}
            initialData={selectedSalary}
          />
        )}
      </div>
    );
  }

  // Main Salary Listing View
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        <SalaryHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddSalary={handleAddSalary}
          onDateFilterChange={handleDateFilterChange}
        />

        <SalaryStats salaries={salaries} />

        <SalaryListing
          salaries={salaries}
          searchTerm={searchTerm}
          dateFilter={dateFilter}
          onViewSalary={handleViewSalary}
          onEditSalary={handleEditSalary}
          onDeleteSalary={handleDeleteSalary}
        />

        {showAddModal && (
          <AddSalaryModal
            onClose={handleCloseModal}
            onSelectType={handleWageTypeSelect}
          />
        )}

        {selectedSalary &&
          !showSalaryForm &&
          (selectedWageType === "Daily" ? (
            <DailyWageCard
              salary={selectedSalary}
              onClose={() => {
                setSelectedSalary(null);
                setSelectedWageType("");
              }}
              onUpdate={handleCardUpdate}
            />
          ) : (
            <MonthlyWageCard
              salary={selectedSalary}
              onClose={() => {
                setSelectedSalary(null);
                setSelectedWageType("");
              }}
              onUpdate={handleCardUpdate}
            />
          ))}
      </div>
    </div>
  );
};

const Salary = () => <SalaryContent />;

export default Salary;
