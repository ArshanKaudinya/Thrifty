import React, { useState, useEffect } from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import './FilterBar.css';

function FilterBar({ onApplyFilters }) {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentRange, setCurrentRange] = useState({ min: 0, max: 1000 });
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/price-range/')
      .then((response) => response.json())
      .then((data) => {
        setPriceRange({ min: data.min, max: data.max });
        setCurrentRange({ min: data.min, max: data.max });
      })
      .catch((error) => console.error('Error fetching price range:', error));
  }, []);

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({
        category,
        condition,
        priceMin: currentRange.min,
        priceMax: currentRange.max,
        sortBy,
      });
    }
  };

  const handleClearFilters = () => {
    setCategory('');
    setCondition('');
    setCurrentRange({ min: priceRange.min, max: priceRange.max });
    setSortBy('');
    if (onApplyFilters) {
      onApplyFilters({
        category: '',
        condition: '',
        priceMin: priceRange.min,
        priceMax: priceRange.max,
        sortBy: '',
      });
    }
  };

  return (
    <aside className="filter-bar">
      <h4>Filters</h4>
      <ul>
        {/* CATEGORY DROPDOWN */}
        <li>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home & Living</option>
          </select>
        </li>

        {/* PRICE RANGE SLIDER */}
        <li>
          <label>Price Range:</label>
          <div className="price-range">
            <span>
              ${currentRange.min} - ${currentRange.max}
            </span>
            <InputRange
              maxValue={priceRange.max}
              minValue={priceRange.min}
              value={{ min: currentRange.min - 1, max: currentRange.max }}
              onChange={(value) =>
                setCurrentRange({ min: value.min - 1, max: value.max })
              }
              formatLabel={() => ''}
            />
          </div>
        </li>

        {/* CONDITION RADIO BUTTONS */}
        <li>
          <label>Condition:</label>
          <div>
            <input
              type="radio"
              id="new"
              name="condition"
              value="new"
              checked={condition === 'new'}
              onChange={(e) => setCondition(e.target.value)}
            />
            <label htmlFor="new">New</label>
          </div>
          <div>
            <input
              type="radio"
              id="like-new"
              name="condition"
              value="like-new"
              checked={condition === 'like-new'}
              onChange={(e) => setCondition(e.target.value)}
            />
            <label htmlFor="like-new">Like New</label>
          </div>
          <div>
            <input
              type="radio"
              id="used"
              name="condition"
              value="used"
              checked={condition === 'used'}
              onChange={(e) => setCondition(e.target.value)}
            />
            <label htmlFor="used">Used</label>
          </div>
        </li>

        {/* SORT BY DROPDOWN */}
        <li>
          <label>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-by-list"
          >
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
          </select>
        </li>
      </ul>

      {/* ACTION BUTTONS */}
      <button className="filters-btn" onClick={handleClearFilters}>
        Clear Filters
      </button>
      <button className="filters-btn" onClick={handleApplyFilters}>
        Apply Filters
      </button>
    </aside>
  );
}

export default FilterBar;




