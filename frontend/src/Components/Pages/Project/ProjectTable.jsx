import React, { useState, useMemo, useEffect } from "react";
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import {
  getUniqueSolarProjects,
  getZarorratProjects,
} from "../../../ApiComps/Project/ProjectApi";

// Component for the table header
const TableHeader = ({ onSort, sortConfig }) => {
  const headers = [
    { key: "project_id", label: "Project ID" },
    { key: "company_name", label: "Company" },
    { key: "customer_name", label: "Customer Name" },
    { key: "contact_number", label: "Contact No" },
    { key: "address", label: "Address" },
    { key: "date", label: "Date" },
    { key: "project_type", label: "Project Type" },
    { key: "status", label: "Status" },
    { key: "total_amount", label: "Total Amount" },
    { key: "paid", label: "Paid" },
    { key: "pending", label: "Pending" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <thead className="bg-[#181829] text-white whitespace-nowrap text-xs uppercase tracking-wider">
      <tr>
        {headers.map((head) => (
          <th
            key={head.key}
            className={`px-6 py-4 ${
              head.key === "actions"
                ? "text-right"
                : "cursor-pointer hover:bg-[#2a2a3d]"
            }`}
            onClick={() => head.key !== "actions" && onSort(head.key)}
          >
            <div className="flex items-center">
              {head.label}
              {sortConfig.key === head.key && (
                <span className="ml-1">
                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

// Component for action buttons
const ActionButtons = ({
  project,
  activeDropdown,
  onDropdownToggle,
  onAction,
}) => (
  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDropdownToggle(project.id);
      }}
      className="text-gray-400 hover:text-gray-600"
    >
      <MoreVertical className="h-5 w-5" />
    </button>
    {activeDropdown === project.id && (
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-1">
          {[
            { action: "view", label: "View Details", icon: Eye },
            { action: "edit", label: "Edit", icon: Edit },
            { action: "delete", label: "Delete", icon: Trash2, danger: true },
          ].map(({ action, label, icon: Icon, danger }) => (
            <button
              key={action}
              onClick={(e) => {
                e.stopPropagation();
                onAction(action, project);
              }}
              className={`flex items-center px-4 py-2 text-sm w-full hover:bg-gray-100 ${
                danger ? "text-red-600" : "text-gray-700"
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
const TableCell = ({ value, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>
    {value || "-"}
  </td>
);

// Component for status badge
const StatusBadge = ({ status }) => {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
  };

  const statusText = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    draft: "Draft",
  };

  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  const statusClass =
    statusClasses[status?.toLowerCase()] || statusClasses.draft;

  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`${baseClasses} ${statusClass}`}>
        {statusText[status?.toLowerCase()] || status || "Draft"}
      </span>
    </td>
  );
};

const ProjectTable = ({
  searchTerm,
  filters,
  dateFilter,
  onViewProject,
  onEditProject,
  onDeleteProject,
  refreshTrigger,
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

    useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container") && !e.target.closest("button")) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  

  // ✅ Local helper for refreshing project list after delete
  const refreshProjects = async () => {
    try {
      setLoading(true);
      const [uniqueSolarProjects, zarorratProjects] = await Promise.all([
        getUniqueSolarProjects(),
        getZarorratProjects(),
      ]);

      // ✅ Merge + normalize both sources
      const allProjects = [
        ...(uniqueSolarProjects.results || uniqueSolarProjects).map((p) => ({
          ...p,
          company_name: "UNIQUE SOLAR",
          project_type: p.project_type,
          total_amount: parseFloat(p.total_amount || p.grand_total || 0),
          paid: parseFloat(p.paid || p.advance_payment || 0),
          pending: parseFloat(p.pending || p.completion_payment || 0),
          contact_number: p.contact_number || p.contact_no || "-",
          project_id: p.project_id,
          id: p.project_id,
        })),
        ...(zarorratProjects.results || zarorratProjects).map((p) => ({
          ...p,
          company_name: "ZARORRAT.COM",
          project_type: "Service",
          total_amount: parseFloat(p.total_amount || p.amount || 0),
          paid: parseFloat(p.paid || p.advance_received || 0),
          pending:
            parseFloat(p.pending) ||
            parseFloat(p.amount || 0) - parseFloat(p.advance_received || 0),
          contact_number: p.contact_number || "-",
          project_id: p.project_id,
          id: p.project_id,
        })),
      ];

      setProjects(allProjects);
    } catch (err) {
      console.error("❌ Error loading projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load on mount + whenever refreshTrigger changes
  useEffect(() => {
    refreshProjects();
  }, [refreshTrigger]);

  // ✅ Delete handler (removes project instantly from table)
  const handleProjectDelete = async (project) => {
    try {
      await onDeleteProject(project); // run delete logic from parent (API + context)
      setProjects((prev) =>
        prev.filter(
          (p) => p.project_id !== project.project_id && p.id !== project.id
        )
      );
    } catch (err) {
      console.error("❌ Local delete failed:", err);
    }
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key, direction });
  };

  const handleDropdownToggle = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const handleAction = (action, project) => {
    setActiveDropdown(null);
    if (action === "view") onViewProject(project);
    else if (action === "edit") onEditProject(project);
    else if (action === "delete") handleProjectDelete(project);
  };


  const filteredProjects = useMemo(() => {
    if (!projects.length) return [];

    return projects.filter((project) => {
      const term = searchTerm?.toLowerCase() || "";
      const searchFields = [
        project.customer_name || "",
        project.project_id || "",
        project.company_name || "",
        project.contact_number || "",
        project.address || "",
      ];

      const matchesSearch = searchFields.some(
        (field) => field && field.toString().toLowerCase().includes(term)
      );

      const matchesCompany =
        filters.company === "All Companies" ||
        project.company_name === filters.company;

      const matchesType =
        filters.projectType === "All Types" ||
        (project.project_type &&
          project.project_type
            .toLowerCase()
            .includes(filters.projectType.toLowerCase()));

      const matchesStatus =
        filters.status === "All Status" ||
        (project.status &&
          project.status.toLowerCase() === filters.status.toLowerCase());

      const matchesDate =
        !dateFilter || (project.date && project.date.startsWith(dateFilter));

      return (
        matchesSearch &&
        matchesCompany &&
        matchesType &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [projects, searchTerm, filters, dateFilter]);

  const sortedProjects = useMemo(() => {
    if (!filteredProjects.length) return [];

    return [...filteredProjects].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Handle different data types
      if (typeof valA === "string" && valA) valA = valA.toLowerCase();
      if (typeof valB === "string" && valB) valB = valB.toLowerCase();

      if (valA == null) return sortConfig.direction === "asc" ? 1 : -1;
      if (valB == null) return sortConfig.direction === "asc" ? -1 : 1;

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProjects, sortConfig]);

  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, dateFilter]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8f276] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-red-500 text-lg">Error loading projects</div>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 px-4 py-2 bg-[#181829] text-white rounded-lg hover:bg-[#d8f276] hover:text-[#181829] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-full text-left">
          <TableHeader onSort={handleSort} sortConfig={sortConfig} />
          <tbody className="divide-y divide-gray-200">
            {paginatedProjects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={(e) => {
                  if (!e.target.closest("button")) {
                    onViewProject(project);
                  }
                }}
              >
                <TableCell
                  value={project.project_id}
                  className="font-medium text-gray-900"
                />
                <TableCell
                  value={project.company_name}
                  className="text-gray-700"
                />
                <TableCell
                  value={project.customer_name}
                  className="text-gray-700"
                />
                <TableCell value={project.contact_number} />

                <TableCell value={project.address} className="text-gray-700" />
                <TableCell
                  value={
                    project.date
                      ? new Date(project.date).toLocaleDateString()
                      : "-"
                  }
                  className="text-gray-700"
                />
                <TableCell
                  value={project.project_type}
                  className="text-gray-700"
                />
                <StatusBadge status={project.status} />
                <TableCell
                  value={`${parseFloat(
                    project.total_amount || 0
                  ).toLocaleString("en-IN")}`}
                />
                <TableCell
                  value={`${parseFloat(project.paid || 0).toLocaleString(
                    "en-IN"
                  )}`}
                />
                <TableCell
                  value={`${parseFloat(project.pending || 0).toLocaleString(
                    "en-IN"
                  )}`}
                />

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

        {paginatedProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found</p>
            <p className="text-gray-400 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, sortedProjects.length)} of{" "}
            {sortedProjects.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                  currentPage === page
                    ? "bg-[#181829] text-white border-[#181829]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;
