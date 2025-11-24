import api from '../Config';

export const getDailyDashboardData = async (month, year) => {
    try {
        const response = await api.get(`/dashboard/daily/?month=${month}&year=${year}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
