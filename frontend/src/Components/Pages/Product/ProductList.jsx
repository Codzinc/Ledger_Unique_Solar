import React, { useState, useEffect, useRef } from "react";
import {
  MoreVertical,
  Eye,
  CreditCard as Edit,
  Trash2,
  Plus,
  Search,
  Package,
  TrendingUp,
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";

import { updateProduct } from "../../../ApiComps/Product/ProductList";

const ProductList = ({
  products,
  loading,
  error,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
  isDeleting,
  onRetry
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ Pagination states
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Dropdown close on outside click
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Filter products by date
  const filterByDate = (products) => {
    if (!selectedDate) return products;
    const [year, month] = selectedDate.split("-");
    return products.filter((product) => {
      const productDate = new Date(product.dateAdded);
      return (
        productDate.getFullYear() === parseInt(year) &&
        productDate.getMonth() === parseInt(month) - 1
      );
    });
  };

  // ✅ Apply filters and search
  const filteredProducts = filterByDate(
    products.filter(
      (product) =>
        product.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.cName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ✅ Totals
  const totals = filteredProducts.reduce(
    (acc, product) => ({
      totalPurchase: acc.totalPurchase + product.totalPurchaseCost,
      totalSale: acc.totalSale + product.totalSaleValue,
      totalProfit: acc.totalProfit + product.profit,
    }),
    { totalPurchase: 0, totalSale: 0, totalProfit: 0 }
  );

  const handleDropdownToggle = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleAction = (action, product) => {
    setActiveDropdown(null);
    switch (action) {
      case "view":
        onViewProduct(product);
        break;
      case "edit":
        onEditProduct(product);
        break;
      case "delete":
        onDeleteProduct(product.id);
        break;
      default:
        break;
    }
  };

  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const clearDateFilter = () => setSelectedDate("");

  // ✅ Loading
  if (loading)
    return (
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#181829] flex items-center gap-3">
            <Package className="w-7 h-7 text-[#d8f276]" />
            Product
          </h2>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#d8f276]" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );

  // ✅ Error
  if (error)
    return (
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#181829] flex items-center gap-3">
            <Package className="w-7 h-7 text-[#d8f276]" />
            Product
          </h2>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-red-600 text-center">{error}</p>
            <button
              onClick={onRetry}
              className="bg-[#181829] text-white px-4 py-2 rounded-lg hover:bg-[#d8f276] hover:text-[#181829] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* 🔍 Header + Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#181829] flex items-center gap-3">
              <Package className="w-7 h-7 text-[#d8f276]" />
              Product
            </h2>
            <p className="text-gray-600 mt-1">Manage your products efficiently</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
              />
            </div>
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <input
                  type="month"
                  value={selectedDate}
                  onChange={(e) => {
                    handleDateChange(e);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {selectedDate && (
                <button
                  onClick={() => {
                    clearDateFilter();
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              )}
            </div>
            <button
              onClick={onAddProduct}
              className="bg-[#181829] cursor-pointer text-white hover:text-[#181829] px-4 py-2 rounded-lg hover:bg-[#d8f276] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* 📦 Summary */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#181829] rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">Total Products</p>
            <p className="text-2xl font-bold text-white">{filteredProducts.length}</p>
          </div>
          <Package className="w-8 h-8 text-[#d8f276]" />
        </div>
        <div className="bg-[#181829] rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-white">
              {totals.totalSale.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-[#d8f276]" />
        </div>
        <div className="bg-[#181829] rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">Total Profit</p>
            <p className="text-2xl font-bold text-white">
              {totals.totalProfit.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-[#d8f276]" />
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto" ref={dropdownRef}>
        <div className="min-w-full max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-[#181829] sticky top-0 z-10 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Sr #
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Purchase
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Sale
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      if (
                        !e.currentTarget.querySelector(".dropdown-container")?.contains(e.target)
                      ) {
                        onViewProduct(product);
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{product.srNo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{product.product}</div>
                      <div className="text-gray-500 text-xs flex gap-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {product.category}
                        </span>
                        <span>Qty: {product.quantity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{product.cName}</div>
                      <div className="text-gray-500 text-xs">
                        {new Date(product.dateAdded).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">
                        {product.totalPurchaseCost.toLocaleString()}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {product.purchPrice.toLocaleString()} per unit
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">
                        {product.totalSaleValue.toLocaleString()}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {product.salePrice.toLocaleString()} per unit
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`font-medium ${
                          product.profit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.profit.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownToggle(product.id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeDropdown === product.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <div className="py-1">
                              <button
                                onClick={() => handleAction("view", product)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Eye className="w-4 h-4" /> View Details
                              </button>
                              <button
                                onClick={() => handleAction("edit", product)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="w-4 h-4" /> Edit Product
                              </button>
                              <button
                                onClick={() => handleAction("delete", product)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <Trash2 className="w-4 h-4" /> Delete Product
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-12 h-12 text-gray-300" />
                      <p>No products found</p>
                      <p className="text-sm">
                        Add your first product to get started
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 py-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* 📊 Footer Totals */}
      <div className="p-6 bg-[#181829] text-white border-t border-gray-200 rounded-b-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm">Total Products</p>
            <p className="text-lg font-bold">{filteredProducts.length}</p>
          </div>
          <div>
            <p className="text-sm">Total Purchase</p>
            <p className="text-lg font-bold">
              {totals.totalPurchase.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm">Total Sale</p>
            <p className="text-lg font-bold">
              {totals.totalSale.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm">Total Profit</p>
            <p className="text-lg font-bold">
              {totals.totalProfit.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
