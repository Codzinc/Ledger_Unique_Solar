import React, { useState, useEffect } from "react";
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
  updateAdvance,
  deleteAdvance,
} from "../../../ApiComps/Salary/SalaryCard";

const MonthlyWageCard = ({ salary, onClose, onUpdate }) => {
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", amount: "", purpose: "" });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /** 🟢 Fetch advances for this employee & month */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const employee = salary.employeeName || salary.employee || "";
        const data = await getAdvances(employee);

        const currentMonth =
          salary.month?.substring(0, 7) ||
          new Date().toISOString().substring(0, 7);

        const filtered = data
          .filter((adv) => adv.date?.startsWith(currentMonth))
          .map((adv) => ({
            id: adv.id,
            date: adv.date?.split("T")[0] || "",
            amount: parseFloat(adv.advance_taken || 0),
            purpose: adv.purpose || "",
          }));

        setAdvances(filtered);
      } catch (error) {
        console.error("Error fetching advances:", error);
        setAdvances([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [salary]);

  /** 🧮 Calculate salary summary */
  const totals = advances.reduce(
    (acc, a) => {
      acc.totalAdvance += a.amount || 0;
      return acc;
    },
    { baseSalary: +salary.salary_amount || 0, totalAdvance: 0 }
  );
  totals.remainingSalary = Math.max(totals.baseSalary - totals.totalAdvance, 0);

  /** 🟢 Add or Update Advance */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      employee: salary.employeeName || salary.employee,
      date: form.date,
      advance_taken: parseFloat(form.amount),
      purpose: form.purpose,
    };

    try {
      const response = editingId
        ? await updateAdvance(editingId, payload)
        : await createAdvance(payload);

      setAdvances((prev) => {
        const updated = {
          id: response.id,
          date: response.date?.split("T")[0] || form.date,
          amount: parseFloat(response.advance_taken || form.amount),
          purpose: response.purpose,
        };
        return editingId
          ? prev.map((a) => (a.id === editingId ? updated : a))
          : [...prev, updated];
      });

      resetForm();
      onUpdate?.({ ...salary });
    } catch (err) {
      alert("Error saving advance");
    }
  };

  /** 🗑 Delete advance */
  const handleDelete = async (id) => {
    try {
      await deleteAdvance(id);
      setAdvances((prev) => prev.filter((a) => a.id !== id));
      onUpdate?.({ ...salary });
    } catch (err) {
      alert("Failed to delete advance");
    }
  };

  /** ✏ Edit advance */
  const handleEdit = (advance) => {
    setEditingId(advance.id);
    setForm({
      date: advance.date,
      amount: advance.amount,
      purpose: advance.purpose,
    });
    setShowForm(true);
  };

  /** ♻ Reset form */
  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      purpose: "",
    });
  };

  /** 📅 Pagination */
  const totalPages = Math.max(1, Math.ceil(advances.length / itemsPerPage));
  const current = advances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "--";

  const formatMonth = (m) =>
    m
      ? new Date(m).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "--";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-6">
        {/* Header */}
        <div className="bg-[#181829] p-6 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-[#d8f276] hover:text-white transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {salary.employeeName || salary.employee} – Monthly Salary
              </h2>
              <p className="text-sm text-gray-400">
                {formatMonth(salary.month)}
              </p>
            </div>
          </div>
        </div>

        {/* Salary Summary */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
          {[
            ["Base Salary", totals.baseSalary, "text-[#181829]"],
            ["Total Advance", totals.totalAdvance, "text-red-600"],
            ["Remaining Salary", totals.remainingSalary, "text-green-600"],
          ].map(([label, value, color]) => (
            <div key={label}>
              <p className="text-sm text-gray-600">{label}</p>
              <p className={`text-xl font-bold ${color}`}>
                Rs. {value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Advances Section */}
        <div className="p-6">
          {/* Top Row */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Advance History – {formatMonth(salary.month)}
            </h3>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#d8f276] text-[#181829] rounded-lg hover:bg-[#181829] hover:text-[#d8f276] transition"
            >
              <Plus className="w-4 h-4" /> Add Advance
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 bg-gray-50 p-4 rounded-lg border space-y-4"
            >
              <div className="grid md:grid-cols-3 gap-4">
                {["date", "amount", "purpose"].map((f) => (
                  <div key={f}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {f}
                    </label>
                    <input
                      type={
                        f === "amount"
                          ? "number"
                          : f === "date"
                          ? "date"
                          : "text"
                      }
                      value={form[f]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [f]: e.target.value }))
                      }
                      required
                      placeholder={f === "purpose" ? "Purpose of advance" : ""}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#d8f276] text-[#181829] rounded-lg hover:bg-[#181829] hover:text-[#d8f276]"
                >
                  {editingId ? "Update Advance" : "Save Advance"}
                </button>
              </div>
            </form>
          )}

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            {loading ? (
              <div className="text-center text-gray-500 py-8">
                Loading advances...
              </div>
            ) : (
              <>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      {["Date", "Advance Taken", "Purpose", "Actions"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {current.length ? (
                      current.map((adv) => (
                        <tr key={adv.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3">{formatDate(adv.date)}</td>
                          <td className="px-6 py-3">
                            Rs. {adv.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-3">{adv.purpose || "--"}</td>
                          <td className="px-6 py-3 flex gap-3">
                            <button
                              onClick={() => handleEdit(adv)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(adv.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No advances recorded for {formatMonth(salary.month)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="border-t bg-gray-50 py-3 flex justify-center items-center gap-3">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-md text-sm disabled:opacity-50"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <span className="text-sm text-gray-700">
                      Page <strong>{currentPage}</strong> of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-md text-sm disabled:opacity-50"
                    >
                      Next <ChevronRight size={16} />
                    </button>
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
