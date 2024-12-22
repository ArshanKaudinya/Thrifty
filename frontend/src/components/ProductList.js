import React, { useState, useEffect } from 'react';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = () => {
    // Replace this URL with your backend API endpoint
    fetch(`/api/products?page=${page}`)
      .then(response => response.json())
      .then(data => setProducts(prevProducts => [...prevProducts, ...data]));
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="product-list">
      {products.map((product, index) => (
        <div className="product-card" key={index}>
          <img src={product.image} alt={product.name} className="product-image" />
          <h5>{product.name}</h5>
          <p>${product.price}</p>
        </div>
      ))}
      <button className="load-more" onClick={loadMore}>Load More</button>
    </div>
  );
}

export default ProductList;
