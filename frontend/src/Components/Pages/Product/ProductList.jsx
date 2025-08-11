import React, { useState, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Package,
  TrendingUp,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getProducts } from "../../../ApiComps/Product/ProductList";
const ProductList = React.forwardRef(({
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
  isDeleting = false,
}, ref) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getProducts();
    
    if (result.success) {
      // Transform API data to match component expected format
      const transformedProducts = result.data.results.map((product, index) => ({
        id: product.id,
        srNo: index + 1,
        product: product.name,
        brand: product.brand,
        cName: product.customer_name,
        dateAdded: product.date,
        purchPrice: parseFloat(product.purchase_price),
        salePrice: parseFloat(product.sale_price),
        profit: product.total_profit,
        category: product.category,
        quantity: product.quantity,
        description: product.description,
        images: product.images,
        totalPurchaseCost: product.total_purchase_cost,
        totalSaleValue: product.total_sale_value,
        profitPerUnit: product.profit_per_unit,
        profitMarginPercentage: product.profit_margin_percentage,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      }));
      
      setProducts(transformedProducts);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Function to filter products by selected month and year
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

  const filteredProducts = filterByDate(
    products.filter(
      (product) =>
        product.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.cName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totals = filteredProducts.reduce(
    (acc, product) => ({
      totalPurchase: acc.totalPurchase + product.purchPrice,
      totalSale: acc.totalSale + product.salePrice,
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
    }
  };

  // Function to handle month-year selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Function to clear date filter
  const clearDateFilter = () => {
    setSelectedDate("");
  };

  // ...removed refreshProducts and imperative handle...

  // Loading state
  if (loading) {
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
  }

  // Error state
  if (error) {
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
            <p className="text-red-600 text-center">
              {error}
            </p>
            <button
              onClick={fetchProducts}
              className="bg-[#181829] text-white px-4 py-2 rounded-lg hover:bg-[#d8f276] hover:text-[#181829] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#181829] flex items-center gap-3">
              <Package className="w-7 h-7 text-[#d8f276]" />
              Product
            </h2>
            <p className="text-gray-600 mt-1">
              Manage your products efficiently
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
              />
            </div>
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="month"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {selectedDate && (
                  <button
                    onClick={clearDateFilter}
                    className="px-2 py-1 text-gray-500 hover:text-gray-700"
                    title="Clear date filter"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                onAddProduct();
                // You might want to refresh products after adding
                // This could be handled by the parent component calling refreshProducts
              }}
              className="bg-[#181829] cursor-pointer text-white hover:text-[#181829] px-4 py-2 rounded-lg hover:bg-[#d8f276] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            {/* Refresh button removed */}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#181829] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Total Products</p>
              <p className="text-2xl font-bold text-white">
                {filteredProducts.length}
              </p>
            </div>
            <Package className="w-8 h-8 text-[#d8f276]" />
          </div>
        </div>
        <div className="bg-[#181829] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-white">
                ${totals.totalSale.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#d8f276]" />
          </div>
        </div>
        <div className="bg-[#181829] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Total Profit</p>
              <p className="text-2xl font-bold text-white">
                ${totals.totalProfit.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#d8f276]" />
          </div>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table */}
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-[#181829] sticky top-0 z-10">
                <tr className="text-white">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[80px]">
                    Sr #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[300px]">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[180px]">
                    Customer Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">
                    Purchase
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">
                    Sale
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[100px]">
                    Profit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider min-w-[80px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={(e) => {
                        if (!e.target.closest(".dropdown-container")) {
                          onViewProduct(product);
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{product.srNo}
                      </td>
                       <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium">{product.product}</div>
                          <div className="text-gray-500 text-xs flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium">{product.product}</div>
                            <div className="text-gray-500 text-xs flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                className={`flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left ${
                                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={isDeleting}
                              </span>
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                {isDeleting ? 'Deleting...' : 'Delete Product'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{product.cName}</div>
                        <div className="text-gray-500 text-xs">
                          {new Date(product.dateAdded).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${product.purchPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${product.salePrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${product.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${product.profit.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleAction("edit", product)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Product
                                </button>
                                <button
                                  onClick={() => handleAction("delete", product)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Product
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
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="w-12 h-12 text-gray-300" />
                        <p>No products found</p>
                        <p className="text-sm">Add your first product to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Totals Section */}
      <div className="p-6 bg-[#181829] text-white border-t border-gray-200 rounded-b-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm">Total Products</p>
            <p className="text-lg font-bold">{filteredProducts.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm">Total Purchase</p>
            <p className="text-lg font-bold">
              ${totals.totalPurchase.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm">Total Sale</p>
            <p className="text-lg font-bold">
              ${totals.totalSale.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm">Total Profit</p>
            <p className="text-lg font-bold">
              ${totals.totalProfit.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductList.displayName = 'ProductList';

export default ProductList;