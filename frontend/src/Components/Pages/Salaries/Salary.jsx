import React, { useState } from "react";
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

  const handleDeleteSalary = (salaryId) => {
    if (window.confirm("Are you sure you want to delete this salary record?")) {
      setSalaries(salaries.filter((salary) => salary.id !== salaryId));
      setSelectedSalary(null);
      setSelectedWageType("");
    }
  };

  const handleSalarySubmit = (formData) => {
    if (selectedSalary) {
      // Preserve existing wages/advances when updating
      const existingData = salaries.find((s) => s.id === selectedSalary.id);
      const updatedData = {
        ...formData,
        id: selectedSalary.id,
        wages: existingData.wages || [],
        advances: existingData.advances || [],
        salary:
          formData.salary !== undefined
            ? formData.salary
            : existingData.salary || 0,
        baseSalary:
          formData.baseSalary !== undefined
            ? formData.baseSalary
            : existingData.baseSalary || 0,
        totalAdvance:
          formData.totalAdvance !== undefined
            ? formData.totalAdvance
            : existingData.totalAdvance || 0,
        remainingSalary:
          formData.remainingSalary !== undefined
            ? formData.remainingSalary
            : existingData.remainingSalary || 0,
        lastUpdated: new Date().toISOString(),
      };
      setSalaries(
        salaries.map((salary) =>
          salary.id === selectedSalary.id ? updatedData : salary
        )
      );
    } else {
      setSalaries([
        ...salaries,
        {
          ...formData,
          id: Date.now().toString(),
          lastUpdated: new Date().toISOString(),
        },
      ]);
    }
    handleBackToSalaries();
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
