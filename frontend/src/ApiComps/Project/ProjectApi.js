// Correct imports - each API file se correct exports import karo
import { 
  getUniqueSolarProjects,
  deleteUniqueSolarProject 
} from './UniqueSolarApi';

import { 
  getZarorratProjects,
  deleteZarorratProject 
} from './ZarorratApi';

// Export directly without renaming
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
      getZarorratProjects() // Direct call without renaming
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