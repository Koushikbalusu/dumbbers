import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Productcard({ prodId, prodName, imageUrl, prodDiscription, prodPrice, prodSlug }) {
    return (
        <Link href={`/product/${prodId}`} className="productcard" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="productcardimg">
                <Image src={imageUrl} alt={prodName} width={200} height={200} />
            </div>
            <div className="productcardinfo">
                <h3>{prodName}</h3>
                <p>{prodDiscription}</p>
                <h4>${prodPrice}</h4>
            </div>
        </Link>
    );
}