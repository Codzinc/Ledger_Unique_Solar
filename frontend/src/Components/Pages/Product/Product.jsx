import React, { useState, useEffect } from "react";
import ProductDetail from "./ProductDetail";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import { deleteProduct, getProducts } from "../../../ApiComps/Product/ProductList";

const Product = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getProducts();
    
    if (result.success) {
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

  const handleAddProduct = (newProduct) => {
    // Transform the new product to match the list format
    const transformedProduct = {
      id: newProduct.id,
      srNo: products.length + 1,
      product: newProduct.name,
      brand: newProduct.brand,
      cName: newProduct.customer_name,
      dateAdded: newProduct.date,
      purchPrice: parseFloat(newProduct.purchase_price),
      salePrice: parseFloat(newProduct.sale_price),
      profit: parseFloat(newProduct.sale_price) - parseFloat(newProduct.purchase_price),
      category: newProduct.category,
      quantity: newProduct.quantity,
      description: newProduct.description,
      images: newProduct.images,
      totalPurchaseCost: parseFloat(newProduct.purchase_price) * (newProduct.quantity || 1),
      totalSaleValue: parseFloat(newProduct.sale_price) * (newProduct.quantity || 1),
      profitPerUnit: parseFloat(newProduct.sale_price) - parseFloat(newProduct.purchase_price),
      profitMarginPercentage: ((parseFloat(newProduct.sale_price) - parseFloat(newProduct.purchase_price)) / parseFloat(newProduct.purchase_price)) * 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts(prevProducts => [...prevProducts, transformedProduct]);
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

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsDeleting(true);
      const result = await deleteProduct(productId);
      if (result.success) {
        // Remove the product from the local state
        setProducts(prevProducts => 
          prevProducts
            .filter(product => product.id !== productId)
            .map((product, index) => ({ ...product, srNo: index + 1 }))
        );
        
        // Close product detail modal if the deleted product was being viewed
        if (selectedProduct && selectedProduct.id === productId) {
          setShowProductDetail(false);
          setSelectedProduct(null);
        }
      } else {
        alert(`Failed to delete product: ${result.error}`);
      }
      setIsDeleting(false);
    }
  };

  const handleProductUpdated = (updatedProduct) => {
    if (updatedProduct) {
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === updatedProduct.id
            ? {
                ...product,
                product: updatedProduct.name,
                brand: updatedProduct.brand,
                cName: updatedProduct.customer_name,
                dateAdded: updatedProduct.date,
                purchPrice: parseFloat(updatedProduct.purchase_price),
                salePrice: parseFloat(updatedProduct.sale_price),
                profit: parseFloat(updatedProduct.sale_price) - parseFloat(updatedProduct.purchase_price),
                category: updatedProduct.category,
                quantity: updatedProduct.quantity,
                description: updatedProduct.description,
                images: updatedProduct.images,
                updatedAt: new Date().toISOString(),
              }
            : product
        )
      );
    }
    setShowAddProduct(false);
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  return (
    <div className="">
      <ProductList
        products={products}
        loading={loading}
        error={error}
        onViewProduct={handleViewProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddProduct={() => setShowAddProduct(true)}
        isDeleting={isDeleting}
        onRetry={fetchProducts}
      />

      {showAddProduct && (
        <AddProduct
          product={selectedProduct}
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