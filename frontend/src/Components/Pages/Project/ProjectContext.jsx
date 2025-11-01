import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getUniqueSolarProjects,
  getZarorratProjects,
  deleteUniqueSolarProject,
  deleteZarorratProject,
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
        getZarorratProjects(),
      ]);

      // Transform projects to common format
      const transformedProjects = [
        ...(uniqueSolarProjects.results || uniqueSolarProjects).map(
          (project) => ({
            ...project,
            company: "UNIQUE SOLAR",
            projectType: project.project_type,
            total_amount: parseFloat(
              project.total_amount || project.grand_total || 0
            ),
            paid: parseFloat(project.paid || project.advance_payment || 0),
            pending: parseFloat(
              project.pending || project.completion_payment || 0
            ),
            contact_number: project.contact_number || project.contact_no || "-",
            id: project.id || project.project_id,
          })
        ),
        // ✅ UPDATE THE ZARORRAT PROJECT TRANSFORMATION IN ProjectContext.js
        ...(zarorratProjects.results || zarorratProjects).map((project) => ({
          ...project,
          company: "ZARORRAT.COM",
          projectType: "Service",
          total_amount: parseFloat(project.amount || 0),
          paid: parseFloat(project.advance_received || 0),
          pending:
            parseFloat(project.amount || 0) -
            parseFloat(project.advance_received || 0),
          id: project.id || project.project_id,
          services: project.selected_services
            ? project.selected_services.map((service) => ({
                id: service.service,
                name: service.service_name,
                service_id: service.service,
              }))
            : [],
        })),
      ];

      setProjects(transformedProjects);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = (projectId) => {
    setProjects((prevProjects) =>
      prevProjects.filter(
        (p) => p.project_id !== projectId && p.id !== projectId
      )
    );
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const newStats = {
      totalProjects: projects.length,
      uniqueSolarProjects: projects.filter((p) => p.company === "UNIQUE SOLAR")
        .length,
      zarorratProjects: projects.filter((p) => p.company === "ZARORRAT.COM")
        .length,
      totalValue: projects.reduce((sum, p) => sum + (p.total_amount || 0), 0),
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
        refreshProjects: loadProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;
