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
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');

  // Handle changes for text inputs, select, and radio buttons
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file selection and generate a preview URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      // Create a temporary URL for previewing the image
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  // Handle form submission
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
        setPreviewImage(null);
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
      <div className="upload-container">
        <div className="left-panel">
          <h1>Upld Product</h1>
          <form id="upload-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              className="product-name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="row">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
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
            </div>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
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
          </form>
        </div>
        <div className="right-panel">
          <div className="image-upload">
            <label htmlFor="image-input" className="image-upload-label">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="preview-image" />
              ) : (
                <span>Click or drag file to upload image</span>
              )}
              <input
                id="image-input"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
      </div>
      <button type="submit" form="upload-form">
        Upload Product
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default UploadProduct;
