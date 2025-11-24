import React, { useState, useEffect } from "react";
import {
  X,
  Package,
  Building,
  DollarSign,
  TrendingUp,
  Calendar,
  Receipt,
  Tag,
  Loader2,
  AlertCircle,
  Trash2,
  Hash,
} from "lucide-react";
import productService from "../../../ApiComps/Product/ProductService";

const ProductDetail = ({ product, onClose, onEdit, onDelete }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    if (!product || !product.id) {
      setProductDetails(product);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await productService.getProduct(product.id);
      if (result.success && result.data) {
        const uiProduct = productService.mapAPIToUI(result.data);
        const transformedProduct = {
          ...uiProduct,
          srNo: product.srNo || result.data.id,
        };

        setProductDetails(transformedProduct);
      } else {
        setError(result.error || "Failed to fetch product details");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [product?.id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete(productDetails.id);
    }
  };

  if (!product) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Package className="w-7 h-7 text-[#d8f276]" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Product Details
                </h2>
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

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Package className="w-7 h-7 text-[#d8f276]" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Product Details
                </h2>
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
                onClick={onClose}
                className="bg-[#181829] text-white px-4 py-2 rounded-lg hover:bg-[#d8f276] hover:text-[#181829] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productDetails) return null;

  const purchPrice = productDetails.purchPrice || 0;
  const salePrice = productDetails.salePrice || 0;
  const quantity = productDetails.quantity || 1;
  const profitPerUnit = productDetails.profitPerUnit || salePrice - purchPrice;
  const totalPurchaseCost =
    productDetails.totalPurchaseCost || purchPrice * quantity;
  const totalSaleValue = productDetails.totalSaleValue || salePrice * quantity;
  const profit = productDetails.profit || totalSaleValue - totalPurchaseCost;
  const profitMarginPercentage =
    productDetails.profitMarginPercentage ||
    (purchPrice > 0 ? (profitPerUnit / purchPrice) * 100 : 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {productDetails.product}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {productDetails.category}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
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
                      profit > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {profit.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {profitMarginPercentage.toFixed(1)}% margin
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Customer Name</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {productDetails.cName}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Tag className="w-5 h-5 text-pink-600" />
                <h4 className="font-semibold text-gray-800">Brand</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {productDetails.brand}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-gray-800">Purchase Price</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {purchPrice.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Total: {totalPurchaseCost.toLocaleString()}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">Sale Price</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {salePrice.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Total: {totalSaleValue.toLocaleString()}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Hash className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-800">Quantity</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {quantity} units
              </p>
              <p className="text-sm text-gray-500">
                Profit per unit: {profitPerUnit.toLocaleString()}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Date Added</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {new Date(productDetails.dateAdded).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Updated:{" "}
                {new Date(
                  productDetails.updated_at || productDetails.dateAdded
                ).toLocaleDateString()}
              </p>
            </div>
          </div>

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
                      src={image.image} // ✅ Ab yeh properly work karega
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
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Profit Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Purchase Cost</p>
                <p className="text-xl font-bold text-orange-600">
                  {totalPurchaseCost.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Sale Value</p>
                <p className="text-xl font-bold text-blue-600">
                  {totalSaleValue.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Profit</p>
                <p
                  className={`text-xl font-bold ${
                    profit > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {profit.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p
                  className={`text-xl font-bold ${
                    profitMarginPercentage > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {profitMarginPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

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
