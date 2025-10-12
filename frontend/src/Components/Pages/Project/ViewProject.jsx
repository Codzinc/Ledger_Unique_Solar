import React from "react";
import {
  X,
  Edit2,
  Trash2,
  FileText,
  ClipboardList,
  ReceiptText,
  DollarSign,
  Phone,
  MapPin,
  Calendar,
  User,
  Package,
  CheckCircle,
} from "lucide-react";

const ViewProject = ({ project, onClose, onEdit, onDelete }) => {
  if (!project) return null;

  const isUniqueSolar =
    project.company === "UNIQUE SOLAR" ||
    project.company_name === "UNIQUE SOLAR";
  const isZarorrat =
    project.company === "ZARORRAT.COM" ||
    project.company_name === "ZARORRAT.COM";

  const renderField = (label, value, icon = null) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-1">
        {icon &&
          React.createElement(icon, { className: "w-4 h-4 text-gray-500" })}
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <p className="text-base font-semibold text-gray-800">{value || "-"}</p>
    </div>
  );

  const renderStatus = (status) => {
    const statusClasses = {
      COMPLETED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      DRAFT: "bg-gray-100 text-gray-800",
    };

    const statusText = {
      COMPLETED: "Completed",
      PENDING: "Pending",
      IN_PROGRESS: "In Progress",
      DRAFT: "Draft",
    };

    const normalizedStatus = status?.toUpperCase();

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          statusClasses[normalizedStatus] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusText[normalizedStatus] || status || "Draft"}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return `${parseFloat(amount || 0).toLocaleString("en-IN")}`;
  };

  // Add this at the beginning of your ViewProject component
  console.log("👀 VIEW PROJECT RENDERED WITH DATA:", project);
  console.log("👀 CHECKLIST DATA:", project?.checklist);
  console.log("👀 SERVICES DATA:", project?.services);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isUniqueSolar ? "bg-green-100" : "bg-blue-100"
              }`}
            >
              <ClipboardList
                className={`w-6 h-6 ${
                  isUniqueSolar ? "text-green-600" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {project.customer_name || project.customerName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600">
                  #{project.project_id || project.id}
                </p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isUniqueSolar
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {project.company_name || project.company}
                </span>
                {renderStatus(project.status)}
              </div>
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
        <div className="p-6 space-y-8">
          {/* Project Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField(
                  "Customer Name",
                  project.customer_name || project.customerName,
                  User
                )}
                {renderField(
                  "Contact Number",
                  project.contact_number || project.contactNumber,
                  Phone
                )}
                {renderField(
                  "Project Type",
                  project.project_type || project.projectType,
                  Package
                )}
                {renderField(
                  "Date",
                  project.date
                    ? new Date(project.date).toLocaleDateString()
                    : "-",
                  Calendar
                )}
                {renderField(
                  "Valid Until",
                  project.valid_until
                    ? new Date(project.valid_until).toLocaleDateString()
                    : "-",
                  Calendar
                )}
                {renderField("Address", project.address, MapPin)}
              </div>

              {/* Unique Solar Specific Fields */}
              {isUniqueSolar && (
                <>
                  {project.installation_type &&
                    renderField("Installation Type", project.installation_type)}
                  {project.tax_percentage &&
                    renderField("Tax Percentage", `${project.tax_percentage}%`)}
                </>
              )}

              {/* Notes */}
              {project.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <h4 className="font-semibold text-gray-800">Notes</h4>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {project.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Financial Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatCurrency(project.total_amount || project.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Paid:</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(project.paid || project.advance_received)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-bold text-orange-600">
                      {formatCurrency(
                        project.pending || project.pending_amount
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Products Section - Unique Solar Only */}
          {isUniqueSolar && project.products && project.products.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  Products & Services
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specification
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {project.products.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.product_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {product.specify_product || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(product.unit_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(product.line_total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Services Section - Zarorrat Only */}
          {isZarorrat && project.services && project.services.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Services Provided
                </h4>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800">
                        {service.name || service.service_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Checklist Section - Unique Solar Only */}
          {/* // Update the checklist section in ViewProject: */}
          {isUniqueSolar &&
            project.checklist &&
            Object.keys(project.checklist).length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-green-600" />
                    Project Checklist
                  </h4>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(project.checklist).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={value}
                          readOnly
                          className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <label className="text-sm text-gray-700 capitalize">
                          {key.replace(/_/g, " ")}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          {/* Receipt Image */}
          {project.receipt_image && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <ReceiptText className="w-5 h-5 text-teal-600" />
                  Receipt
                </h4>
              </div>
              <div className="p-6">
                <img
                  src={project.receipt_image}
                  alt="Receipt"
                  className="max-w-md rounded-lg border border-gray-300 shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
        {/* // ViewProject.js mein delete button fix karein */}
        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => onDelete(project)} // ✅ Keep as project object
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Project
          </button>
          <button
            onClick={() => onEdit(project)}
            className="px-6 py-2 bg-[#d8f276] text-gray-800 rounded-lg flex items-center gap-2 hover:bg-[#cbe966] transition-colors font-semibold"
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
