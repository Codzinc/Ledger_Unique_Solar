import React, { useState } from 'react';
import { MoreVertical, Eye, Edit, Trash2, Plus, Search, Package, TrendingUp } from 'lucide-react';

const ProductList = ({
  products,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onAddProduct
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.cName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totals = filteredProducts.reduce(
    (acc, product) => ({
      totalPurchase: acc.totalPurchase + product.purchPrice,
      totalSale: acc.totalSale + product.salePrice,
      totalProfit: acc.totalProfit + product.profit
    }),
    { totalPurchase: 0, totalSale: 0, totalProfit: 0 }
  );

  const handleDropdownToggle = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleAction = (action, product) => {
    setActiveDropdown(null);
    switch (action) {
      case 'view':
        onViewProduct(product);
        break;
      case 'edit':
        onEditProduct(product);
        break;
      case 'delete':
        onDeleteProduct(product.id);
        break;
    }
  };

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
            <p className="text-gray-600 mt-1">Manage your products efficiently</p>
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

      {/* Stats Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#181829] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Total Products</p>
              <p className="text-2xl font-bold text-white">{filteredProducts.length}</p>
            </div>
            <Package className="w-8 h-8 text-[#d8f276]" />
          </div>
        </div>
        <div className="bg-[#181829] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-white">${totals.totalSale.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#d8f276]" />
          </div>
        </div>
        <div className="bg-[#181829] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Total Profit</p>
              <p className="text-2xl font-bold text-white">${totals.totalProfit.toLocaleString()}</p>
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
                <tr className='text-white'>
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
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      if (!(e.target.closest('.dropdown-container'))) {
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{product.cName}</div>
                      <div className="text-gray-500 text-xs">{product.dateAdded}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${product.purchPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${product.salePrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ${product.profit.toLocaleString()}
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
                                onClick={() => handleAction('view', product)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleAction('edit', product)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Product
                              </button>
                              <button
                                onClick={() => handleAction('delete', product)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Totals Section */}
      <div className="p-6 bg-[#181829] text-white border-t border-gray-200 rounded-b-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm ">Total Products</p>
            <p className="text-lg font-bold">{filteredProducts.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm ">Total Purchase</p>
            <p className="text-lg font-bold ">${totals.totalPurchase.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm ">Total Sale</p>
            <p className="text-lg font-bold ">${totals.totalSale.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm ">Total Profit</p>
            <p className="text-lg font-bold">${totals.totalProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;