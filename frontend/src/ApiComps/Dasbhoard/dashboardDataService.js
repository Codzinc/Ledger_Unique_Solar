import api from '../Config';

export const getDashboardData = async (year) => {
    try {
        const response = await api.get(`/dashboard/data/?year=${year}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};