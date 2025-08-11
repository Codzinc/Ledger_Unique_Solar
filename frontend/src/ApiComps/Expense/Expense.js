import api from "../Config";

class ExpenseService {
  async getAllExpenses() {
    try {
      const response = await api.get('/expense/');
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error.response?.data || error.message);
      throw new Error('Failed to fetch expenses');
    }
  }

  async createExpense(expenseData) {
    try {
      const apiData = this.mapUIToAPI(expenseData);
      console.log('Creating expense with data:', apiData);  // Debug log
      const response = await api.post('/expense/', apiData);
      return response.data;
    } catch (error) {
      console.error('Error creating expense:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create expense');
    }
  }

  async updateExpense(id, expenseData) {
    try {
      const apiData = this.mapUIToAPI(expenseData);
      console.log('Updating expense with data:', apiData);  // Debug log
      const response = await api.put(`/expense/${id}/`, apiData);
      return response.data;
    } catch (error) {
      console.error('Error updating expense:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update expense');
    }
  }

  async deleteExpense(id) {
    try {
      await api.delete(`/expense/${id}/`);
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete expense');
    }
  }

  mapUIToAPI(uiData) {
    return {
      title: uiData.title,
      category: uiData.category,
      utilizer: uiData.utilizer,  // Ensure utilizer is included
      amount: parseFloat(uiData.amount).toString(),
      date: uiData.date,
      description: uiData.description || '',
      image1: uiData.receiptImage || null,
      // Keep other image fields as null
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      image6: null,
      image7: null,
    };
  }

  mapAPIToUI(apiData, index = 0) {
    return {
      id: apiData.id,
      srNo: index + 1,
      title: apiData.title,
      category: apiData.category,
      utilizer: apiData.utilizer,  // Ensure utilizer is mapped
      amount: parseFloat(apiData.amount),
      date: apiData.date,
      description: apiData.description || '',
      receiptImage: apiData.image1 || null,
    };
  }
}

export default new ExpenseService();