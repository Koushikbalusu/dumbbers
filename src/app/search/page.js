"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Productcard from "../components/Productcard";
import styles from "./search.module.css";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");

  // Get search query from URL on component mount
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      searchProducts(query);
    }
  }, [searchParams]);

  // Search products function
  const searchProducts = async (query, sortValue = sortBy) => {
    if (!query.trim()) {
      setProducts([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        q: query,
        limit: "50",
        sort: sortValue
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (data.success) {
        console.log('Search results:', data.data.items);
        setProducts(data.data.items || []);
        setTotalResults(data.data.total || 0);
      } else {
        setError(data.message || "No products found");
        setProducts([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Error searching products. Please try again.");
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };



  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    if (searchQuery.trim()) {
      searchProducts(searchQuery, newSortBy);
    }
  };


  return (
    <div className={styles.searchPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {searchQuery ? `Search Results for "${searchQuery}"` : "Search Products"}
        </h1>
        <p className={styles.pageSubtitle}>
          {searchQuery 
            ? `Find the perfect products that match your search`
            : "Use the search bar in the navigation to find products"
          }
        </p>
      </div>
      
      <div className={styles.searchContent}>
        {/* Results Section */}
        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsInfo}>
              {loading ? (
                <p className={styles.loadingText}>Searching...</p>
              ) : error ? (
                <p className={styles.errorText}>{error}</p>
              ) : (
                <p className={styles.resultsCount}>
                  {totalResults > 0
                    ? `${totalResults} product${totalResults !== 1 ? "s" : ""} found`
                    : "No products found"}
                </p>
              )}
            </div>

            <div className={styles.sortContainer}>
              <label className={styles.sortLabel}>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="newest">Newest First</option>
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Searching products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <Productcard
                  key={product._id}
                  prodId={product._id}
                  prodName={product.name}
                  imageUrl={product.images?.[0] || "/placeholder.jpg"}
                  prodDiscription={product.description}
                  prodPrice={product.price || product.variants?.[0]?.price || 0}
                  prodSlug={product.slug}
                  images={product.images || []}
                />
              ))}
            </div>
          ) : !loading && searchQuery && (
            <div className={styles.noResults}>
              <h3>No products found</h3>
              <p>Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

