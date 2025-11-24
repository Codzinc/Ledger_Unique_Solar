import api from "../Config";

export const createZarorratProject = async (projectData) => {
  try {
    const response = await api.post("/project/zarorrat-projects/create/", projectData);
    return response.data;
  } catch (error) {

    if (error.response) {
      const validationErrors = error.response.data;
      let errorMessage = 'Validation failed: ';

      Object.keys(validationErrors).forEach(field => {
        errorMessage += `${field}: ${validationErrors[field].join(', ')}. `;
      });

      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('No response received from server. Please check your connection.');
    } else {
      throw new Error('Error setting up the request: ' + error.message);
    }
  }
};

export const getZarorratProjects = async () => {
  try {
    const response = await api.get("/project/zarorrat-projects/");
    const projects = response.data;

    const transformedProjects = (projects.results || projects).map(project => {
      const projectData = {
        ...project,
        company_name: "ZARORRAT.COM",
        project_type: "Service",
        total_amount: parseFloat(project.total_amount || project.amount || 0),
        paid: parseFloat(project.paid || project.advance_received || 0),
        pending: parseFloat(project.pending || (parseFloat(project.amount || 0) - parseFloat(project.advance_received || 0))),
        contact_number: project.contact_number || "-",
        project_id: project.project_id,
        id: project.project_id, 
      };

      return projectData;
    });

    return transformedProjects;
  } catch (error) {
    throw error;
  }
};

export const getZarorratProjectById = async (projectId) => {
  try {
    const response = await api.get(`/project/zarorrat-projects/${projectId}/`);
    const project = response.data;

    let services = [];
    
    if (project.selected_services && Array.isArray(project.selected_services)) {
      services = project.selected_services.map(service => ({
        id: service.service,
        name: service.service_name,
        service_id: service.service
      }));
    }
    else if (project.services && Array.isArray(project.services)) {
      services = project.services;
    }
    
    return {
      ...project,
      services: services, 
      company_name: "ZARORRAT.COM",
      project_type: "Service",
      total_amount: parseFloat(project.total_amount || project.amount || 0),
      paid: parseFloat(project.paid || project.advance_received || 0),
      pending: parseFloat(project.pending || (parseFloat(project.amount || 0) - parseFloat(project.advance_received || 0))),
      contact_number: project.contact_number || "-",
      project_id: project.project_id,
      id: project.project_id,
    };
  } catch (error) {
    throw error;
  }
};

export const updateZarorratProject = async (projectId, projectData) => {
  try {
    const response = await api.put(`/project/zarorrat-projects/${projectId}/`, projectData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteZarorratProject = async (projectId) => {
  try {
    const response = await api.delete(`/project/zarorrat-projects/${projectId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getZarorratServices = async () => {
  try {
    const response = await api.get("/project/zarorrat-services/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  createZarorratProject,
  getZarorratProjects,
  getZarorratProjectById,
  updateZarorratProject,
  deleteZarorratProject,
  getZarorratServices,
};
