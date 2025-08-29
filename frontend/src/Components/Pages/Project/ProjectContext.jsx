import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  getUniqueSolarProjects, 
  getZarorratProjects,
  deleteUniqueSolarProject,
  deleteZarorratProject 
} from "../../../ApiComps/Project/ProjectApi";

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    uniqueSolarProjects: 0,
    zarorratProjects: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load projects from API
  const loadProjects = async () => {
    try {
      setLoading(true);
      const [uniqueSolarProjects, zarorratProjects] = await Promise.all([
        getUniqueSolarProjects(),
        getZarorratProjects()
      ]);

      // Transform projects to common format
      const transformedProjects = [
        ...(uniqueSolarProjects.results || uniqueSolarProjects).map(project => ({
          ...project,
          company: 'UNIQUE SOLAR',
          projectType: project.project_type,
          totalAmount: parseFloat(project.grand_total || project.total_payment || 0),
          paid: parseFloat(project.advance_payment || 0),
          pending: parseFloat(project.completion_payment || 0),
          id: project.id || project.project_id
        })),
        ...(zarorratProjects.results || zarorratProjects).map(project => ({
          ...project,
          company: 'ZARORRAT.COM',
          projectType: 'Service',
          totalAmount: parseFloat(project.amount || 0),
          paid: parseFloat(project.advance_received || 0),
          pending: parseFloat(project.amount || 0) - parseFloat(project.advance_received || 0),
          id: project.id || project.project_id
        }))
      ];

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      // Determine project type and call appropriate API
      const project = projects.find(p => p.id === projectId);
      if (project) {
        if (project.company === 'UNIQUE SOLAR') {
          await deleteUniqueSolarProject(projectId);
        } else {
          await deleteZarorratProject(projectId);
        }
        
        // Reload projects after deletion
        await loadProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Update stats whenever projects change
  useEffect(() => {
    const newStats = {
      totalProjects: projects.length,
      uniqueSolarProjects: projects.filter((p) => p.company === "UNIQUE SOLAR").length,
      zarorratProjects: projects.filter((p) => p.company === "ZARORRAT.COM").length,
      totalValue: projects.reduce((sum, p) => sum + (p.totalAmount || 0), 0),
    };
    setStats(newStats);
  }, [projects]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        stats,
        loading,
        deleteProject,
        refreshProjects: loadProjects
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;