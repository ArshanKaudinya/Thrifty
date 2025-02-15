import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';
import Navbar from './components/Navbar';

function ProductDetails() {
  const { id } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-details">
      <Navbar />
      <div className="product-details-container">
        <h1 className="product-title">{product.name}</h1>
        <img
          className="product-image"
          src={`http://127.0.0.1:8000${product.image}`}
          alt={product.name}
        />
        <p className="product-description">{product.description}</p>
        <p className="product-price">{`Price: $${product.price.toFixed(2)}`}</p>
        <div className="product-meta">
          <span>{`Category: ${product.category}`}</span>
          <span>{`Condition: ${product.condition}`}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;


