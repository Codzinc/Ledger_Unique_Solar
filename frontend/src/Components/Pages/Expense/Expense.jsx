import React, { useState } from 'react';
import { SampleExpense } from './SampleExpense';
import AddExpense from './AddExpense';
import ExpenseListing from './ExpenseListing';
import ViewExpense from './ViewExpense';

const Expense = () => {
  const [expenses, setExpenses] = useState(SampleExpense);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleAddExpense = (expenseData, action) => {
    if (action === 'edit') {
      setExpenses(expenses.map(expense => 
        expense.id === expenseData.id ? expenseData : expense
      ));
      setEditingExpense(null);
    } else {
      setExpenses([...expenses, expenseData]);
    }
    setShowAddExpense(false);
  };

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setShowExpenseDetail(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setSelectedExpense(null);
    setShowExpenseDetail(false);
    setShowAddExpense(true);
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
    }
  };

  const getNextSrNo = () => {
    return expenses.length > 0 ? Math.max(...expenses.map(e => e.srNo)) + 1 : 1;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">

        {/* Main Content */}
        <ExpenseListing
          expenses={expenses}
          onViewExpense={handleViewExpense}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          onAddExpense={() => setShowAddExpense(true)}
        />

        {/* Modals */}
        {showAddExpense && (
          <AddExpense
            onAddExpense={handleAddExpense}
            onClose={() => {
              setShowAddExpense(false);
              setEditingExpense(null);
            }}
            nextSrNo={getNextSrNo()}
            editExpense={editingExpense}
          />
        )}

        {showExpenseDetail && selectedExpense && (
          <ViewExpense
            expense={selectedExpense}
            onClose={() => setShowExpenseDetail(false)}
            onEdit={handleEditExpense}
          />
        )}
      </div>
    </div>
  );
};

export default Expense;