import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getAdvances,
  createAdvance,
  deleteAdvance,
  updateAdvance,
} from "../../../ApiComps/Salary/SalaryCard";

const MonthlyWageCard = ({ salary, onClose, onUpdate }) => {
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [newAdvance, setNewAdvance] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    purpose: "",
  });
  const [advances, setAdvances] = useState([]);
  const [loadingAdvances, setLoadingAdvances] = useState(true);

  // Edit state
  const [editAdvanceId, setEditAdvanceId] = useState(null);
  const [editAdvance, setEditAdvance] = useState({
    date: "",
    amount: "",
    purpose: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Fetch advances (with full date handling)
  useEffect(() => {
    const fetchAdvances = async () => {
      setLoadingAdvances(true);
      try {
        const employeeName = salary.employeeName || salary.employee || "";
        const apiAdvances = await getAdvances(employeeName);
        setAdvances(
          apiAdvances.map((adv) => ({
            id: adv.id,
            date: adv.date
              ? adv.date.split("T")[0]
              : new Date().toISOString().split("T")[0],
            amount: parseFloat(adv.advance_taken || 0),
            purpose: adv.purpose || "",
            employee: adv.employee,
          }))
        );
      } catch (err) {
        console.error("Failed to load advances:", err);
        setAdvances([]);
      } finally {
        setLoadingAdvances(false);
      }
    };
    fetchAdvances();
  }, [salary]);

  // ✅ Ensure currentPage is valid whenever advances or itemsPerPage change
  useEffect(() => {
    const tp = Math.max(1, Math.ceil((advances?.length || 0) / itemsPerPage));
    if (currentPage > tp) setCurrentPage(tp);
    if (currentPage < 1) setCurrentPage(1);
  }, [advances, itemsPerPage, currentPage]);

  // ✅ Utility calculations
  const calculateTotals = (list) => {
    const totalAdvance = list.reduce(
      (sum, adv) => sum + (Number(adv.amount) || 0),
      0
    );
    const baseSalary = Number(salary.baseSalary || salary.salary_amount || 0);
    const remainingSalary = Math.max(baseSalary - totalAdvance, 0);
    return { totalAdvance, remainingSalary };
  };

  // ✅ Add Advance
  const handleAddAdvance = async (e) => {
    e.preventDefault();
    try {
      const advanceData = {
        employee: salary.employeeName || salary.employee || "",
        date: newAdvance.date,
        advance_taken: parseFloat(newAdvance.amount),
        purpose: newAdvance.purpose,
      };
      const created = await createAdvance(advanceData);

      const updatedAdvances = [
        ...advances,
        {
          id: created.id,
          date: created.date ? created.date.split("T")[0] : newAdvance.date,
          amount: parseFloat(created.advance_taken || newAdvance.amount),
          purpose: created.purpose,
          employee: created.employee,
        },
      ];

      const { totalAdvance, remainingSalary } = calculateTotals(updatedAdvances);

      onUpdate({
        ...salary,
        advances: updatedAdvances,
        totalAdvance,
        remainingSalary,
        lastUpdated: new Date().toISOString(),
      });

      setAdvances(updatedAdvances);
      setShowAdvanceForm(false);
      setNewAdvance({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        purpose: "",
      });

      // go to last page if new item added pushes to a new page
      const newTotalPages = Math.max(1, Math.ceil(updatedAdvances.length / itemsPerPage));
      setCurrentPage(newTotalPages);
    } catch (err) {
      console.error("Failed to add advance:", err);
      alert("Failed to add advance");
    }
  };

  // ✅ Delete Advance
  const handleDeleteAdvance = async (advanceId) => {
    try {
      await deleteAdvance(advanceId);
      const updatedAdvances = advances.filter((adv) => adv.id !== advanceId);
      const { totalAdvance, remainingSalary } = calculateTotals(updatedAdvances);
      onUpdate({
        ...salary,
        advances: updatedAdvances,
        totalAdvance,
        remainingSalary,
        lastUpdated: new Date().toISOString(),
      });
      setAdvances(updatedAdvances);
    } catch (err) {
      console.error("Failed to delete advance:", err);
      alert("Failed to delete advance");
    }
  };

  // ✅ Edit Advance
  const handleEditAdvance = (advance) => {
    setEditAdvanceId(advance.id);
    setEditAdvance({
      date: advance.date,
      amount: advance.amount,
      purpose: advance.purpose,
    });
  };

  const handleEditAdvanceChange = (e) => {
    const { name, value } = e.target;
    setEditAdvance((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditAdvanceSave = async () => {
    try {
      const advanceData = {
        employee: salary.employeeName || salary.employee || "",
        date: editAdvance.date,
        advance_taken: parseFloat(editAdvance.amount),
        purpose: editAdvance.purpose,
      };
      const updated = await updateAdvance(editAdvanceId, advanceData);
      const updatedAdvances = advances.map((adv) =>
        adv.id === editAdvanceId
          ? {
              id: updated.id,
              date: updated.date ? updated.date.split("T")[0] : editAdvance.date,
              amount: parseFloat(updated.advance_taken || editAdvance.amount),
              purpose: updated.purpose || editAdvance.purpose,
              employee: updated.employee,
            }
          : adv
      );
      const { totalAdvance, remainingSalary } = calculateTotals(updatedAdvances);
      onUpdate({
        ...salary,
        advances: updatedAdvances,
        totalAdvance,
        remainingSalary,
        lastUpdated: new Date().toISOString(),
      });
      setAdvances(updatedAdvances);
      setEditAdvanceId(null);
    } catch (err) {
      console.error("Failed to update advance:", err);
      alert("Failed to update advance");
    }
  };

  const handleEditAdvanceCancel = () => {
    setEditAdvanceId(null);
    setEditAdvance({ date: "", amount: "", purpose: "" });
  };

  // ✅ Pagination logic (clamped totalPages >= 1)
  const totalPages = Math.max(1, Math.ceil((advances?.length || 0) / itemsPerPage));
  const paginatedAdvances = advances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Format date safely
  const formatDate = (dateStr) => {
    if (!dateStr) return "--";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "--";
      return d.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "--";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="bg-[#181829] p-6 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-[#d8f276] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {salary.employeeName || salary.employee || "--"} – Monthly
                Salary
              </h2>
              <p className="text-sm text-gray-400">
                {formatDate(salary.date || salary.month || new Date().toISOString())}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
          <div>
            <p className="text-sm text-gray-600">Base Salary</p>
            <p className="text-xl font-bold text-[#181829]">
              Rs. {(salary.baseSalary || salary.salary_amount || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Advance</p>
            <p className="text-xl font-bold text-red-600">
              Rs. {(salary.totalAdvance || salary.total_advance_taken || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining Salary</p>
            <p className="text-xl font-bold text-green-600">
              Rs. {(salary.remainingSalary || salary.remaining_salary || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Advance History</h3>
            <button
              onClick={() => setShowAdvanceForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-[#181829] bg-[#d8f276] rounded-lg hover:text-[#d8f276] hover:bg-[#181829] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add More Advance
            </button>
          </div>

          {/* Add Advance Form */}
          {showAdvanceForm && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <form onSubmit={handleAddAdvance} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newAdvance.date}
                      onChange={(e) => setNewAdvance((p) => ({ ...p, date: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      value={newAdvance.amount}
                      onChange={(e) => setNewAdvance((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <input
                      type="text"
                      value={newAdvance.purpose}
                      onChange={(e) => setNewAdvance((p) => ({ ...p, purpose: e.target.value }))}
                      placeholder="Purpose of advance"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdvanceForm(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-[#181829] bg-[#d8f276] rounded-lg hover:text-[#d8f276] hover:bg-[#181829]"
                  >
                    Save Advance
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Advances Table */}
          <div className="border rounded-lg overflow-hidden">
            {loadingAdvances ? (
              <div className="text-center text-gray-500 py-8">Loading advances...</div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Advance Taken</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedAdvances.length > 0 ? (
                      paginatedAdvances.map((advance) =>
                        editAdvanceId === advance.id ? (
                          <tr key={advance.id} className="bg-yellow-50">
                            <td className="px-6 py-2">
                              <input
                                type="date"
                                name="date"
                                value={editAdvance.date || ""}
                                onChange={handleEditAdvanceChange}
                                className="w-full px-2 py-1 border rounded"
                              />
                            </td>
                            <td className="px-6 py-2">
                              <input
                                type="number"
                                name="amount"
                                value={editAdvance.amount || ""}
                                onChange={handleEditAdvanceChange}
                                className="w-full px-2 py-1 border rounded"
                              />
                            </td>
                            <td className="px-6 py-2">
                              <input
                                type="text"
                                name="purpose"
                                value={editAdvance.purpose || ""}
                                onChange={handleEditAdvanceChange}
                                className="w-full px-2 py-1 border rounded"
                              />
                            </td>
                            <td className="px-6 py-2 flex gap-2">
                              <button onClick={handleEditAdvanceSave} className="text-green-600 hover:text-green-800 px-2">Save</button>
                              <button onClick={handleEditAdvanceCancel} className="text-gray-600 hover:text-gray-800 px-2">Cancel</button>
                            </td>
                          </tr>
                        ) : (
                          <tr key={advance.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {advance.date ? new Date(advance.date).toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }) : "--"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Rs. {advance.amount?.toLocaleString() || 0}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{advance.purpose || "--"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                              <button type="button" onClick={() => handleEditAdvance(advance)} className="text-blue-600 hover:text-blue-800 mr-2" title="Edit">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => handleDeleteAdvance(advance.id)} className="text-red-600 hover:text-red-800" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">No advances recorded yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* PAGINATION - VISIBLE WHEN AT LEAST 1 PAGE */}
                {totalPages >= 1 && (
                  <div className="border-t bg-gray-50 px-6 py-4">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        className="flex items-center gap-1 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                      <span className="text-gray-700 text-sm font-medium">Page <strong>{currentPage}</strong> of {totalPages}</span>
                      <button
                        className="flex items-center gap-1 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyWageCard;
