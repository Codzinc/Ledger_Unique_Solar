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

    if (result.success && result.data) {
      const transformedProducts = result.data.results.map((product, index) => {
        const purchPrice = parseFloat(product.purchase_price.toString());
        const salePrice = parseFloat(product.sale_price.toString());
        const quantity = parseInt(product.quantity.toString()) || 1;

        const profitPerUnit = salePrice - purchPrice;
        const totalPurchaseCost = purchPrice * quantity;
        const totalSaleValue = salePrice * quantity;
        const totalProfit = totalSaleValue - totalPurchaseCost;
        const profitMarginPercentage = (profitPerUnit / purchPrice) * 100;

        return {
          ...product,
          srNo: index + 1,
          product: product.name,
          cName: product.customer_name,
          dateAdded: product.date,
          purchPrice: purchPrice,
          salePrice: salePrice,
          profit: totalProfit,
          totalPurchaseCost: totalPurchaseCost,
          totalSaleValue: totalSaleValue,
          profitPerUnit: profitPerUnit,
          profitMarginPercentage: profitMarginPercentage,
        };
      });

      setProducts(transformedProducts);
    } else {
      setError(result.error || 'Failed to fetch products');
    }

    setLoading(false);
  };

 const handleAddOrUpdateProduct = (savedProduct) => {
  const purchPrice = parseFloat(savedProduct.purchase_price.toString());
  const salePrice = parseFloat(savedProduct.sale_price.toString());
  const quantity = parseInt(savedProduct.quantity.toString()) || 1;

  const profitPerUnit = salePrice - purchPrice;
  const totalPurchaseCost = purchPrice * quantity;
  const totalSaleValue = salePrice * quantity;
  const totalProfit = totalSaleValue - totalPurchaseCost;
  const profitMarginPercentage = purchPrice > 0 ? ((profitPerUnit / purchPrice) * 100) : 0;

  const transformedProduct = {
    ...savedProduct,
    srNo: 0, // This will be set based on position
    product: savedProduct.name,
    cName: savedProduct.customer_name,
    dateAdded: savedProduct.date,
    purchPrice: purchPrice,
    salePrice: salePrice,
    profit: totalProfit,
    totalPurchaseCost: totalPurchaseCost,
    totalSaleValue: totalSaleValue,
    profitPerUnit: profitPerUnit,
    profitMarginPercentage: profitMarginPercentage,
  };

  setProducts(prevProducts => {
    if (selectedProduct && selectedProduct.id === savedProduct.id) {
      // Update existing product
      return prevProducts.map(product => {
        if (product.id === savedProduct.id) {
          return { ...transformedProduct, srNo: product.srNo };
        }
        return product;
      });
    } else {
      // Add new product - insert at beginning
      const newProducts = [
        { ...transformedProduct, srNo: 1 },
        ...prevProducts.map(p => ({ ...p, srNo: p.srNo + 1 }))
      ];
      return newProducts;
    }
  });

  setShowAddProduct(false);
  setSelectedProduct(null);
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
        setProducts(prevProducts =>
          prevProducts
            .filter(product => product.id !== productId)
            .map((product, index) => ({ ...product, srNo: index + 1 }))
        );

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

  const handleCloseAddProduct = () => {
    setShowAddProduct(false);
    setSelectedProduct(null);
  };

  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <ProductList
        products={products}
        loading={loading}
        error={error}
        onViewProduct={handleViewProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddProduct={() => {
          setSelectedProduct(null);
          setShowAddProduct(true);
        }}
        isDeleting={isDeleting}
        onRetry={fetchProducts}
      />

      {showAddProduct && (
        <AddProduct
          product={selectedProduct}
          onSave={handleAddOrUpdateProduct}
          onClose={handleCloseAddProduct}
          isEdit={!!selectedProduct}
        />
      )}

      {showProductDetail && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={handleCloseProductDetail}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default Product;