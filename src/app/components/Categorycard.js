import Image from "next/image";
import React from "react";
import "./Categorycard.css";

export default function Categorycard({ category, imageUrl }) {
  const handleImageError = (e) => {
    // Fallback to a placeholder if the image fails to load
    e.target.src = '/placeholder.jpg';
  };

  const containerStyle = {
    backgroundColor: '#ffffff',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)'
  };

  return (
    <div className="category-card">
      <div className="category-img-container" style={containerStyle}>
        <Image
          className="category-img"
          src={imageUrl}
          alt={category}
          width={200}
          height={200}
          onError={handleImageError}
        />
      </div>
      <h3 className="category-name">{category}</h3>
    </div>
  );
}
