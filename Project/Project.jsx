import React, { useState } from 'react';
import { SampleProjects } from './SampleProjects';
import AddProject from './AddProject';
import ProjectListing from './ProjectListing';
import ViewProject from './ViewProject';

const Project = () => {
  const [projects, setProjects] = useState(SampleProjects);
  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleAddProject = (projectData, action) => {
    if (action === 'edit') {
      setProjects(projects.map(project => 
        project.id === projectData.id ? projectData : project
      ));
      setEditingProject(null);
    } else {
      setProjects([...projects, projectData]);
    }
    setShowAddProject(false);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setSelectedProject(null);
    setShowProjectDetail(false);
    setShowAddProject(true);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== projectId));
    }
  };

  const getNextSrNo = () => {
    return projects.length > 0 ? Math.max(...projects.map(p => p.srNo)) + 1 : 1;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
       

        {/* Main Content */}
        <ProjectListing
          projects={projects}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onAddProject={() => setShowAddProject(true)}
        />

        {/* Modals */}
        {showAddProject && (
          <AddProject
            onAddProject={handleAddProject}
            onClose={() => {
              setShowAddProject(false);
              setEditingProject(null);
            }}
            nextSrNo={getNextSrNo()}
            editProject={editingProject}
          />
        )}

        {showProjectDetail && selectedProject && (
          <ViewProject
            project={selectedProject}
            onClose={() => setShowProjectDetail(false)}
            onEdit={handleEditProject}
          />
        )}
      </div>
    </div>
  );
};

export default Project;