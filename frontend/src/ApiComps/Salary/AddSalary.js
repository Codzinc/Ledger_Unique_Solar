import api from '../Config';

export const salaryApi = {
  getAllSalaries: async () => {
    try {
      const response = await api.get('/salary/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createDailyWage: async (data) => {
    try {
      const response = await api.post('/salary/daily-wage/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createMonthlySalary: async (data) => {
    try {
      // Ensure data is properly formatted before sending
      const formattedData = {
        ...data,
        date: data.date || `${data.month}-01`,
        salary_amount: parseFloat(data.salary_amount),
        total_advance_taken: parseFloat(data.total_advance_taken) || 0,
        remaining_salary: parseFloat(data.remaining_salary) || parseFloat(data.salary_amount),
        status: data.status || "Active",
        month: data.month || data.date?.substring(0, 7)
      };

      const response = await api.post('/salary/monthly-salary/', formattedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

updateSalary: async (id, data) => {
  try {
    const response = await api.put(`/salary/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},


  deleteSalary: async (id) => {
    try {
      await api.delete(`/salary/${id}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
