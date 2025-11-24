import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getAdvances,
  createAdvance,
  deleteAdvance,
  updateAdvance,
} from "../../../ApiComps/Salary/SalaryCard";
import { salaryApi } from "../../../ApiComps/Salary/AddSalary";

const DailyWageCard = ({ salary, onClose, onUpdate }) => {
  const employeeName = salary.employeeName || salary.employee || "";

  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    purpose: "",
  });
  const [editing, setEditing] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const apiAdvances = await getAdvances(employeeName);
        const formatted = apiAdvances.map((a) => ({
          id: a.id,
          date: a.date?.split("T")[0] || "",
          amount: parseFloat(a.advance_taken || 0),
          purpose: a.purpose || "",
          employee: a.employee,
        }));
        setAdvances(formatted);
      } catch (err) {
        console.error("Error loading advances:", err);
        setAdvances([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [employeeName]);

  const { totalAdvance, totalEntries } = useMemo(() => {
    const total = advances.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
    return { totalAdvance: total, totalEntries: advances.length };
  }, [advances]);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "--";

  const syncSalaryTotals = async (newAdvances) => {
    const total = newAdvances.reduce(
      (sum, a) => sum + (Number(a.amount) || 0),
      0
    );
    const updatedSalary = { ...salary, total_paid: total, amount: total };
    await salaryApi.updateSalary(salary.id, updatedSalary);
    onUpdate?.(updatedSalary);
  };

  const handleAddAdvance = async (e) => {
    e.preventDefault();
    try {
      const advanceData = {
        employee: employeeName,
        date: form.date,
        advance_taken: parseFloat(form.amount),
        purpose: form.purpose,
      };

      const created = await createAdvance(advanceData);
      const newAdv = {
        id: created.id,
        date: created.date?.split("T")[0],
        amount: parseFloat(created.advance_taken),
        purpose: created.purpose,
        employee: created.employee,
      };

      const updated = [...advances, newAdv];
      setAdvances(updated);
      await syncSalaryTotals(updated);

      setForm({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        purpose: "",
      });
      setShowForm(false);
      setCurrentPage(Math.ceil(updated.length / itemsPerPage));
    } catch (err) {
      alert("Failed to add advance");
    }
  };

  const handleEditSave = async () => {
    try {
      const updatedData = {
        employee: employeeName,
        date: editing.date,
        advance_taken: parseFloat(editing.amount),
        purpose: editing.purpose,
      };

      const updated = await updateAdvance(editing.id, updatedData);
      const updatedList = advances.map((a) =>
        a.id === editing.id
          ? {
              id: updated.id,
              date: updated.date?.split("T")[0],
              amount: parseFloat(updated.advance_taken),
              purpose: updated.purpose,
              employee: updated.employee,
            }
          : a
      );

      setAdvances(updatedList);
      setEditing(null);
      await syncSalaryTotals(updatedList);
    } catch (err) {
      alert("Failed to update advance");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdvance(id);
      const updated = advances.filter((a) => a.id !== id);
      setAdvances(updated);
      await syncSalaryTotals(updated);
    } catch (err) {
      alert("Failed to delete advance");
    }
  };

  /** Pagination */
  const totalPages = Math.max(1, Math.ceil(advances.length / itemsPerPage));
  const pageData = advances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                {employeeName} – Daily Wage
              </h2>
              <p className="text-sm text-gray-400">{formatDate(salary.date)}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 border-b">
          <div>
            <p className="text-sm text-gray-600">Total Advance</p>
            <p className="text-xl font-bold text-red-600">
              Rs. {totalAdvance.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Entries</p>
            <p className="text-xl font-bold text-[#181829]">{totalEntries}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Add Advance Button */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Advance History
            </h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 text-[#181829] bg-[#d8f276] rounded-lg hover:text-[#d8f276] hover:bg-[#181829] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Advance
            </button>
          </div>

          {/* Add Advance Form */}
          {showForm && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <form onSubmit={handleAddAdvance} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, date: e.target.value }))
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, amount: e.target.value }))
                      }
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose
                    </label>
                    <input
                      type="text"
                      value={form.purpose}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, purpose: e.target.value }))
                      }
                      placeholder="Purpose of advance"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
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
            {loading ? (
              <div className="text-center text-gray-500 py-8">
                Loading advances...
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Advance Taken
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Purpose
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pageData.length > 0 ? (
                      pageData.map((a) =>
                        editing?.id === a.id ? (
                          <tr key={a.id} className="bg-yellow-50">
                            <td className="px-6 py-2">
                              <input
                                type="date"
                                value={editing.date}
                                onChange={(e) =>
                                  setEditing({
                                    ...editing,
                                    date: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border rounded"
                              />
                            </td>
                            <td className="px-6 py-2">
                              <input
                                type="number"
                                value={editing.amount}
                                onChange={(e) =>
                                  setEditing({
                                    ...editing,
                                    amount: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border rounded"
                              />
                            </td>
                            <td className="px-6 py-2">
                              <input
                                type="text"
                                value={editing.purpose}
                                onChange={(e) =>
                                  setEditing({
                                    ...editing,
                                    purpose: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border rounded"
                              />
                            </td>
                            <td className="px-6 py-2 flex gap-2">
                              <button
                                onClick={handleEditSave}
                                className="text-green-600 hover:text-green-800 px-2"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditing(null)}
                                className="text-gray-600 hover:text-gray-800 px-2"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        ) : (
                          <tr key={a.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {formatDate(a.date)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              Rs. {a.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {a.purpose || "--"}
                            </td>
                            <td className="px-6 py-4 flex gap-2 text-gray-500">
                              <button
                                onClick={() => setEditing(a)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(a.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          No advances recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="border-t bg-gray-50 px-6 py-4">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        className="flex items-center gap-1 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                      <span className="text-gray-700 text-sm font-medium">
                        Page <strong>{currentPage}</strong> of {totalPages}
                      </span>
                      <button
                        className="flex items-center gap-1 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
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

export default DailyWageCard;
