"use client";
import React from "react";
import styles from "../components/CategoryPage.module.css";
import Productcard from "../components/Productcard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BoxyvestsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("https://dumbbers-backend.onrender.com/api/products?category=BOXY_VESTS")
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
        <div className={`${styles.container} ${styles.boxyvests}`}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>BOXY VESTS</h1>
                <p className={styles.pageSubtitle}>
                    Stay comfortable and stylish with our collection of boxy vests designed for the modern wardrobe.
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
    )
}