"use client";
import Image from "next/image";
import { CiUser, CiSearch, CiHeart } from "react-icons/ci";
import { PiBagSimple } from "react-icons/pi";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";
import AuthModal from "./AuthModal";
import "./Navbar.css";

export default function Navbar() {
  const router = useRouter();
  const categories = ["Pants", "Boxy Vests", "Compression T-Shirts", "Oversized T-Shirts"];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();

  // Removed obsolete user dropdown outside-click handler

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openAuthModal = () => {
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const submitSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setMobileMenuOpen(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitSearch();
    }
  };

  // We rely on explicit clicks/taps to open/close the user dropdown
  // This works reliably on touch screens (no hover needed)

  // Removed obsolete user dropdown toggle handler

  // no dropdown state

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src="/logo.png"
              alt="Dumbbers Logo"
              width={50}
              height={50}
              priority
              className="logo-image"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link
            href="/"
            className="nav-link"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          {categories.map((category, index) => {
            // Remove spaces and hyphens only for 3rd and 4th links (index 2 and 3)
            const href = index >= 2 
              ? `/${category.toLowerCase().replace(/\s+/g, '').replace(/-/g, '')}`
              : `/${category.toLowerCase().replace(/\s+/g, '')}`;
            
            return (
              <Link
                key={category}
                href={href}
                className="nav-link"
                onClick={closeMobileMenu}
              >
                {category}
              </Link>
            );
          })}
          <Link
            href="/blog"
            className="nav-link"
            onClick={closeMobileMenu}
          >
            Blog
          </Link>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <div className="search-container">
            <CiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              enterKeyHint="search"
              inputMode="search"
              className="search-input"
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="navbar-actions">
          <Link href="/wishlist" className="action-link">
            <CiHeart />
          </Link>
          <Link href="/cart" className="action-link cart-link">
            <PiBagSimple />
            {isAuthenticated && getCartItemCount() > 0 && (
              <span className="cart-badge">{getCartItemCount()}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link href="/profile" className="action-link" aria-label="Profile" onClick={closeMobileMenu}>
              <CiUser />
            </Link>
          ) : (
            <button 
              className="action-link"
              aria-label="Login"
              onClick={openAuthModal}
            >
              <CiUser />
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-search">
            <div className="search-container">
              <CiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                enterKeyHint="search"
                inputMode="search"
                className="search-input"
              />
            </div>
          </div>
          <div className="mobile-links">
            <Link
              href="/"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            {categories.map((category, index) => {
              // Remove spaces and hyphens only for 3rd and 4th links (index 2 and 3)
              const href = index >= 2 
                ? `/${category.toLowerCase().replace(/\s+/g, '').replace(/-/g, '')}`
                : `/${category.toLowerCase().replace(/\s+/g, '')}`;
              
              return (
                <Link
                  key={category}
                  href={href}
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  {category}
                </Link>
              );
            })}
            <Link
              href="/blog"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={closeAuthModal} 
      />
    </nav>
  );
}
