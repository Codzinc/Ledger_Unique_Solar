import api from "../Config";

// Get all products
export const getProducts = async () => {
  try {
    const response = await api.get('/product/list/');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch products',
    };
  }
};

// Get single product by ID
export const getProduct = async (id) => {
  try {
    const response = await api.get(`/product/get-product/${id}/`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch product',
    };
  }
};

// Add product (if needed for future use)
export const addProduct = async (productData) => {
  try {
    const response = await api.post('/product/create/', productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return {
      success: true,
      data: response.data,
      message: 'Product added successfully!'
    };
  } catch (error) {
    console.error('Error adding product:', error);
    return {
      success: false,
      error: error.response?.data?.detail || error.response?.data?.message || 'Failed to add product',
    };
  }
};

// Update product (if needed for future use)
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/product/${id}/update/`, productData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update product',
    };
  }
};

// Delete product (if needed for future use)
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/product/${id}/delete/`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete product',
    };
  }
};