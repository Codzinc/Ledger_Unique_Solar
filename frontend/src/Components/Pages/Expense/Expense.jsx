import React, { useState, useEffect } from "react";
import AddExpense from "./AddExpense";
import ExpenseListing from "./ExpenseListing";
import ViewExpense from "./ViewExpense";
import expenseService from "../../../ApiComps/Expense/Expense";
import { utilizers, expenseCategories } from "./SampleExpense";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiExpenses = await expenseService.getAllExpenses();
      
      const uiExpenses = Array.isArray(apiExpenses) 
        ? apiExpenses.map((expense, index) => expenseService.mapAPIToUI(expense, index))
        : [expenseService.mapAPIToUI(apiExpenses, 0)];
      
      setExpenses(uiExpenses);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

 const handleAddExpense = async (expenseData, action) => {
    try {
      setError(null);
      
      if (action === "edit") {
        const updatedExpense = await expenseService.updateExpense(expenseData.id, expenseData);
        const uiExpense = expenseService.mapAPIToUI(updatedExpense);
        
        setExpenses(prevExpenses => 
          prevExpenses.map((expense, index) => 
            expense.id === expenseData.id 
              ? { ...uiExpense, srNo: expense.srNo }
              : expense
          )
        );
        setEditingExpense(null);
      } else {
        const newExpense = await expenseService.createExpense(expenseData);
        const uiExpense = expenseService.mapAPIToUI(newExpense, expenses.length);
        
        setExpenses(prevExpenses => [...prevExpenses, uiExpense]);
      }
      
      setShowAddExpense(false);
    } catch (err) {
      setError(err.message);
      console.error('Failed to save expense:', err);
    }
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

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        setError(null);
        await expenseService.deleteExpense(expenseId);
        
        setExpenses(prevExpenses => 
          prevExpenses
            .filter(expense => expense.id !== expenseId)
            .map((expense, index) => ({ ...expense, srNo: index + 1 }))
        );
      } catch (err) {
        setError(err.message);
        console.error('Failed to delete expense:', err);
      }
    }
  };

  const getNextSrNo = () => {
    return expenses.length > 0
      ? Math.max(...expenses.map((e) => e.srNo)) + 1
      : 1;
  };

  const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{message}</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8f276] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading expenses...</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={loadExpenses}
          />
        )}

        <ExpenseListing
          expenses={expenses}
          onViewExpense={handleViewExpense}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          onAddExpense={() => setShowAddExpense(true)}
          expenseCategories={expenseCategories}
          utilizers={utilizers}
        />

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