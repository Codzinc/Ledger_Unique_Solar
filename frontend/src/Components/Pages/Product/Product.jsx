import React, { useState, useEffect, useRef } from "react";
import ProductDetail from "./ProductDetail";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import { deleteProduct } from "../../../ApiComps/Product/ProductList";
const Product = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Remove productListRef and refresh logic
  const handleAddProduct = (newProduct) => {
    setShowAddProduct(false);
    // No manual refresh needed; rely on state updates/props
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(false);
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsDeleting(true);
      const result = await deleteProduct(productId);
      if (result.success) {
        // Close product detail modal if the deleted product was being viewed
        if (selectedProduct && selectedProduct.id === productId) {
          setShowProductDetail(false);
          setSelectedProduct(null);
        }
        alert("Product deleted successfully!");
      } else {
        alert(`Failed to delete product: ${result.error}`);
      }
      setIsDeleting(false);
    }
  };

  const handleProductUpdated = () => {
    setShowAddProduct(false);
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  return (
    <div className="">
      {/* Main Content */}
      <ProductList
        onViewProduct={handleViewProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddProduct={() => setShowAddProduct(true)}
        isDeleting={isDeleting}
      />

      {/* Modals */}
      {showAddProduct && (
        <AddProduct
          product={selectedProduct} // Pass selected product for editing
          onAddProduct={handleAddProduct}
          onProductUpdated={handleProductUpdated}
          onClose={() => {
            setShowAddProduct(false);
            setSelectedProduct(null);
          }}
          isEdit={!!selectedProduct}
        />
      )}

      {showProductDetail && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => {
            setShowProductDetail(false);
            setSelectedProduct(null);
          }}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
};

export default Product;