import React from "react";
import {
  X,
  Package,
  Building,
  DollarSign,
  TrendingUp,
  Calendar,
  Receipt,
  Zap,
  Ruler,
  Tag,
} from "lucide-react";

const ProductDetail = ({ product, onClose, onEdit }) => {
  if (!product) return null;

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
              <p className="text-gray-600">#{product.srNo}</p>
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
                  {product.product}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div className="text-right">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1 whitespace-nowrap">
                    Total Profit
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      product.profit > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${product.profit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Company Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Customer Name</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {product.cName}
              </p>
            </div>

            {/* Company Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-5 h-5 text-pink-600" />
                <h4 className="font-semibold text-gray-800">Brand</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {product.brand}
              </p>
            </div>

            {/* Purchase Price */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-gray-800">Purchase Price</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                ${product.purchPrice.toLocaleString()}
              </p>
            </div>

            {/* Sale Price */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">Sale Price</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                ${product.salePrice.toLocaleString()}
              </p>
            </div>

            {/* Date Added */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800">Date Added</h4>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {product.dateAdded}
              </p>
            </div>

            {/* Receipt */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-800">Receipt Image</h4>
              </div>
              {product.receiptImage ? (
                <img
                  src={product.receiptImage}
                  alt="Receipt"
                  className="w-full max-w-xs rounded-md border border-gray-300"
                />
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No receipt image uploaded
                </p>
              )}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-gray-600" />
              Technical Specifications
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium text-gray-900">{product.category}</p>
              </div>
            </div>
          </div>

          {/* Profit Analysis */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Profit Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Purchase Price</p>
                <p className="text-xl font-bold text-orange-600">
                  ${product.purchPrice.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Sale Price</p>
                <p className="text-xl font-bold text-blue-600">
                  ${product.salePrice.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p
                  className={`text-xl font-bold ${
                    product.profit > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {((product.profit / product.purchPrice) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(product)}
            className="px-6 py-2 bg-[#181829] text-white cursor-pointer hover:text-[#181829] rounded-lg hover:bg-[#d8f276] transition-colors flex items-center gap-2"
          >
            <Tag className="w-4 h-4" />
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
