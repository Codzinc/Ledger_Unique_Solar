import React, { createContext, useContext, useState, useEffect } from 'react';
import { sampleProjects } from './SampleProjects';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(sampleProjects);
  const [stats, setStats] = useState({
    totalProjects: 0,
    uniqueSolarProjects: 0,
    zarorratProjects: 0,
    totalValue: 0
  });

  // Generate unique project ID
  const generateProjectId = (company) => {
    const prefix = company === 'UNIQUE SOLAR' ? 'USL' : 'ZRC';
    const year = new Date().getFullYear();
    const currentCount = projects.filter(p => p.company === company).length + 1;
    const paddedCount = String(currentCount).padStart(3, '0');
    return `${prefix}-${year}-${paddedCount}`;
  };

  // Add new project
  const addProject = (formData, formType) => {
    const company = formType === 'unique-solar' ? 'UNIQUE SOLAR' : 'ZARORRAT.COM';
    const newProject = {
      ...formData,
      id: generateProjectId(company),
      company,
      status: 'DRAFT',
      date: formData.date || new Date().toISOString().split('T')[0],
      totalAmount: parseFloat(formData.amount || 0),
      paid: parseFloat(formData.advancePayment || formData.advanceReceived || 0),
      pending: parseFloat(formData.amount || 0) - parseFloat(formData.advancePayment || formData.advanceReceived || 0)
    };

    setProjects(prev => [...prev, newProject]);
  };

  // Update project
  const updateProject = (projectId, updatedData) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            ...updatedData,
            totalAmount: parseFloat(updatedData.amount || 0),
            paid: parseFloat(updatedData.advancePayment || updatedData.advanceReceived || 0),
            pending: parseFloat(updatedData.amount || 0) - parseFloat(updatedData.advancePayment || updatedData.advanceReceived || 0)
          }
        : project
    ));
  };

  // Delete project
  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  // Update stats whenever projects change
  useEffect(() => {
    const newStats = {
      totalProjects: projects.length,
      uniqueSolarProjects: projects.filter(p => p.company === 'UNIQUE SOLAR').length,
      zarorratProjects: projects.filter(p => p.company === 'ZARORRAT.COM').length,
      totalValue: projects.reduce((sum, p) => sum + (parseFloat(p.totalAmount) || 0), 0)
    };
    setStats(newStats);
  }, [projects]);

  return (
    <ProjectContext.Provider value={{
      projects,
      stats,
      addProject,
      updateProject,
      deleteProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;
