"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../components/CategoryPage.module.css";
import Productcard from "../components/Productcard";

export default function CompressiontshirtsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("https://dumbbers-backend.onrender.com/api/products?category=COMPRESSION_T_SHIRTS")
            .then((response) => {
                if (response.data && response.data.data && response.data.data.items) {
                    setProducts(response.data.data.items);
                }
            })
            .catch((error) => {
                // Optionally handle error
                console.error("Error fetching products:", error);
            });
    }, []);

    return (
        <div className={`${styles.container} ${styles.compressiontshirts}`}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>COMPRESSION T-SHIRTS</h1>
                <p className={styles.pageSubtitle}>
                    Experience the perfect fit with our high-performance compression t-shirts designed for comfort and style.
                </p>
            </div>
            
            {products.length === 0 ? (
                <div className={styles.loadingState}>
                    Loading products...
                </div>
            ) : (
                <div className={styles.productsGrid}>
                    {products.map((product) => (
                        <Productcard
                            key={product._id}
                            prodId={product._id}
                            prodName={product.name}
                            imageUrl={product.images?.[0] || '/placeholder.jpg'}
                            prodDiscription={product.description}
                            prodPrice={product.variants?.[0]?.price || 0}
                            prodSlug={product.slug}
                            images={product.images || []}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}