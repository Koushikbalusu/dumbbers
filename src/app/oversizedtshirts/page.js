"use client";
import React from "react";
import styles from "../components/CategoryPage.module.css";
import Productcard from "../components/Productcard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OversizedTshirtsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?category=OVERSIZED_T_SHIRTS`)
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
        <div className={`${styles.container} ${styles.oversizedtshirts}`}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>OVERSIZED T-SHIRTS</h1>
                <p className={styles.pageSubtitle}>
                    Embrace the relaxed, trendy look with our collection of oversized t-shirts that combine comfort and style.
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
                            prodMrp={product.variants?.[0]?.mrp || null}
                            prodSlug={product.slug}
                            images={product.images || []}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}