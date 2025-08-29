import api from "../Config";

export const createZarorratProject  = async (projectData) => {
  try {
    console.log('Sending Zarorrat project data to API:', projectData);
    
    const response = await api.post("/project/zarorrat-projects/create/", projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating Zarorrat project:', error);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
      
      // Extract validation errors from response
      const validationErrors = error.response.data;
      let errorMessage = 'Validation failed: ';
      
      Object.keys(validationErrors).forEach(field => {
        errorMessage += `${field}: ${validationErrors[field].join(', ')}. `;
      });
      
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response received from server. Please check your connection.');
    } else {
      console.error('Error message:', error.message);
      throw new Error('Error setting up the request: ' + error.message);
    }
  }
};

export const getZarorratProjects  = async () => {
  try {
    const response = await api.get("/project/zarorrat-projects/");
    return response.data;
  } catch (error) {
    console.error('Error fetching Zarorrat projects:', error);
    throw error;
  }
};

export const getZarorratProjectById  = async (id) => {
  try {
    const response = await api.get(`/project/zarorrat-projects/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Zarorrat project:', error);
    throw error;
  }
};

export const updateZarorratProject   = async (id, projectData) => {
  try {
    const response = await api.put(`/project/zarorrat-projects/${id}/`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error updating Zarorrat project:', error);
    throw error;
  }
};

export const deleteZarorratProject    = async (id) => {
  try {
    const response = await api.delete(`/project/zarorrat-projects/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting Zarorrat project:', error);
    throw error;
  }
};

export const getZarorratServices  = async () => {
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
  getZarorratProjects, // ✅ This must be included
  getZarorratProjectById,
  updateZarorratProject,
  deleteZarorratProject, // ✅ This must be included
  getZarorratServices
};

