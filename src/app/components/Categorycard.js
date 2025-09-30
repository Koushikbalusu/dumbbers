import Image from "next/image";
import React, { useState } from "react";
import "./Categorycard.css";

export default function Categorycard({ category, imageUrl }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = (e) => {
    // Fallback to a placeholder if the image fails to load
    e.target.src = '/placeholder.jpg';
  };


  const getCategoryDescription = (category) => {
    switch (category.toLowerCase()) {
      case 'pants':
        return 'Comfortable & Stylish';
      case 'boxy vests':
        return 'Modern & Trendy';
      case 'compression t-shirts':
        return 'Performance Ready';
      case 'oversized t-shirts':
        return 'Relaxed & Cool';
      default:
        return 'Premium Quality';
    }
  };

  const containerStyle = {
    backgroundColor: '#ffffff',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)'
  };

  return (
    <div 
      className="category-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="category-img-container" style={containerStyle}>
        <Image
          className="category-img"
          src={imageUrl}
          alt={category}
          width={200}
          height={200}
          onError={handleImageError}
        />
        <div className="category-overlay">
          <div className="category-description">{getCategoryDescription(category)}</div>
        </div>
      </div>
      <h3 className="category-name">{category}</h3>
      <div className="category-arrow">→</div>
    </div>
  );
}
