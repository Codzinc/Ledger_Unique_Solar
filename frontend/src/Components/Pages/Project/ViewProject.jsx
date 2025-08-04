import React from "react";
import {
  X,
  Edit2,
  Trash2,
  FileText,
  ClipboardList,
  ReceiptText,
} from "lucide-react";

const ViewProject = ({ project, onClose, onEdit, onDelete }) => {
  if (!project) return null;

  const renderField = (label, value) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value || "-"}</p>
    </div>
  );

  const renderStatus = (status) => {
    const statusClasses = {
      COMPLETED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          statusClasses[status?.toUpperCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const isUniqueSolar = project.company === "UNIQUE SOLAR";
  const isZarorrat =
    project.company === "ZARORRAT.COM" ||
    project.projectType?.toLowerCase().includes("zarorrat");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-[#d8f276]" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Project Details
              </h2>
              <p className="text-gray-600">#{project.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {project.customerName}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {project.company}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {new Date(project.date).toLocaleDateString()}
                  </span>
                  {renderStatus(project.status)}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {project.address}
                </p>
              </div>
              <div className="text-right">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{project.amount?.toLocaleString() || "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderField("Project Type", project.projectType)}
            {renderField("Contact Number", project.contact_no)}
            {renderField(
              "Valid Until",
              project.validUntil &&
                new Date(project.validUntil).toLocaleDateString()
            )}
            {renderField(
              "Advance Payment",
              `₹${project.advanceReceived?.toLocaleString() || "0"}`
            )}
            {renderField(
              "Pending Amount",
              `₹${project.pending?.toLocaleString() || "0"}`
            )}
            {renderField("Status", renderStatus(project.status))}
            {renderField("Notes", project.notes)}
            {renderField("Address", project.address)}
            {isUniqueSolar &&
              renderField("Tax Rate", project.tax ? `${project.tax}%` : "0%")}
            {isUniqueSolar &&
              renderField("Installation Type", project.installationType)}
          </div>

          {/* Product Table */}
          {isUniqueSolar && project.products?.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-gray-600" />
                Products
              </h4>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-gray-500 font-medium uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-gray-500 font-medium uppercase">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-gray-500 font-medium uppercase">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-gray-500 font-medium uppercase">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-gray-500 font-medium uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {project.products.map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">{product.type}</td>
                        <td className="px-6 py-4">{product.description}</td>
                        <td className="px-6 py-4">{product.quantity}</td>
                        <td className="px-6 py-4">
                          ₹{product.unitPrice?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          ₹{product.Total?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Checklist */}
          {isUniqueSolar && project.checklist && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-gray-600" />
                Project Checklist
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(project.checklist).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      disabled
                      className="h-4 w-4 text-[#d8f276]"
                    />
                    <span className="text-sm text-gray-700">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zarorrat services */}
          {isZarorrat && project.selectedServices && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-gray-600" />
                Services Provided
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(project.selectedServices)
                  .filter(([_, value]) => value)
                  .map(([service]) => (
                    <div key={service} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
                      <span className="text-sm text-gray-700">{service}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {project.notes && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Notes
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap">
                {project.notes}
              </p>
            </div>
          )}

          {/* Receipt Image */}
          {project.receiptImage && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-teal-600" />
                Receipt Image
              </h4>
              <img
                src={project.receiptImage}
                alt="Receipt"
                className="max-w-xs rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => onDelete(project.id)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={() => onEdit(project)}
            className="px-6 py-2 bg-[#d8f276] text-gray-800 rounded-lg flex items-center gap-2 hover:bg-[#cbe966] transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;
