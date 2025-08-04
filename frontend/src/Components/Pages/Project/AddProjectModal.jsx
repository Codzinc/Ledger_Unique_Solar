import React from "react";
import { X } from "lucide-react";

const AddProjectModal = ({ onClose, onSelectType }) => {
  const projectTypes = [
    {
      id: "unique-solar",
      name: "Unique Solar",
      description: "Solar Panel Projects",
      subtitle: "On-Grid, Hybrid, Off-Grid",
    },
    {
      id: "zarorrat",
      name: "Zarorrat.com",
      description: "Home Services",
      subtitle: "AC, Electrical, Plumbing, etc.",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className=" items-center ">
              <h2 className="text-xl font-semibold text-[#181829] ">
                PROJECT TYPE SELECTOR
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Project Type
            </h3>
            <p className="text-gray-600 mb-6">
              Choose the type of project you want to create:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => onSelectType(type.id)}
                  className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400  transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-blue-400 rounded-full"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{type.name}</h4>
                      <p className="text-sm text-gray-600">
                        {type.description}
                      </p>
                      <p className="text-xs text-gray-500">{type.subtitle}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-sm text-red-600 mb-6">
              * Mandatory: Must select one option
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="bg-[#181829] cursor-pointer text-white hover:text-[#181829] px-4 py-2 rounded-lg hover:bg-[#d8f276] transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
