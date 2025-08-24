import api from '../Config';

export const getZarorratData = async (year, month) => {
    try {
        const response = await api.get(`/dashboard/zarorrat/?year=${year}&month=${month}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
