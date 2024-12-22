import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams(); // Extract product ID from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}/`) // Fetch product details
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error('Error fetching product:', error));
  }, [id]);

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <div className="product-details">
      <Navbar />
      <div className="product-info">
        <img src={product.image || 'placeholder.jpg'} alt={product.name} className="product-image" />
        <h1>{product.name}</h1>
        <p>{product.price ? `$${product.price}` : 'Price not available'}</p>
        <p>{product.description}</p>
      </div>
    </div>
  );
}

export default ProductDetails;
