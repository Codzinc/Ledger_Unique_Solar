import React, { useState, useEffect } from "react";
import {
  X,
  Package,
  Building,
  DollarSign,
  TrendingUp,
  Calendar,
  Receipt,
  Ruler,
  Tag,
  Loader2,
  AlertCircle,
  Trash2,
  Hash,
  ShoppingCart,
} from "lucide-react";
import { getProduct } from "../../../ApiComps/Product/ProductList";

const ProductDetail = ({ product, onClose, onEdit, onDelete, onProductUpdated }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product && product.id) {
      fetchProductDetails(product.id);
    }
  }, [product]);

  const fetchProductDetails = async (productId) => {
    setLoading(true);
    setError(null);
    
    const result = await getProduct(productId);
    
    if (result.success) {
      // Transform API data to match component expected format
      const transformedProduct = {
        id: result.data.id,
        srNo: product.srNo || result.data.id, // Use srNo from list or fallback to id
        product: result.data.name,
        brand: result.data.brand,
        cName: result.data.customer_name,
        dateAdded: result.data.date,
        purchPrice: parseFloat(result.data.purchase_price),
        salePrice: parseFloat(result.data.sale_price),
        profit: result.data.total_profit,
        category: result.data.category,
        quantity: result.data.quantity,
        description: result.data.description,
        images: result.data.images,
        totalPurchaseCost: result.data.total_purchase_cost,
        totalSaleValue: result.data.total_sale_value,
        profitPerUnit: result.data.profit_per_unit,
        profitMarginPercentage: result.data.profit_margin_percentage,
        createdAt: result.data.created_at,
        updatedAt: result.data.updated_at,
      };
      
      setProductDetails(transformedProduct);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete(productDetails.id);
    }
  };

  if (!product) return null;

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Package className="w-7 h-7 text-[#d8f276]" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#d8f276]" />
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Package className="w-7 h-7 text-[#d8f276]" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                <p className="text-gray-600">Error</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="text-red-600 text-center">{error}</p>
              <button
                onClick={() => fetchProductDetails(product.id)}
                className="bg-[#181829] text-white px-4 py-2 rounded-lg hover:bg-[#d8f276] hover:text-[#181829] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="w-7 h-7 text-[#d8f276]" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Product Details
              </h2>
              <p className="text-gray-600">#{productDetails.srNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {productDetails.product}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {productDetails.category}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {productDetails.brand}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {productDetails.description}
                </p>
              </div>
              <div className="text-right">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1 whitespace-nowrap">
                    Total Profit
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      productDetails.profit > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${productDetails.profit.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {productDetails.profitMarginPercentage.toFixed(1)}% margin
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Customer Name</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {productDetails.cName}
              </p>
            </div>

            {/* Brand Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Tag className="w-5 h-5 text-pink-600" />
                <h4 className="font-semibold text-gray-800">Brand</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {productDetails.brand}
              </p>
            </div>

            {/* Purchase Price */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-gray-800">Purchase Price</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                ${productDetails.purchPrice.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Total: ${productDetails.totalPurchaseCost.toLocaleString()}
              </p>
            </div>

            {/* Sale Price */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">Sale Price</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                ${productDetails.salePrice.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Total: ${productDetails.totalSaleValue.toLocaleString()}
              </p>
            </div>

            {/* Quantity */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Hash className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-800">Quantity</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {productDetails.quantity} units
              </p>
              <p className="text-sm text-gray-500">
                Profit per unit: ${productDetails.profitPerUnit.toLocaleString()}
              </p>
            </div>

            {/* Date Added */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800">Date Added</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {new Date(productDetails.dateAdded).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(productDetails.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Images Section */}
          {productDetails.images && productDetails.images.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-800">Product Images</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productDetails.images.map((image, index) => (
                  <div key={image.id || index} className="relative">
                    <img
                      src={`http://localhost:8000${image.image}`}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border border-gray-300"
                    />
                    <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {image.order || index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specifications */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-gray-600" />
              Product Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium text-gray-900">{productDetails.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Product ID</p>
                <p className="font-medium text-gray-900">#{productDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created At</p>
                <p className="font-medium text-gray-900">
                  {new Date(productDetails.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {new Date(productDetails.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Profit Analysis */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Profit Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Purchase Cost</p>
                <p className="text-xl font-bold text-orange-600">
                  ${productDetails.totalPurchaseCost.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Sale Value</p>
                <p className="text-xl font-bold text-blue-600">
                  ${productDetails.totalSaleValue.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Profit</p>
                <p
                  className={`text-xl font-bold ${
                    productDetails.profit > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${productDetails.profit.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p
                  className={`text-xl font-bold ${
                    productDetails.profitMarginPercentage > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {productDetails.profitMarginPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Product
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(productDetails)}
              className="px-6 py-2 bg-[#181829] text-white cursor-pointer hover:text-[#181829] rounded-lg hover:bg-[#d8f276] transition-colors flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;