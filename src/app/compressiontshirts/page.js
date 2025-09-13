"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./compressiontshirts.module.css";
import Productcard from "../components/Productcard";

export default function CompressiontshirtsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("https://dumbbers-backend.onrender.com/api/products?category=T_SHIRTS")
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
        <div className={style.container}>
        </div>
    );
}