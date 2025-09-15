"use client";
import Image from "next/image";
import React from "react";
import style from "./home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Categorycard from "./components/Categorycard";
import Link from "next/link";

const heroimgurl = "https://res.cloudinary.com/dziymwwa3/image/upload/v1757017876/8b349ee5-1a9d-4aa5-9a5d-dc8fb8b2ab73.png";

export default function Home() {
  const [meta, setMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryImages, setCategoryImages] = useState({
    pants: null,
    boxyvests: null,
    compressiontshirts: null,
    oversizedtshirts: null
  });

  useEffect(() => {
    axios
      .get("https://dumbbers-backend.onrender.com/api/meta/")
      .then((res) => {
        setMeta(res.data);
        setCategories(res.data.data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch category images from respective category pages
  useEffect(() => {
    const fetchCategoryImages = async () => {
      const categoryEndpoints = {
        pants: "https://dumbbers-backend.onrender.com/api/products?category=PANTS",
        boxyvests: "https://dumbbers-backend.onrender.com/api/products?category=BOXY_VESTS",
        compressiontshirts: "https://dumbbers-backend.onrender.com/api/products?category=COMPRESSION_T_SHIRTS",
        oversizedtshirts: "https://dumbbers-backend.onrender.com/api/products?category=OVERSIZED_T_SHIRTS"
      };

      const imagePromises = Object.entries(categoryEndpoints).map(async ([category, endpoint]) => {
        try {
          const response = await axios.get(endpoint);
          const products = response.data?.data?.items || [];
          const firstProductImage = products.length > 0 ? products[0].images?.[0] : null;
          return { category, image: firstProductImage };
        } catch (error) {
          console.error(`Error fetching ${category} products:`, error);
          return { category, image: null };
        }
      });

      const results = await Promise.all(imagePromises);
      const newCategoryImages = {};
      results.forEach(({ category, image }) => {
        newCategoryImages[category] = image;
      });
      setCategoryImages(newCategoryImages);
    };

    fetchCategoryImages();
  }, []);

  return (
    <>
      <div className={style.herosection} id="herosection">
        <Image
          className={style.heroimg}
          src={heroimgurl}
          alt="heroimg"
          width={500}
          height={500}
        />
      </div>
      <div className={style.categoriessection} id="categoriessection">
        <h1>CATEGORIES</h1>
        <div className={style.categorycardscontainer}>
          <Link href="/pants" style={{ textDecoration: "none" }}>
            <Categorycard
              category="PANTS"
              imageUrl={categoryImages.pants || "https://res.cloudinary.com/dziymwwa3/image/upload/v1757352351/pants-category.png"}
            />
          </Link>
          <Link href="/boxyvests" style={{ textDecoration: "none" }}>
            <Categorycard
              category="BOXY VESTS"
              imageUrl={categoryImages.boxyvests || "https://res.cloudinary.com/dziymwwa3/image/upload/v1757352351/boxy-vests-category.png"}
            />
          </Link>
          <Link href="/compressiontshirts" style={{ textDecoration: "none" }}>
            <Categorycard
              category="COMPRESSION T-SHIRTS"
              imageUrl={categoryImages.compressiontshirts || "https://res.cloudinary.com/dziymwwa3/image/upload/v1757352351/compression-tshirts-category.png"}
            />
          </Link>
          <Link href="/oversizedtshirts" style={{ textDecoration: "none" }}>
            <Categorycard
              category="OVERSIZED T-SHIRTS"
              imageUrl={categoryImages.oversizedtshirts || "https://res.cloudinary.com/dziymwwa3/image/upload/v1757352351/oversized-tshirts-category.png"}
            />
          </Link>
        </div>
      </div>
      <div className={style.featuredsection} id="featuredsection">
        <h1>FEATURED PRODUCT</h1>
        <div className={style.featuredproductcard}>
          <div className={style.featuredproductimg}>
            <Image
              src="https://res.cloudinary.com/dziymwwa3/image/upload/v1757352351/4b96e0fe-c199-479d-9e01-f966a521b91c.png"
              alt="featured product"
              width={300}
              height={300}
            />
          </div>
          <div className={style.featuredproductdetails}>
            <h3>DUMBBERS</h3>
            <h3>KYRON WHITE BOXY VEST</h3>
            <h3>RS.999.0</h3>
            <div className={style.buttoncontainer}>
              <button className={style.addtocartbtn}>ADD TO CART</button>
              <button className={style.buyitnowbtn}>BUY IT NOW</button>
            </div>
          </div>
        </div>
      </div>
      <div className={style.contributionsection} id="contributionsection">
        <div className={style.contributionvideo}>
          <video
            src="https://res.cloudinary.com/dziymwwa3/video/upload/v1757356540/WhatsApp_Video_2025-09-09_at_00.02.13_041d5472_tbqrhz.mp4"
            controls
          ></video>
        </div>
        <div className={style.contributiondetails}>
          <div className={style.contributiontext}>
            <h3 className={style.contributionheading}>
              For every 25 orders, we donate 1 dress to needy.Now it's your turn to help them as Citizens.
            </h3>
          </div>
          <div className={style.contributionstats}>
            <div className={style.stat}>
              <h1>NO.OF SALES</h1>
              <h2>0</h2>
            </div>
            <div className={style.stat}>
              <h1>Donations</h1>
              <h2>0</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
