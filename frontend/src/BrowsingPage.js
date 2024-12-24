import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Link for navigation
import './BrowsingPage.css';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';

function BrowsingPage({ items, isLoading, error }) {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('search'); // Extract search query

  const [filteredItems, setFilteredItems] = useState([]);

  // Update filteredItems whenever items or the query changes
  useEffect(() => {
    if (items.length > 0) {
      const filtered = items.filter((item) =>
        !query || item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [items, query]);

  // Filter and sort items based on the search query and selected filters
  const applyFilters = (filters) => {
    const { category, condition, priceMin, priceMax, sortBy } = filters;

    let filtered = items.filter((item) => {
      return (
        (category ? item.category === category : true) &&
        (condition ? item.condition === condition : true) &&
        item.price >= priceMin &&
        item.price <= priceMax &&
        (!query || item.name.toLowerCase().includes(query.toLowerCase()))
      );
    });

    // Apply sorting logic
    if (sortBy === 'low-high') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-low') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered = filtered.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sortBy === 'popular') {
      filtered = filtered.sort((a, b) => b.popularity - a.popularity);
    }

    setFilteredItems(filtered); // Update filtered items
  };

  if (isLoading) {
    return <div className="loading">Loading items...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="browsing-page">
      <Navbar />
      <div className="content-container">
        <FilterBar onApplyFilters={applyFilters} />
        <div className="item-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <Link
                to={`/productdetails/${item.id}`} // Link to item details page
                key={index}
                className="item-card"
              >
                <div>
                  <img
                    src={item.image || 'placeholder.jpg'}
                    alt={item.name}
                    className="item-image"
                  />
                  <h3 className="item-title">{item.name}</h3>
                  <p className="item-price">
                    {item.price ? `$${item.price}` : 'Price not available'}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="no-items">No items found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrowsingPage;




