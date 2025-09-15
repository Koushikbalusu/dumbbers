"use client";
import Image from "next/image";
import { CiUser, CiSearch, CiHeart } from "react-icons/ci";
import { PiBagSimple } from "react-icons/pi";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Link from "next/link";
import TextCarousel from "./TextCarousel";
import AuthModal from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./navbar.css";
import { useState, useRef, useEffect } from "react";


export default function Navbar() {
  const categories = ["Pants","Boxy vests","Compression t shirts","Oversized t shirts"];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userMenuRef = useRef(null);
  
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();

  // Handle clicking outside the user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(`https://dumbbers-backend.onrender.com/api/products/suggest?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data.items);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setShowUserDropdown(false);
  };

  const handleUserMenuMouseEnter = () => {
    setShowUserDropdown(true);
  };

  const handleUserMenuMouseLeave = () => {
    // Add a small delay before hiding to allow moving to dropdown
    setTimeout(() => {
      setShowUserDropdown(false);
    }, 150);
  };

  return (
    <>
      <TextCarousel />
      <nav className="navbar">
        <div className="logo">
          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src="/logo.png"
              alt="logo"
              width={50}
              height={50}
              priority
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>

        <button
          className="mobileMenuToggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>

        <div className={`links ${mobileMenuOpen ? "active" : ""}`}>
          {categories.map((category) => {
            return (
              <Link
                key={category}
                href={`/${category.toLowerCase().replace(/\s+/g, '')}`}
                style={{ textDecoration: "none" }}
                onClick={closeMobileMenu}
              >
                {category.replace(/_/g, " ").toUpperCase()}
              </Link>
            );
          })}
        </div>

        <div className="search-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="search-input"
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
            <button type="submit" className="search-button">
              <CiSearch />
            </button>
          </form>
          
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="search-result-item"
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchQuery("");
                  }}
                >
                  <span className="search-result-name">{product.name}</span>
                  <span className="search-result-category">{product.category}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="icons">
          <Link href="/wishlist" className="wishlist-link">
            <CiHeart />
          </Link>
          <Link href="/cart" className="cart-link">
            <PiBagSimple />
            {isAuthenticated && getCartItemCount() > 0 && (
              <span className="cart-count">{getCartItemCount()}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <div 
              className="user-menu"
              ref={userMenuRef}
              onMouseEnter={handleUserMenuMouseEnter}
              onMouseLeave={handleUserMenuMouseLeave}
            >
              <button className="user-button">
                <CiUser />
                <span className="user-name">{user?.name}</span>
              </button>
              {showUserDropdown && (
                <div className="user-dropdown">
                  <Link href="/profile" onClick={() => { closeMobileMenu(); setShowUserDropdown(false); }}>Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="login-button"
              onClick={() => setAuthModalOpen(true)}
            >
              <CiUser />
              <span>Login</span>
            </button>
          )}
        </div>
      </nav>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}
