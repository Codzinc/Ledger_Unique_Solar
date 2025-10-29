import api from "../Config";

export const createZarorratProject = async (projectData) => {
  try {
    console.log('Sending Zarorrat project data to API:', projectData);
    const response = await api.post("/project/zarorrat-projects/create/", projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating Zarorrat project:', error);

    if (error.response) {
      console.error('Error response data:', error.response.data);
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

// ✅ Fetch all Zarorrat projects
// ZarorratApi.js mein getZarorratProjects function update karein
export const getZarorratProjects = async () => {
  try {
    const response = await api.get("/project/zarorrat-projects/");
    const projects = response.data;

    console.log('📋 RAW ZARORRAT PROJECTS FROM API:', projects);

    // ✅ ADD DATA TRANSFORMATION LIKE UNIQUE SOLAR
    const transformedProjects = (projects.results || projects).map(project => {
      const projectData = {
        ...project,
        company_name: "ZARORRAT.COM",
        project_type: "Service",
        total_amount: parseFloat(project.total_amount || project.amount || 0),
        paid: parseFloat(project.paid || project.advance_received || 0),
        pending: parseFloat(project.pending || (parseFloat(project.amount || 0) - parseFloat(project.advance_received || 0))),
        contact_number: project.contact_number || "-",
        // ✅ Use project_id as the primary identifier
        project_id: project.project_id,
        id: project.project_id, // Same as project_id for consistency
      };

      console.log(`🔄 TRANSFORMED ZARORRAT PROJECT: ${project.project_id}`, projectData);
      return projectData;
    });

    return transformedProjects;
  } catch (error) {
    console.error('❌ Error fetching Zarorrat projects:', error);
    throw error;
  }
};

// ✅ CORRECTED getZarorratProjectById function
export const getZarorratProjectById = async (projectId) => {
  try {
    console.log('🔍 FETCHING ZARORRAT PROJECT BY project_id:', projectId);
    const response = await api.get(`/project/zarorrat-projects/${projectId}/`);
    const project = response.data;

    console.log('✅ ZARORRAT PROJECT RAW DATA:', project);

    // ✅ FIX SERVICES DATA FOR FRONTEND - MULTIPLE SOURCES CHECK
    let services = [];
    
    // Check selected_services first (main source)
    if (project.selected_services && Array.isArray(project.selected_services)) {
      console.log("✅ USING SELECTED_SERVICES:", project.selected_services);
      services = project.selected_services.map(service => ({
        id: service.service,
        name: service.service_name,
        service_id: service.service
      }));
    }
    // Fallback to services array if exists
    else if (project.services && Array.isArray(project.services)) {
      console.log("✅ USING SERVICES ARRAY:", project.services);
      services = project.services;
    }
    
    console.log("🎯 FINAL SERVICES FOR FRONTEND:", services);

    return {
      ...project,
      services: services, // ✅ ADD SERVICES ARRAY FOR DISPLAY
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
    console.error('❌ Error fetching Zarorrat project:', error);
    throw error;
  }
};

// ✅ Corrected update function
export const updateZarorratProject = async (projectId, projectData) => {
  try {
    console.log('🔄 UPDATING ZARORRAT PROJECT:', projectId, projectData);
    const response = await api.put(`/project/zarorrat-projects/${projectId}/`, projectData);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating Zarorrat project:', error);
    throw error;
  }
};

// ✅ Corrected delete function
export const deleteZarorratProject = async (projectId) => {
  try {
    console.log('🗑️ DELETING ZARORRAT PROJECT:', projectId);
    const response = await api.delete(`/project/zarorrat-projects/${projectId}/`);
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting Zarorrat project:', error);
    throw error;
  }
};

export const getZarorratServices = async () => {
  try {
    const response = await api.get("/project/zarorrat-services/");
    return response.data;
  } catch (error) {
    console.error('Error fetching Zarorrat services:', error);
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
