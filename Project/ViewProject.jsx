import React from 'react';
import { X, Building, Users, MapPin, Calendar, DollarSign, Target, Zap, Edit, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ViewProject = ({ project, onClose, onEdit }) => {
  if (!project) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'On Hold': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Building className="w-7 h-7 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Project Details</h2>
              <p className="text-gray-600">#{project.srNo}</p>
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
          {/* Project Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{project.projectName}</h3>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {project.projectType}
                  </span>
                  {project.capacity && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {project.capacity}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority} Priority
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>
              <div className="text-center lg:text-right">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Project Progress</p>
                  <div className="flex items-center justify-center lg:justify-end gap-2 mb-2">
                    <div className="w-20 bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${getProgressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{project.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Client Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Client</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">{project.clientName}</p>
              <p className="text-sm text-gray-600 mt-1">Client Name</p>
            </div>

            {/* Location */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">Location</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">{project.location}</p>
              <p className="text-sm text-gray-600 mt-1">Project Site</p>
            </div>

            {/* Project Manager */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800">Project Manager</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">{project.projectManager}</p>
              <p className="text-sm text-gray-600 mt-1">Team Lead</p>
            </div>

            {/* Start Date */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-gray-800">Start Date</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">{project.startDate}</p>
              <p className="text-sm text-gray-600 mt-1">Project Kickoff</p>
            </div>

            {/* End Date */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-gray-800">End Date</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">{project.endDate}</p>
              <p className="text-sm text-gray-600 mt-1">Expected Completion</p>
            </div>

            {/* Capacity */}
            {project.capacity && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-semibold text-gray-800">Capacity</h4>
                </div>
                <p className="text-lg font-medium text-gray-900">{project.capacity}</p>
                <p className="text-sm text-gray-600 mt-1">System Capacity</p>
              </div>
            )}
          </div>

          {/* Budget Analysis */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Budget Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-xl font-bold text-blue-600">₨{(project.budget / 1000000).toFixed(1)}M</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Amount Spent</p>
                <p className="text-xl font-bold text-orange-600">₨{(project.spent / 1000000).toFixed(1)}M</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-xl font-bold text-green-600">₨{(project.remaining / 1000000).toFixed(1)}M</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Budget Utilization</span>
                <span>{((project.spent / project.budget) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                  style={{ width: `${(project.spent / project.budget) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              Team Members ({project.team.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {project.team.map((member, index) => (
                <div key={index} className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{member}</p>
                  <p className="text-xs text-gray-500">Team Member</p>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          {project.milestones && project.milestones.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Project Milestones
              </h4>
              <div className="space-y-3">
                {project.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {milestone.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${milestone.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                        {milestone.name}
                      </p>
                      <p className="text-sm text-gray-500">Due: {milestone.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      milestone.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {milestone.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(project)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;