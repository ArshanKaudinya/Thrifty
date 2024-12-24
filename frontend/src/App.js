import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage';
import BrowsingPage from './BrowsingPage';
import AccountPage from './userLoginAuth/AccountPage';
import LoginPage from './userLoginAuth/LoginPage';
import RegisterPage from './userLoginAuth/RegisterPage';
import ProductPage from './ProductDetails.js';




function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/') 
      .then((response) => response.json())
      .then((data) => {
        setItems(data.results || data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/browse" element={<BrowsingPage items={items} isLoading={isLoading} error={error} />} />
          <Route path='/productdetails/:id' element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


