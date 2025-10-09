import api from "../Config";

// ----------------------------
// CREATE PROJECT
// ----------------------------
export const createUniqueSolarProject = async (projectData) => {
  try {
    console.log('Sending project data to API:', projectData);
    const response = await api.post("/project/unique-solar-projects/create/", projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    
    if (error.response) {
      const errorData = error.response.data;
      let errorMessage = 'Validation failed: ';
      
      if (typeof errorData === 'object') {
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          Object.keys(errorData).forEach(field => {
            const fieldErrors = errorData[field];
            if (Array.isArray(fieldErrors)) {
              errorMessage += `${field}: ${fieldErrors.join(', ')}. `;
            } else if (typeof fieldErrors === 'string') {
              errorMessage += `${field}: ${fieldErrors}. `;
            } else if (typeof fieldErrors === 'object') {
              Object.keys(fieldErrors).forEach(nestedField => {
                const nestedErrors = fieldErrors[nestedField];
                if (Array.isArray(nestedErrors)) {
                  errorMessage += `${field}.${nestedField}: ${nestedErrors.join(', ')}. `;
                } else {
                  errorMessage += `${field}.${nestedField}: ${nestedErrors}. `;
                }
              });
            } else {
              errorMessage += `${field}: Validation error. `;
            }
          });
        }
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
      
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('No response received from server. Please check your connection.');
    } else {
      throw new Error('Error setting up the request: ' + error.message);
    }
  }
};

// ----------------------------
// GET ALL PROJECTS (with mapping)
// ----------------------------
export const getUniqueSolarProjects = async () => {
  try {
    const response = await api.get("/project/unique-solar-projects/");
    const projects = response.data;

    // ----------------------------
    // TRANSFORM PROJECTS FOR FRONTEND
    // ----------------------------
    const transformedProjects = (projects.results || projects).map(project => ({
      ...project,
      company_name: "UNIQUE SOLAR",
      project_type: project.project_type,
      total_amount: parseFloat(project.total_amount || project.grand_total || 0),
      paid: parseFloat(project.paid || project.advance_payment || 0),
      pending: parseFloat(project.pending || project.completion_payment || 0),
      contact_number: project.contact_number || project.contact_no || "-",
      project_id: project.project_id || project.id,
      id: `unique-${project.id || project.project_id}`,
    }));

    return transformedProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// ----------------------------
// GET SINGLE PROJECT BY ID
// ----------------------------
export const getUniqueSolarProjectById = async (id) => {
  try {
    const response = await api.get(`/project/unique-solar-projects/${id}/`);
    const project = response.data;

    // Optional: map single project
    return {
      ...project,
      company_name: "UNIQUE SOLAR",
      project_type: project.project_type,
      total_amount: parseFloat(project.total_amount || project.grand_total || 0),
      paid: parseFloat(project.paid || project.advance_payment || 0),
      pending: parseFloat(project.pending || project.completion_payment || 0),
      contact_number: project.contact_number || project.contact_no || "-",
      project_id: project.project_id || project.id,
      id: `unique-${project.id || project.project_id}`,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

// ----------------------------
// UPDATE PROJECT
// ----------------------------
export const updateUniqueSolarProject = async (id, projectData) => {
  try {
    const response = await api.put(`/project/unique-solar-projects/${id}/`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// ----------------------------
// DELETE PROJECT
// ----------------------------
export const deleteUniqueSolarProject = async (id) => {
  try {
    const response = await api.delete(`/project/unique-solar-projects/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// ----------------------------
// GET CHECKLIST ITEMS
// ----------------------------
export const getChecklistItems = async () => {
  try {
    const response = await api.get("/project/unique-solar-checklist/");
    return response.data;
  } catch (error) {
    console.error('Error fetching checklist items:', error);
    throw error;
  }
};

// ----------------------------
// EXPORT DEFAULT
// ----------------------------
export default {
  createUniqueSolarProject,
  getUniqueSolarProjects,
  getUniqueSolarProjectById,
  updateUniqueSolarProject,
  deleteUniqueSolarProject,
  getChecklistItems,
};
