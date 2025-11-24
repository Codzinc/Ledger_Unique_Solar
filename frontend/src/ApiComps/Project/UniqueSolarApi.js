import api from "../Config";

export const createUniqueSolarProject = async (formData) => {
  try {
    const response = await api.post("/project/unique-solar-projects/create/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {

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

export const getUniqueSolarProjects = async () => {
  try {
    const response = await api.get("/project/unique-solar-projects/");
    const projects = response.data;
    const transformedProjects = (projects.results || projects).map(project => {
      const projectData = {
        ...project,
        company_name: "UNIQUE SOLAR",
        project_type: project.project_type,
        total_amount: parseFloat(project.total_amount || project.grand_total || 0),
        paid: parseFloat(project.paid || project.advance_payment || 0),
        pending: parseFloat(project.pending || project.completion_payment || 0),
        contact_number: project.contact_number || project.contact_no || "-",
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

export const getUniqueSolarProjectById = async (projectId) => {
  try {
    const response = await api.get(`/project/unique-solar-projects/${projectId}/`);
    const project = response.data;

    let checklistData = project.checklist || {};
    
    if (!project.checklist && project.checklist_items) {
      checklistData = {};
      project.checklist_items.forEach(item => {
        if (item.checklist && item.checklist.item_name) {
          const key = item.checklist.item_name.toLowerCase().replace(/\s+/g, '_');
          checklistData[key] = true;
        }
      });
    }

    return {
      ...project,
      company_name: "UNIQUE SOLAR",
      project_type: project.project_type,
      total_amount: parseFloat(project.total_amount || project.grand_total || 0),
      paid: parseFloat(project.paid || project.advance_payment || 0),
      pending: parseFloat(project.pending || project.completion_payment || 0),
      contact_number: project.contact_number || "-",
      project_id: project.project_id,
      id: project.project_id,
      checklist: checklistData, 
    };
  } catch (error) {
    throw error;
  }
};

export const updateUniqueSolarProject = async (projectId, formData) => {
  try {
    const response = await api.put(
      `/project/unique-solar-projects/${projectId}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUniqueSolarProject = async (projectId) => {
  try {
    const response = await api.delete(`/project/unique-solar-projects/${projectId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChecklistItems = async () => {
  try {
    const response = await api.get("/project/unique-solar-checklist/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  createUniqueSolarProject,
  getUniqueSolarProjects,
  getUniqueSolarProjectById,
  updateUniqueSolarProject,
  deleteUniqueSolarProject,
  getChecklistItems,
};
