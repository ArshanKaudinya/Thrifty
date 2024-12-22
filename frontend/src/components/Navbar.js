import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatarImage from './img-assets/def-user-icon.png';
import searchIcon from './img-assets/search-analytics.png';
import './Navbar.css';

const SEARCH_TIMEOUT = 500;

function Navbar() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
    setSearchActive(false); // Close the search bar
    setSearchQuery(''); // Reset search input
  };

  const handleSearchClick = (e) => {
    // Add the animation class
    e.currentTarget.classList.add('search-icon-clicked');
    
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Thrifty</div>
      <ul className="navbar-links">
      <li>
          {!searchActive && (
            <img
              src={searchIcon}
              alt="Search Icon"
              className="search-icon"
              onClick={(e) => {
                handleSearchClick(e);
                setTimeout(() => {
                  setSearchActive(true);
                }, SEARCH_TIMEOUT);
              }}
            />
          )}
          {searchActive && (
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
              />
            </form>
          )}
        </li>
        <li><Link to="/browse" className="underline-link">Browse</Link></li>
        <li><Link to="/settings" className="underline-link">Settings</Link></li>
        <li>
          <Link to="/profile">
            <img src={avatarImage} alt="User Avatar" className="avatar" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;




