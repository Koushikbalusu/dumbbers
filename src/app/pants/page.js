"use client";
import React from "react";
import style from "./pant.module.css";
import Productcard from "../components/Productcard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PantsPage() {
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
    )
}