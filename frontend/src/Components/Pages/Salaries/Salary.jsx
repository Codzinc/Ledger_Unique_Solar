import React, { useState } from 'react';
import { SampleSalaries } from './SampleSalaries';
import AddSalary from './AddSalary';
import SalaryListing from './SalaryListing';
import ViewSalary from './ViewSalary';

const Salary = () => {
  const [salaries, setSalaries] = useState(SampleSalaries);
  const [showAddSalary, setShowAddSalary] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [showSalaryDetail, setShowSalaryDetail] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);

  const handleAddSalary = (salaryData, action) => {
    if (action === 'edit') {
      setSalaries(salaries.map(salary => 
        salary.id === salaryData.id ? salaryData : salary
      ));
      setEditingSalary(null);
    } else {
      setSalaries([...salaries, salaryData]);
    }
    setShowAddSalary(false);
  };

  const handleViewSalary = (salary) => {
    setSelectedSalary(salary);
    setShowSalaryDetail(true);
  };

  const handleEditSalary = (salary) => {
    setEditingSalary(salary);
    setSelectedSalary(null);
    setShowSalaryDetail(false);
    setShowAddSalary(true);
  };

  const handleDeleteSalary = (salaryId) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      setSalaries(salaries.filter(salary => salary.id !== salaryId));
    }
  };

  const getNextSrNo = () => {
    return salaries.length > 0 ? Math.max(...salaries.map(s => s.srNo)) + 1 : 1;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
       

        {/* Main Content */}
        <SalaryListing
          salaries={salaries}
          onViewSalary={handleViewSalary}
          onEditSalary={handleEditSalary}
          onDeleteSalary={handleDeleteSalary}
          onAddSalary={() => setShowAddSalary(true)}
        />

        {/* Modals */}
        {showAddSalary && (
          <AddSalary
            onAddSalary={handleAddSalary}
            onClose={() => {
              setShowAddSalary(false);
              setEditingSalary(null);
            }}
            nextSrNo={getNextSrNo()}
            editSalary={editingSalary}
          />
        )}

        {showSalaryDetail && selectedSalary && (
          <ViewSalary
            salary={selectedSalary}
            onClose={() => setShowSalaryDetail(false)}
            onEdit={handleEditSalary}
          />
        )}
      </div>
    </div>
  );
};

export default Salary;