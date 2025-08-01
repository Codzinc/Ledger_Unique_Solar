import React, { useState } from 'react';
import { ProjectProvider, useProjects } from './ProjectContext';
import ProjectHeader from './ProjectHeader';
import ProjectStats from './ProjectStats';
import ProjectFilters from './ProjectFilters';
import ProjectTable from './ProjectTable';
import AddProjectModal from './AddProjectModal';
import UniqueSolarForm from './UniqueSolarForm';
import ZarorratForm from './ZarorratForm';
import ViewProject from './ViewProject';

const ProjectContent = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters, setFilters] = useState({
    company: 'All Companies',
    projectType: 'All Types',
    status: 'All Status'
  });

  const { projects, stats, addProject, updateProject, deleteProject } = useProjects();

  const handleAddProject = () => {
    setShowAddModal(true);
  };

  const handleProjectTypeSelect = (type) => {
    setSelectedProjectType(type);
    setShowAddModal(false);
    setShowProjectForm(true);
  };

  const handleBackToProjects = () => {
    setShowProjectForm(false);
    setSelectedProjectType('');
    setSelectedProject(null);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setSelectedProjectType(project.company === 'UNIQUE SOLAR' ? 'unique-solar' : 'zarorrat');
    setShowProjectForm(true);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      setSelectedProject(null);
    }
  };

  const handleProjectSubmit = (formData) => {
    if (selectedProject) {
      updateProject(selectedProject.id, formData);
    } else {
      addProject(formData, selectedProjectType);
    }
    handleBackToProjects();
  };

  if (showProjectForm) {
    return (
      <div className="min-h-screen bg-gray-100">
        {selectedProjectType === 'unique-solar' ? (
          <UniqueSolarForm 
            onBack={handleBackToProjects} 
            onSubmit={handleProjectSubmit}
            initialData={selectedProject}
          />
        ) : (
          <ZarorratForm 
            onBack={handleBackToProjects} 
            onSubmit={handleProjectSubmit}
            initialData={selectedProject}
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
        />
        
        <ProjectStats stats={stats} />
        
        <ProjectFilters
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        <ProjectTable
          projects={projects}
          searchTerm={searchTerm}
          filters={filters}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
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