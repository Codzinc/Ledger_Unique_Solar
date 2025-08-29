import api from "../Config";

export const createUniqueSolarProject = async (projectData) => {
  try {
    console.log('Sending project data to API:', projectData);
    
    const response = await api.post("/project/unique-solar-projects/create/", projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    
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

// Other API functions
export const getUniqueSolarProjects = async () => {
  try {
    const response = await api.get("/project/unique-solar-projects/");
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getUniqueSolarProjectById = async (id) => {
  try {
    const response = await api.get(`/project/unique-solar-projects/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const updateUniqueSolarProject = async (id, projectData) => {
  try {
    const response = await api.put(`/project/unique-solar-projects/${id}/`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteUniqueSolarProject = async (id) => {
  try {
    const response = await api.delete(`/project/unique-solar-projects/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const getChecklistItems = async () => {
  try {
    const response = await api.get("/project/unique-solar-checklist/");
    return response.data;
  } catch (error) {
    console.error('Error fetching checklist items:', error);
    throw error;
  }
};

export default {
  createUniqueSolarProject,
  getUniqueSolarProjects,
  getUniqueSolarProjectById,
  updateUniqueSolarProject,
  deleteUniqueSolarProject,
  getChecklistItems
};