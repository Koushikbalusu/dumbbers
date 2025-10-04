"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Productcard from "../components/Productcard";
import styles from "./products.module.css";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = [
    { value: "all", label: "All Products" },
    { value: "PANTS", label: "Pants" },
    { value: "BOXY_VESTS", label: "Boxy Vests" },
    { value: "COMPRESSION_T_SHIRTS", label: "Compression T-Shirts" },
    { value: "OVERSIZED_T_SHIRTS", label: "Oversized T-Shirts" }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "popularity", label: "Most Popular" }
  ];

  const fetchProducts = async (page = 1, sort = sortBy, category = selectedCategory) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sort: sort
      });
      
      if (category !== "all") {
        params.append("category", category);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?${params}`);
      const data = await response.json();
      
      if (data.success) {
        const items = data.data.items || [];
        const total = data.data.total || items.length;
        const totalPages = data.data.totalPages || Math.ceil(total / 12);
        
        setProducts(items);
        setTotalPages(totalPages);
        setTotalProducts(total);
        setCurrentPage(page);
        
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message || "Error loading products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort") || "newest";
    const category = searchParams.get("category") || "all";
    
    setCurrentPage(page);
    setSortBy(sort);
    setSelectedCategory(category);
    fetchProducts(page, sort, category);
  }, [searchParams]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams);
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    const params = new URLSearchParams(searchParams);
    params.set("category", newCategory);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);
  };

  const renderPagination = () => {
    // Show pagination if we have products and multiple pages
    if (products.length === 0 || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className={styles.pageNumbers}>
          {pages}
        </div>
        <button
          className={styles.paginationButton}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className={styles.productsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>All Products</h1>
        <p className={styles.pageSubtitle}>
          Discover our complete collection of premium streetwear
        </p>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Category</label>
            <select
              className={styles.filterSelect}
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort By</label>
            <select
              className={styles.filterSelect}
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.resultsInfo}>
          <p>
            Showing {products.length} of {totalProducts} products
            {selectedCategory !== "all" && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>
      </div>

      <div className={styles.productsContent}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <h3>Error Loading Products</h3>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={() => fetchProducts(currentPage, sortBy, selectedCategory)}
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className={styles.emptyContainer}>
            <h3>No Products Found</h3>
            <p>No products match your current filters.</p>
            <button 
              className={styles.clearFiltersButton}
              onClick={() => {
                setSelectedCategory("all");
                setSortBy("newest");
                router.push("/products");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <Productcard
                  key={product._id}
                  prodId={product._id}
                  prodName={product.name}
                  imageUrl={product.images?.[0] || "/placeholder.jpg"}
                  prodDiscription={product.description}
                  prodPrice={product.variants?.[0]?.price || product.price || 0}
                  prodMrp={product.variants?.[0]?.mrp || product.mrp || null}
                  prodSlug={product.slug}
                  images={product.images || []}
                />
              ))}
            </div>

            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
