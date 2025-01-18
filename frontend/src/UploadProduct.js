import React, { useState } from 'react';
import Navbar from './components/Navbar';
import './UploadProduct.css';

function UploadProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    image: null,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('condition', formData.condition);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/products/', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setMessage('Product uploaded successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          condition: '',
          image: null,
        });
      } else {
        setMessage('Failed to upload product.');
      }
    } catch (error) {
      setMessage('An error occurred.');
      console.error('Error uploading product:', error);
    }
  };

  return (
    <div className="upload-product">
        <Navbar />
        <h1>Upload Product</h1>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            />
            <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            ></textarea>
            <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            />
            <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home & Living</option>
            </select>
            <div className="conditions">
            <label>
                <input
                type="radio"
                name="condition"
                value="new"
                checked={formData.condition === 'new'}
                onChange={handleChange}
                />
                New
            </label>
            <label>
                <input
                type="radio"
                name="condition"
                value="like-new"
                checked={formData.condition === 'like-new'}
                onChange={handleChange}
                />
                Like New
            </label>
            <label>
                <input
                type="radio"
                name="condition"
                value="used"
                checked={formData.condition === 'used'}
                onChange={handleChange}
                />
                Used
            </label>
            </div>
            <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            />
            <button type="submit">Upload Product</button>
        </form>
        </div>
  );
}

export default UploadProduct;
