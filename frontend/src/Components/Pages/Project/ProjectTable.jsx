import React, { useState, useMemo } from 'react';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { sampleProjects, STATUS_CLASSES } from './SampleProjects';

// Component for the table header
const TableHeader = () => (
  <thead className="bg-[#181829] text-white whitespace-nowrap sticky top-0 z-10 text-xs uppercase tracking-wider">
    <tr>
      {['Project ID', 'Company', 'Customer Name', 'Contact No', 'Address', 'Date', 'Project Type', 'Status', 'Total Amount', 'Paid', 'Pending', 'Actions'].map((head, idx) => (
        <th key={idx} className={`px-6 py-4 ${head === 'Actions' ? 'text-right' : ''}`}>
          {head}
        </th>
      ))}
    </tr>
  </thead>
);

// Component for action buttons
const ActionButtons = ({ project, activeDropdown, onDropdownToggle, onAction }) => (
  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
    <button
      onClick={() => onDropdownToggle(project.id)}
      className="text-gray-400 hover:text-gray-600"
    >
      <MoreVertical className="h-5 w-5" />
    </button>
    {activeDropdown === project.id && (
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-1">
          {[
            { action: 'view', label: 'View Details', icon: Eye },
            { action: 'edit', label: 'Edit', icon: Edit },
            { action: 'delete', label: 'Delete', icon: Trash2, danger: true }
          ].map(({ action, label, icon: Icon, danger }) => (
            <button
              key={action}
              onClick={() => onAction(action, project)}
              className={`flex items-center px-4 py-2 text-sm w-full hover:bg-gray-100 ${
                danger ? 'text-red-600' : 'text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4 mr-3" />
              {label}
            </button>
          ))}
        </div>
      </div>
    )}
  </td>
);

// Component for table cell
const TableCell = ({ value, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>{value}</td>
);

// Component for status badge
const StatusBadge = ({ status }) => {
  const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
  const statusClass = STATUS_CLASSES[status.toUpperCase()] || STATUS_CLASSES.DRAFT;
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`${baseClasses} ${statusClass}`}>
        {status}
      </span>
    </td>
  );
};

const ProjectTable = ({ projects, searchTerm, filters, onViewProject, onEditProject, onDeleteProject }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const itemsPerPage = 10;

  const handleSort = (key) => {
    const direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleDropdownToggle = (id) => {
    setActiveDropdown(prev => (prev === id ? null : id));
  };

  const handleAction = (action, project) => {
    setActiveDropdown(null);
    if (action === 'view') onViewProject(project);
    else if (action === 'edit') onEditProject(project);
    else if (action === 'delete') onDeleteProject(project.id);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const term = searchTerm?.toLowerCase() || '';
      const matchesSearch = [p.customerName, p.id, p.company].some(val => val.toLowerCase().includes(term));
      const matchesCompany = filters.company === 'All Companies' || p.company === filters.company;
      const matchesType = filters.projectType === 'All Types' || p.projectType === filters.projectType;
      const matchesStatus = filters.status === 'All Status' || p.status === filters.status;
      return matchesSearch && matchesCompany && matchesType && matchesStatus;
    });
  }, [projects, searchTerm, filters]);

  const sortedProjects = useMemo(() => {
    if (!sortConfig.key) return filteredProjects;
    return [...filteredProjects].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProjects, sortConfig]);

  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <TableHeader />
          <tbody className="divide-y divide-gray-200">
            {paginatedProjects.map(project => (
              <tr key={project.id} className="hover:bg-gray-50">
                <TableCell value={project.id} className="font-medium text-gray-900" />
                <TableCell value={project.company} className="text-gray-700" />
                <TableCell value={project.customerName} className="text-gray-700" />
                <TableCell value={project.contact_no} className="text-gray-700" />
                <TableCell value={project.address} className="text-gray-700" />
                <TableCell value={new Date(project.date).toLocaleDateString()} className="text-gray-700" />
                <TableCell value={project.projectType} className="text-gray-700" />
                <StatusBadge status={project.status} />
                <TableCell value={`₹${project.totalAmount.toLocaleString()}`} className="text-gray-700" />
                <TableCell value={`₹${project.paid.toLocaleString()}`} className="text-green-600" />
                <TableCell value={`₹${project.pending.toLocaleString()}`} className="text-red-600" />
                <ActionButtons
                  project={project}
                  activeDropdown={activeDropdown}
                  onDropdownToggle={handleDropdownToggle}
                  onAction={handleAction}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
