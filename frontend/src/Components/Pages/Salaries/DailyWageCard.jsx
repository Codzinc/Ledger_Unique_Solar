import React, { useState } from "react";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";

const DailyWageCard = ({ salary, onClose, onUpdate }) => {
  const [showWageForm, setShowWageForm] = useState(false);
  const [newWage, setNewWage] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    description: "",
  });
  const [wages, setWages] = useState(salary.wages || []);
  const [editWageId, setEditWageId] = useState(null);
  const [editWage, setEditWage] = useState({
    date: "",
    amount: "",
    description: "",
  });
  const handleEditWage = (wage) => {
    setEditWageId(wage.id);
    setEditWage({
      date: wage.date,
      amount: wage.amount,
      description: wage.description,
    });
  };

  const handleEditWageChange = (e) => {
    const { name, value } = e.target;
    setEditWage((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditWageSave = (e) => {
    e.preventDefault();
    const updatedWages = wages.map((wage) =>
      wage.id === editWageId
        ? {
            ...wage,
            date: editWage.date,
            amount: parseFloat(editWage.amount),
            description: editWage.description,
          }
        : wage
    );
    setWages(updatedWages);
    const totalPaid = updatedWages.reduce((sum, wage) => sum + wage.amount, 0);
    onUpdate({
      ...salary,
      wages: updatedWages,
      salary: totalPaid,
      lastUpdated: new Date().toISOString(),
    });
    setEditWageId(null);
    setEditWage({ date: "", amount: "", description: "" });
  };

  const handleEditWageCancel = () => {
    setEditWageId(null);
    setEditWage({ date: "", amount: "", description: "" });
  };

  const handleAddWage = (e) => {
    e.preventDefault();
    const wage = {
      id: Date.now(),
      date: newWage.date,
      amount: parseFloat(newWage.amount),
      description: newWage.description,
    };

    const updatedWages = [...wages, wage];
    setWages(updatedWages);

    // Calculate new total
    const totalPaid = updatedWages.reduce((sum, wage) => sum + wage.amount, 0);

    // Update the parent component
    onUpdate({
      ...salary,
      wages: updatedWages,
      salary: totalPaid, // Update the total salary amount
      lastUpdated: new Date().toISOString(),
    });

    setShowWageForm(false);
    setNewWage({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      description: "",
    });
  };

  const handleDeleteWage = (wageId) => {
    const updatedWages = wages.filter((wage) => wage.id !== wageId);
    const totalPaid = updatedWages.reduce((sum, wage) => sum + wage.amount, 0);

    onUpdate({
      ...salary,
      wages: updatedWages,
      salary: totalPaid,
      lastUpdated: new Date().toISOString(),
    });

    setWages(updatedWages);
  };

  const totalPaid = wages.reduce((sum, wage) => sum + wage.amount, 0);
  const totalEntries = wages.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="bg-[#181829] p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-[#d8f276] hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {salary.employeeName} – Daily Wage
                </h2>
                <p className="text-sm text-gray-400">
                  {new Date(salary.month + "-01").toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
          <div>
            <p className="text-sm text-gray-600">Total Paid This Month</p>
            <p className="text-xl font-bold text-[#181829]">
              Rs. {totalPaid.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-xl font-bold text-[#181829]">
              {new Date(salary.lastUpdated).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Entries</p>
            <p className="text-xl font-bold text-[#181829]">{totalEntries}</p>
          </div>
        </div>

        {/* Wages List */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Work History
            </h3>
            <button
              onClick={() => setShowWageForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-[#181829] bg-[#d8f276] rounded-lg hover:text-[#d8f276] hover:bg-[#181829] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add More Wage
            </button>
          </div>

          {/* Add Wage Form */}
          {showWageForm && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <form onSubmit={handleAddWage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newWage.date}
                      onChange={(e) =>
                        setNewWage((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
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
                      value={newWage.amount}
                      onChange={(e) =>
                        setNewWage((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newWage.description}
                      onChange={(e) =>
                        setNewWage((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Work description"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWageForm(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-[#181829] bg-[#d8f276] rounded-lg hover:text-[#d8f276] hover:bg-[#181829]"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Wages Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {wages.map((wage) =>
                  editWageId === wage.id ? (
                    <tr key={wage.id} className="bg-yellow-50">
                      <td className="px-6 py-2">
                        <input
                          type="date"
                          name="date"
                          value={editWage.date}
                          onChange={handleEditWageChange}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-6 py-2">
                        <input
                          type="number"
                          name="amount"
                          value={editWage.amount}
                          onChange={handleEditWageChange}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-6 py-2">
                        <input
                          type="text"
                          name="description"
                          value={editWage.description}
                          onChange={handleEditWageChange}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-6 py-2 flex gap-2">
                        <button
                          onClick={handleEditWageSave}
                          className="text-green-600 hover:text-green-800 px-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditWageCancel}
                          className="text-gray-600 hover:text-gray-800 px-2"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={wage.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(wage.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rs. {wage.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {wage.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditWage(wage)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWage(wage.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
                {wages.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No wages recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyWageCard;
