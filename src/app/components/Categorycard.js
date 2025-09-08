import Image from "next/image";
import React from "react";
import "./Categorycard.css";

export default function Categorycard({ category, imageUrl }) {
  return (
    <div className="category-card">
      <h3 className="category-name">{category}</h3>
      <Image
        className="category-img"
        src="/logo.png"
        alt={category}
        width={200}
        height={200}
      />
    </div>
  );
}
