import api from "../Config";

export const createUniqueSolarProject = async (formData) => {
  try {
    console.log('📤 Sending project data with images to API');
    const response = await api.post("/project/unique-solar-projects/create/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

// ✅ Fetch all projects
// UniqueSolarApi.js mein getUniqueSolarProjects function update karein
export const getUniqueSolarProjects = async () => {
  try {
    const response = await api.get("/project/unique-solar-projects/");
    const projects = response.data;

    console.log('📋 RAW UNIQUE SOLAR PROJECTS FROM API:', projects);

    const transformedProjects = (projects.results || projects).map(project => {
      // ✅ CORRECT ID MAPPING
      const projectData = {
        ...project,
        company_name: "UNIQUE SOLAR",
        project_type: project.project_type,
        total_amount: parseFloat(project.total_amount || project.grand_total || 0),
        paid: parseFloat(project.paid || project.advance_payment || 0),
        pending: parseFloat(project.pending || project.completion_payment || 0),
        contact_number: project.contact_number || project.contact_no || "-",
        // ✅ Use project_id as the primary identifier
        project_id: project.project_id,
        id: project.project_id, // Same as project_id for consistency
      };

      console.log(`🔄 TRANSFORMED PROJECT: ${project.project_id}`, projectData);
      return projectData;
    });

    return transformedProjects;
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    throw error;
  }
};

// ✅ Corrected getUniqueSolarProjectById
// UniqueSolarApi.js - getUniqueSolarProjectById update karo
export const getUniqueSolarProjectById = async (projectId) => {
  try {
    const response = await api.get(`/project/unique-solar-projects/${projectId}/`);
    const project = response.data;

    console.log('🔍 COMPLETE PROJECT DATA FROM API:', project);
    
    // ✅ TEMPORARY FIX: Agar checklist nahi hai to empty object set karo
    let checklistData = project.checklist || {};
    
    // Agar checklist_items hai but checklist nahi hai
    if (!project.checklist && project.checklist_items) {
      checklistData = {};
      project.checklist_items.forEach(item => {
        if (item.checklist && item.checklist.item_name) {
          const key = item.checklist.item_name.toLowerCase().replace(/\s+/g, '_');
          checklistData[key] = true;
        }
      });
    }

    console.log('🎯 FINAL CHECKLIST DATA:', checklistData);

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
      checklist: checklistData, // ✅ YEH ADD KARNA BOHOT IMPORTANT HAI
    };
  } catch (error) {
    console.error('❌ Error fetching project:', error);
    throw error;
  }
};
// ✅ Corrected update function
export const updateUniqueSolarProject = async (projectId, formData) => {
  try {
    console.log('🔄 UPDATING UNIQUE SOLAR PROJECT WITH IMAGES:', projectId);
    
    // ✅ ADD DETAILED DEBUG
    console.log('📦 UPDATE FORM DATA ENTRIES:');
    for (let pair of formData.entries()) {
      if (pair[0] === 'images') {
        console.log(`🖼️ ${pair[0]}: [File - ${pair[1].name}]`);
      } else if (pair[0] === 'products' || pair[0] === 'checklist_ids') {
        console.log(`📋 ${pair[0]}:`, JSON.parse(pair[1]));
      } else {
        console.log(`${pair[0]}:`, pair[1]);
      }
    }
    
    const response = await api.put(`/project/unique-solar-projects/${projectId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ FULL ERROR DETAILS:', error);
    console.error('❌ ERROR RESPONSE DATA:', error.response?.data);
    console.error('❌ ERROR STATUS:', error.response?.status);
    console.error('❌ ERROR HEADERS:', error.response?.headers);
    
    throw error;
  }
};

// ✅ Corrected delete function
export const deleteUniqueSolarProject = async (projectId) => {
  try {
    console.log('🗑️ DELETING UNIQUE SOLAR PROJECT:', projectId);
    const response = await api.delete(`/project/unique-solar-projects/${projectId}/`);
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting Unique Solar project:', error);
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
  getChecklistItems,
};
