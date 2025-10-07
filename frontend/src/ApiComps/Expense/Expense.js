import api from "../Config";

class ExpenseService {
  async getAllExpenses() {
    try {
      const response = await api.get('/expense/');
      console.log("Raw API expenses data:", response.data); // Debug
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error.response?.data || error.message);
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
      console.error('Error creating expense:', error.response?.data || error.message);
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
    utilizer: uiData.utilizer,
    amount: parseFloat(uiData.amount).toString(),
    date: uiData.date,
    description: uiData.description || '',
    image1: uiData.receiptImage instanceof File ? uiData.receiptImage : null,
  };



    console.log('Mapped UI to API data:', apiData);
    return apiData;
  }

  mapAPIToUI(apiData, index = 0) {
    console.log("Mapping API to UI - Raw API data:", apiData); // Debug
    
    // ✅ Image URL properly handle karo
    let receiptImage = null;
    
    if (apiData.image1) {
      // Agar image1 full URL hai
      if (typeof apiData.image1 === 'string' && apiData.image1.startsWith('http')) {
        receiptImage = apiData.image1;
      }
      // Agar image1 relative path hai
      else if (typeof apiData.image1 === 'string') {
        receiptImage = `http://localhost:8000${apiData.image1}`;
      }
      // Agar image1 object hai (Django mein aisa hota hai)
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
    
    console.log("Mapped UI Expense:", uiExpense); // Debug
    return uiExpense;
  }
}

export default new ExpenseService();