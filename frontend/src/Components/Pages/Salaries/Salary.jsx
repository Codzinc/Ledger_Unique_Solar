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
    totalEmployees: salaries.length,
    totalSalaries: salaries.reduce(
      (sum, salary) => sum + Number(salary.salary),
      0
    ),
    monthlyWageEmployees: salaries.filter((s) => s.wageType === "Monthly")
      .length,
    dailyWageEmployees: salaries.filter((s) => s.wageType === "Daily").length,
  };

  const handleAddSalary = () => {
    setShowAddModal(true);
  };

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

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleViewSalary = (salary) => {
    setSelectedSalary(salary);
    setSelectedWageType(
      salary.wageType === "Daily" ? "daily-wage" : "monthly-wage"
    );
  };

  const handleEditSalary = (salary) => {
    setSelectedSalary(salary);
    setSelectedWageType(
      salary.wageType === "Daily" ? "daily-wage" : "monthly-wage"
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

  const handleSalarySubmit = async (formData) => {
    try {
      let response;
      // Format the data according to API requirements
      const apiData = {
        ...formData,
        date: formData.date || `${formData.month}-01`, // Ensure date is in YYYY-MM-DD format
        salary_amount: parseFloat(formData.salary_amount) || 0,
        total_advance_taken: parseFloat(formData.total_advance_taken) || 0,
        remaining_salary: parseFloat(formData.remaining_salary) || parseFloat(formData.salary_amount) || 0,
        status: formData.status || "Active",
        month: formData.month || formData.date?.substring(0, 7) // Ensure month is in YYYY-MM format
      };

      if (formData.wage_type === "Daily") {
        response = await salaryApi.createDailyWage(apiData);
      } else {
        response = await salaryApi.createMonthlySalary(apiData);
      }
      
      if (response.data) {
        await fetchSalaries();
        handleBackToSalaries();
      }
    } catch (err) {
      console.error('API Error:', err.response?.data || err);
      const errorMessage = err.response?.data?.message || 
                        Object.values(err.response?.data || {})[0]?.[0] ||
                        'Failed to create salary record';
      alert(errorMessage);
    }
  };

  // Card update handler for wage/advance changes
  const handleCardUpdate = (updatedSalary) => {
    setSalaries(
      salaries.map((salary) =>
        salary.id === updatedSalary.id ? updatedSalary : salary
      )
    );
    setSelectedSalary(updatedSalary);
  };

  const handleDateFilterChange = (date) => {
    setDateFilter(date);
  };

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

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        <SalaryHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddSalary={handleAddSalary}
          onDateFilterChange={handleDateFilterChange}
        />

        <SalaryStats stats={stats} />

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
          (selectedWageType === "daily-wage" ? (
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
