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
      const transformedProducts = result.data.results.map((product, index) => {
        const purchPrice = parseFloat(product.purchase_price);
        const salePrice = parseFloat(product.sale_price);
        const quantity = parseInt(product.quantity) || 1;
        
        // Calculate accurate profits
        const profitPerUnit = salePrice - purchPrice;
        const totalPurchaseCost = purchPrice * quantity;
        const totalSaleValue = salePrice * quantity;
        const totalProfit = totalSaleValue - totalPurchaseCost;
        const profitMarginPercentage = (profitPerUnit / purchPrice) * 100;

        return {
          id: product.id,
          srNo: index + 1,
          product: product.name,
          brand: product.brand,
          cName: product.customer_name,
          dateAdded: product.date,
          purchPrice: purchPrice,
          salePrice: salePrice,
          profit: totalProfit,
          category: product.category,
          quantity: quantity,
          description: product.description,
          images: product.images,
          totalPurchaseCost: totalPurchaseCost,
          totalSaleValue: totalSaleValue,
          profitPerUnit: profitPerUnit,
          profitMarginPercentage: profitMarginPercentage,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        };
      });
      
      setProducts(transformedProducts);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleAddProduct = (newProduct) => {
    // Only handle new product additions here
    if (selectedProduct) {
      // If we have a selectedProduct, this is an edit operation
      handleProductUpdated(newProduct);
      return;
    }

    const purchPrice = parseFloat(newProduct.purchase_price);
    const salePrice = parseFloat(newProduct.sale_price);
    const quantity = parseInt(newProduct.quantity) || 1;
    
    // Calculate accurate profits
    const profitPerUnit = salePrice - purchPrice;
    const totalPurchaseCost = purchPrice * quantity;
    const totalSaleValue = salePrice * quantity;
    const totalProfit = totalSaleValue - totalPurchaseCost;
    const profitMarginPercentage = (profitPerUnit / purchPrice) * 100;

    const transformedProduct = {
      id: newProduct.id,
      srNo: products.length + 1,
      product: newProduct.name,
      brand: newProduct.brand,
      cName: newProduct.customer_name,
      dateAdded: newProduct.date,
      purchPrice: purchPrice,
      salePrice: salePrice,
      profit: totalProfit,
      category: newProduct.category,
      quantity: quantity,
      description: newProduct.description,
      images: newProduct.images,
      totalPurchaseCost: totalPurchaseCost,
      totalSaleValue: totalSaleValue,
      profitPerUnit: profitPerUnit,
      profitMarginPercentage: profitMarginPercentage,
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
      const purchPrice = parseFloat(updatedProduct.purchase_price);
      const salePrice = parseFloat(updatedProduct.sale_price);
      const quantity = parseInt(updatedProduct.quantity) || 1;
      
      // Calculate accurate profits
      const profitPerUnit = salePrice - purchPrice;
      const totalPurchaseCost = purchPrice * quantity;
      const totalSaleValue = salePrice * quantity;
      const totalProfit = totalSaleValue - totalPurchaseCost;
      const profitMarginPercentage = (profitPerUnit / purchPrice) * 100;

      setProducts(prevProducts =>
        prevProducts.map(product => {
          if (product.id === selectedProduct.id) {  // Use selectedProduct.id instead of updatedProduct.id
            return {
              ...product,
              product: updatedProduct.name,
              brand: updatedProduct.brand,
              cName: updatedProduct.customer_name,
              dateAdded: updatedProduct.date,
              purchPrice: purchPrice,
              salePrice: salePrice,
              profit: totalProfit,
              category: updatedProduct.category,
              quantity: quantity,
              description: updatedProduct.description,
              images: updatedProduct.images,
              totalPurchaseCost: totalPurchaseCost,
              totalSaleValue: totalSaleValue,
              profitPerUnit: profitPerUnit,
              profitMarginPercentage: profitMarginPercentage,
              updatedAt: new Date().toISOString(),
            };
          }
          return product;
        })
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