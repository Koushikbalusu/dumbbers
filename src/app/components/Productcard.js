import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import WishlistButton from "./WishlistButton";
import "./Productcard.css";

export default function Productcard({ 
    prodId, 
    prodName, 
    imageUrl, 
    prodDiscription, 
    prodPrice, 
    prodSlug,
    images = [] // Array of images for hover effect
}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Debug logging
    console.log('Productcard props:', { prodId, prodName, prodPrice, prodDiscription });
    
    // Use the first image as default, or fallback to imageUrl
    const defaultImage = images.length > 0 ? images[0] : imageUrl;
    const hoverImage = images.length > 1 ? images[1] : defaultImage;

    const handleMouseEnter = () => {
        if (images.length > 1) {
            setCurrentImageIndex(1);
        }
    };

    const handleMouseLeave = () => {
        setCurrentImageIndex(0);
    };

    return (
        <div className="productcard-wrapper">
            <Link href={`/products/${prodId}`} className="productcard" style={{ textDecoration: "none", color: "inherit" }}>
                <div 
                    className="productcardimg"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Image 
                        src={currentImageIndex === 0 ? defaultImage : hoverImage} 
                        alt={prodName} 
                        width={200} 
                        height={200}
                        className="product-image"
                    />
                </div>
                <div className="productcardinfo">
                    <h3>{prodName}</h3>
                    <p>{prodDiscription}</p>
                    <h4>₹{prodPrice || 'Price not available'}</h4>
                </div>
            </Link>
            <WishlistButton productId={prodId} />
        </div>
    );
}