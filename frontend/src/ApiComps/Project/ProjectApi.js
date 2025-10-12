import { 
  getUniqueSolarProjects,
  deleteUniqueSolarProject 
} from './UniqueSolarApi';

import { 
  getZarorratProjects,
  deleteZarorratProject 
} from './ZarorratApi';

export { 
  getUniqueSolarProjects, 
  getZarorratProjects,
  deleteUniqueSolarProject,
  deleteZarorratProject
};

export const getAllProjects = async () => {
  try {
    const [uniqueSolarProjects, zarorratProjects] = await Promise.all([
      getUniqueSolarProjects(),
      getZarorratProjects()
    ]);

    return {
      uniqueSolar: uniqueSolarProjects,
      zarorrat: zarorratProjects
    };
  } catch (error) {
    console.error('Error fetching all projects:', error);
    throw error;
  }
};

export default {
  getUniqueSolarProjects,
  getZarorratProjects,
  deleteUniqueSolarProject,
  deleteZarorratProject,
  getAllProjects
};
