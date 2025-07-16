import React, { useState } from 'react';
import ProductDetail from './ProductDetail';
import ProductList from './ProductList';
import AddProduct from './AddProduct';

import { SampleProducts } from './SampleProducts';

const Product = () => {
  const [products, setProducts] = useState(SampleProducts);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
    setShowAddProduct(false);
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

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const getNextSrNo = () => {
    return products.length > 0 ? Math.max(...products.map(p => p.srNo)) + 1 : 1;
  };

  return (
    <div className=''>
      {/* Main Content */}
      <ProductList
        products={products}
        onViewProduct={handleViewProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddProduct={() => setShowAddProduct(true)}
      />

      {/* Modals */}
      {showAddProduct && (
        <AddProduct
          onAddProduct={handleAddProduct}
          onClose={() => setShowAddProduct(false)}
          nextSrNo={getNextSrNo()}
        />
      )}

      {showProductDetail && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setShowProductDetail(false)}
          onEdit={handleEditProduct}
        />
      )}
    </div>
  );
};

export default Product;
