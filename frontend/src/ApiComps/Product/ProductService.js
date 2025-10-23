// ProductService.js - COMPLETE FIXED VERSION
import api from "../Config";

class ProductService {
  async getAllProducts() {
    try {
      const response = await api.get('/product/list/');
      console.log("Raw API products data:", response.data);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products',
      };
    }
  }

  async getProduct(id) {
    try {
      const response = await api.get(`/product/get-product/${id}/`);
      console.log("Raw API single product data:", response.data);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching product:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product',
      };
    }
  }

  async createProduct(productData) {
    try {
      const apiData = this.mapUIToAPI(productData);

      const formData = new FormData();
      Object.keys(apiData).forEach(key => {
        if (apiData[key] !== null && apiData[key] !== undefined) {
          if (key === 'images') {
            // Multiple images handle karo
            apiData[key].forEach(image => {
              formData.append('images', image);
            });
          } else {
            formData.append(key, apiData[key]);
          }
        }
      });

      const response = await api.post('/product/create/', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data,
        message: 'Product added successfully!'
      };
    } catch (error) {
      console.error('Error creating product:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to add product',
      };
    }
  }

  async updateProduct(id, productData) {
    try {
      const apiData = this.mapUIToAPI(productData);
      
      const formData = new FormData();
      Object.keys(apiData).forEach(key => {
        if (apiData[key] !== null && apiData[key] !== undefined) {
          if (key === 'images') {
            apiData[key].forEach(image => {
              formData.append('images', image);
            });
          } else {
            formData.append(key, apiData[key]);
          }
        }
      });

      const response = await api.put(`/product/${id}/update/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update product',
      };
    }
  }

  async deleteProduct(id) {
    try {
      const response = await api.delete(`/product/${id}/delete/`);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete product',
      };
    }
  }

  // ✅ UI se API format mapping
  mapUIToAPI(uiData) {
    const apiData = {
      name: uiData.name,
      brand: uiData.brand,
      customer_name: uiData.customer_name,
      purchase_price: parseFloat(uiData.purchase_price).toString(),
      sale_price: parseFloat(uiData.sale_price).toString(),
      description: uiData.description || '',
      category: uiData.category,
      quantity: (parseInt(uiData.quantity, 10) || 1).toString(),
      date: uiData.date,
      images: uiData.images || [], // File objects for new images
    };

    console.log('Mapped UI to API data:', apiData);
    return apiData;
  }

  // ✅ API se UI format mapping with PROFIT CALCULATION
  mapAPIToUI(apiData, index = 0) {
    console.log("Mapping API to UI - Raw API data:", apiData);
    
    // ✅ Image URLs properly handle karo
    const processedImages = (apiData.images || []).map(image => {
      let imageUrl = '';
      
      if (image && image.image) {
        // Agar image full URL hai
        if (typeof image.image === 'string' && image.image.startsWith('http')) {
          imageUrl = image.image;
        }
        // Agar image relative path hai
        else if (typeof image.image === 'string') {
          imageUrl = `http://localhost:8000${image.image}`;
        }
        // Agar image object hai (Django mein aisa hota hai)
        else if (image.image && typeof image.image === 'object') {
          imageUrl = `http://localhost:8000${image.image.url || image.image.image || ''}`;
        }
      }
      
      return {
        ...image,
        image: imageUrl,
        previewUrl: imageUrl
      };
    });

    // ✅ PROFIT CALCULATIONS - YAHAN ADD KARO
    const purchPrice = parseFloat(apiData.purchase_price || 0);
    const salePrice = parseFloat(apiData.sale_price || 0);
    const quantity = parseInt(apiData.quantity, 10) || 1;
    
    const profitPerUnit = salePrice - purchPrice;
    const totalPurchaseCost = purchPrice * quantity;
    const totalSaleValue = salePrice * quantity;
    const totalProfit = totalSaleValue - totalPurchaseCost;
    const profitMarginPercentage = purchPrice > 0 ? (profitPerUnit / purchPrice) * 100 : 0;

    const uiProduct = {
      id: apiData.id,
      srNo: index + 1,
      name: apiData.name,
      product: apiData.name,
      brand: apiData.brand,
      customer_name: apiData.customer_name,
      cName: apiData.customer_name,
      purchase_price: purchPrice,
      purchPrice: purchPrice,
      sale_price: salePrice,
      salePrice: salePrice,
      description: apiData.description || '',
      category: apiData.category,
      quantity: quantity,
      date: apiData.date,
      dateAdded: apiData.date,
      images: processedImages,
      
      // ✅ PROFIT FIELDS ADD KARO - YEH IMPORTANT HAI
      profit: totalProfit,
      totalPurchaseCost: totalPurchaseCost,
      totalSaleValue: totalSaleValue,
      profitPerUnit: profitPerUnit,
      profitMarginPercentage: profitMarginPercentage,
    };

    console.log("Mapped UI Product with profit:", uiProduct);
    return uiProduct;
  }
}

export default new ProductService();