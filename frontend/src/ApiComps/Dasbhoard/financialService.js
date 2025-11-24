import api from '../Config';

export const getFinancialData = async () => {
    try {
        const response = await api.get('/dashboard/financial/');
        return response.data;
    } catch (error) {
        throw error;
    }
};
