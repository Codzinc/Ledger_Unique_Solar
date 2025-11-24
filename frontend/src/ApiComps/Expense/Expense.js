import api from "../Config";

class ExpenseService {
  async getAllExpenses() {
    try {
      const response = await api.get('/expense/');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch expenses');
    }
  }

  async createExpense(expenseData) {
    try {
      const apiData = this.mapUIToAPI(expenseData);

      const formData = new FormData();
      Object.keys(apiData).forEach(key => {
        if (apiData[key] !== null && apiData[key] !== undefined) {
          formData.append(key, apiData[key]);
        }
      });

      const response = await api.post('/expense/', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create expense');
    }
  }

  async updateExpense(id, expenseData) {
    try {
      const apiData = this.mapUIToAPI(expenseData);
      
      const formData = new FormData();
      Object.keys(apiData).forEach(key => {
        if (apiData[key] !== null && apiData[key] !== undefined) {
          formData.append(key, apiData[key]);
        }
      });

      const response = await api.put(`/expense/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update expense');
    }
  }

  async deleteExpense(id) {
    try {
      await api.delete(`/expense/${id}/`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete expense');
    }
  }

  mapUIToAPI(uiData) {
  return {
    title: uiData.title,
    category: uiData.category,
    utilizer: uiData.utilizer,
    amount: parseFloat(uiData.amount).toString(),
    date: uiData.date,
    description: uiData.description || '',
    image1: uiData.receiptImage instanceof File ? uiData.receiptImage : null,
  };

    return apiData;
  }

  mapAPIToUI(apiData, index = 0) {
      let receiptImage = null;
    
    if (apiData.image1) {
      if (typeof apiData.image1 === 'string' && apiData.image1.startsWith('http')) {
        receiptImage = apiData.image1;
      }
      else if (typeof apiData.image1 === 'string') {
        receiptImage = `http://localhost:8000${apiData.image1}`;
      }
      else if (apiData.image1 && typeof apiData.image1 === 'object') {
        receiptImage = `http://localhost:8000${apiData.image1.url || apiData.image1.image || ''}`;
      }
    }
    
    const uiExpense = {
      id: apiData.id,
      srNo: index + 1,
      title: apiData.title,
      category: apiData.category,
      utilizer: apiData.utilizer,
      amount: parseFloat(apiData.amount),
      date: apiData.date,
      description: apiData.description || '',
      receiptImage: receiptImage,
    };
    
    return uiExpense;
  }
}

export default new ExpenseService();