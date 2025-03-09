import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "../styles/ProductList.css";

const ProductList = () => {
  const [productList, setProductList] = useState([]); // ✅ Renamed state variable

  useEffect(() => {
    fetch("/assets/products.json") // ✅ Correct path
      .then((response) => response.json())
      .then((data) => setProductList(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="product-list">
      {productList.length > 0 ? (
        productList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  );
};

export default ProductList;