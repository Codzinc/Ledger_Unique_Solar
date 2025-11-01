import React, { useState, useEffect } from "react";
import { ProjectProvider, useProjects } from "./ProjectContext";
import ProjectHeader from "./ProjectHeader";
import ProjectStats from "./ProjectStats";
import ProjectFilters from "./ProjectFilters";
import ProjectTable from "./ProjectTable";
import AddProjectModal from "./AddProjectModal";
import UniqueSolarForm from "./UniqueSolarForm";
import ZarorratForm from "./ZarorratForm";
import ViewProject from "./ViewProject";

import {
  getUniqueSolarProjectById,
  deleteUniqueSolarProject,
} from "../../../ApiComps/Project/UniqueSolarApi";

import {
  getZarorratProjectById,
  deleteZarorratProject,
} from "../../../ApiComps/Project/ZarorratApi";

const ProjectContent = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [filters, setFilters] = useState({
    company: "All Companies",
    projectType: "All Types",
    status: "All Status",
  });
  const [isLoadingProject, setIsLoadingProject] = useState(false);

  const { projects, stats, deleteProject, refreshProjects } = useProjects();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadFullProjectDetails = async (project) => {
    try {
      setIsLoadingProject(true);
      let fullProject;
      const projectId = project.project_id || project.id;

      const isUniqueSolar =
        project.company_name === "UNIQUE SOLAR" ||
        project.company === "UNIQUE SOLAR";

      if (isUniqueSolar) {
        fullProject = await getUniqueSolarProjectById(projectId);
        if (
          fullProject.checklist &&
          typeof fullProject.checklist === "object"
        ) {
        } else {
          fullProject.checklist = {};
        }

        if (!fullProject.products || !Array.isArray(fullProject.products)) {
          fullProject.products = [];
        }

        if (!fullProject.images || !Array.isArray(fullProject.images)) {
          fullProject.images = [];
        }
      } else {
        fullProject = await getZarorratProjectById(projectId);

        if (
          fullProject.selected_services &&
          Array.isArray(fullProject.selected_services)
        ) {
          fullProject.services = fullProject.selected_services
            .map((service) => ({
              id: service.service?.id,
              name: service.service?.name || `Service ${service.service?.id}`,
            }))
            .filter((service) => service.id);
        } else {
          fullProject.services = [];
        }
      }

      setSelectedProject(fullProject);
    } catch (error) {
      setSelectedProject(project);
    } finally {
      setIsLoadingProject(false);
    }
  };

  const handleAddProject = () => {
    setShowAddModal(true);
  };

  const handleProjectTypeSelect = (type) => {
    setSelectedProjectType(type);
    setShowAddModal(false);
    setShowProjectForm(true);
    setSelectedProject(null);
  };

  const handleBackToProjects = () => {
    setShowProjectForm(false);
    setSelectedProjectType("");
    setSelectedProject(null);
    refreshProjects();
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleViewProject = async (project) => {
    await loadFullProjectDetails(project);
  };

  const handleEditProject = async (project) => {
    await loadFullProjectDetails(project);
    setSelectedProjectType(
      project.company_name === "UNIQUE SOLAR" ||
        project.company === "UNIQUE SOLAR"
        ? "unique-solar"
        : "zarorrat"
    );
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (project) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      try {
        const projectId = project.project_id || project.id;

        if (
          project.company_name === "UNIQUE SOLAR" ||
          project.company === "UNIQUE SOLAR"
        ) {
          await deleteUniqueSolarProject(projectId);
        } else {
          await deleteZarorratProject(projectId);
        }

        setSelectedProject(null);
        deleteProject(projectId);

        setRefreshTrigger((prev) => prev + 1);

        alert("Project deleted successfully!");
      } catch (error) {
        alert(
          "Error deleting project: " +
            (error.response?.data?.detail || error.message)
        );
      }
    }
  };

  const handleProjectSubmit = () => {
    handleBackToProjects();
  };

  const handleDateFilterChange = (date) => {
    setDateFilter(date);
  };

  if (showProjectForm) {
    return (
      <div className="min-h-screen bg-gray-100">
        {selectedProjectType === "unique-solar" ? (
          <UniqueSolarForm
            onBack={handleBackToProjects}
            onSubmit={handleProjectSubmit}
            initialData={selectedProject}
            isEdit={!!selectedProject}
          />
        ) : (
          <ZarorratForm
            onBack={handleBackToProjects}
            onSubmit={handleProjectSubmit}
            initialData={selectedProject}
            isEdit={!!selectedProject}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        <ProjectHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddProject={handleAddProject}
          onDateFilterChange={handleDateFilterChange}
        />

        <ProjectStats stats={stats} />

        <ProjectFilters filters={filters} onFiltersChange={setFilters} />

        <ProjectTable
          projects={projects}
          searchTerm={searchTerm}
          filters={filters}
          dateFilter={dateFilter}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          refreshTrigger={refreshTrigger}
        />

        {showAddModal && (
          <AddProjectModal
            onClose={handleCloseModal}
            onSelectType={handleProjectTypeSelect}
          />
        )}

        {selectedProject && !showProjectForm && (
          <ViewProject
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        )}

        {/* Loading Overlay */}
        {isLoadingProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#d8f276]"></div>
              <p className="text-gray-700">Loading project details...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Project = () => (
  <ProjectProvider>
    <ProjectContent />
  </ProjectProvider>
);

export default Project;
