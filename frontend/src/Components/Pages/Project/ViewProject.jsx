import React from 'react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

const ViewProject = ({ project, onClose, onEdit, onDelete }) => {
  if (!project) return null;

  const renderField = (label, value) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="text-base text-gray-900">{value}</div>
    </div>
  );

  const renderStatus = (status) => {
    const statusClasses = {
      COMPLETED: 'bg-green-100 text-green-800',
      'IN PROGRESS': 'bg-orange-100 text-orange-800',
      DRAFT: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#181829] text-white p-6 sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-[#d8f276] hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold">Project Details</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(project)}
                className="p-2 hover:bg-[#d8f276] hover:text-[#181829] rounded-lg transition-colors"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this project?')) {
                    onDelete(project.id);
                  }
                }}
                className="p-2 hover:bg-red-500 rounded-lg transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#181829] mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {renderField('Project ID', project.id)}
              {renderField('Company', project.company)}
              {renderField('Customer Name', project.customerName)}
              {renderField('Contact No', project.contact_no || project.contactno)}
              {renderField('Address', project.address)}
              {renderField('Date', new Date(project.date).toLocaleDateString())}
              {renderField('Project Type', project.projectType)}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <div>{renderStatus(project.status)}</div>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div>
            <h3 className="text-lg font-semibold text-[#181829] mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
              Financial Details
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-lg font-semibold">₹{project.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Paid Amount:</span>
                <span className="text-lg font-semibold text-green-600">₹{project.paid?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-900 font-medium">Pending Amount:</span>
                <span className="text-lg font-semibold text-red-600">₹{project.pending?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {project.company === 'UNIQUE SOLAR' && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-[#181829] mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
                  Installation Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  {renderField('Installation Type', project.installationType)}
                  {renderField('Tax', `${project.tax}%`)}
                </div>
              </div>
              
              {project.products && (
                <div>
                  <h3 className="text-lg font-semibold text-[#181829] mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
                    Products
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {project.products.map((product, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{product.unitPrice}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{product.lineTotal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {project.company === 'ZARORRAT.COM' && project.selectedServices && (
            <div>
              <h3 className="text-lg font-semibold text-[#181829] mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
                Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(project.selectedServices)
                  .filter(([, selected]) => selected)
                  .map(([service]) => (
                    <div key={service} className="px-4 py-2 bg-gray-50 rounded-lg text-sm">
                      {service}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {project.notes && (
            <div>
              <h3 className="text-lg font-semibold text-[#181829] mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{project.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProject;
