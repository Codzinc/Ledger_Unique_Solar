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
      const backendData = {
        employee: data.employeeName || data.employee,
        date: data.date,
        description: data.serviceDescription || data.description,
        wage_type: 'Daily'
      };
      
      const response = await api.post('/salary/daily-wage/', backendData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createMonthlySalary: async (data) => {
    try {
      const backendData = {
        employee: data.employeeName || data.employee,
        date: data.date || `${data.month}-01`,
        month: data.month || data.date?.substring(0, 7),
        salary_amount: data.salary_amount || data.baseSalary,
        description: data.description || '',
        wage_type: 'Monthly'
      };

      const response = await api.post('/salary/monthly-salary/', backendData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateSalary: async (id, data) => {
    try {
      const backendData = {
        employee: data.employeeName || data.employee,
        date: data.date,
        month: data.month,
        amount: data.amount,
        total_paid: data.total_paid,
        salary_amount: data.salary_amount,
        description: data.description,
        wage_type: data.wageType || data.wage_type
      };
      
      const response = await api.put(`/salary/${id}/`, backendData);
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
  },

  getEmployeeSalarySummary: async (employeeName, month, year) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      
      const response = await api.get(`/salary/employee/${employeeName}/summary/`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};