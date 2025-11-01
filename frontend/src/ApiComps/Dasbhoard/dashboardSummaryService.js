import api from '../Config';

export const getDashboardSummary = async (year) => {
    try {
        const response = await api.get(`/dashboard/summary/?year=${year}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};