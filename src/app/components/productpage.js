"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import "./productpage.css";
import Image from "next/image";

export default function Productpage({ prodid }) {
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${prodid}`)
      .then((res) => {
        const productData = res.data.data.product;
        setProduct(productData);
        if (productData.variants && productData.variants.length > 0) {
          setSelectedSize(productData.variants[0].size);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [prodid]);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    alert(`Added ${product.name} (Size: ${selectedSize}) to cart!`);
  };



  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <p>Sorry, we couldn&apos;t find this product.</p>
      </div>
    );
  }

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const currentVariant = product.variants && product.variants[0];

  return (
    <div className="product-page">
      <div className="product-container">
        
        {/* Left Side - Images */}
        <div className="product-images">
          <div className="main-image-container">
            <div 
              className="main-image"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                width={600}
                height={600}
                className="product-image"
                priority
              />
            </div>
            
            {/* Zoom Controls */}
            <div className="zoom-controls">
              <button onClick={handleZoomOut} disabled={zoomLevel <= 1}>−</button>
              <span>{zoomLevel}x</span>
              <button onClick={handleZoomIn} disabled={zoomLevel >= 3}>+</button>
            </div>
          </div>
          
          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => handleImageChange(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="thumbnail-image"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Product Details */}
        <div className="product-details">
          
          {/* Product Title */}
          <h1 className="product-title">{product.name}</h1>
          
          {/* Brand & Category */}
          <div className="product-meta">
            <span className="brand">{product.brand}</span>
            <span className="category">{product.category.replace('_', ' ')}</span>
          </div>

          {/* Pricing */}
          {currentVariant && (
            <div className="pricing">
              <span className="current-price">₹{currentVariant.price}</span>
            </div>
          )}

          {/* Description */}
          <div className="description">
            <p>{product.description}</p>
          </div>

          {/* Size Selection */}
          <div className="size-section">
            <h3>Select Size</h3>
            <div className="size-options">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>



          {/* Add to Cart */}
          <div className="actions">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
