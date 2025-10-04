"use client";
import Image from "next/image";
import React from "react";
import style from "./home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Categorycard from "./components/Categorycard";
import Link from "next/link";

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
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/meta/`)
      .then((res) => {
        setMeta(res.data);
        setCategories(res.data.data.categories);
      })
      .catch((err) => {
        console.error("Error fetching meta data:", err);
        // Set fallback data
        setMeta({ data: { categories: [] } });
        setCategories([]);
      });
  }, []);

  // Fetch category images from respective category pages
  useEffect(() => {
    const fetchCategoryImages = async () => {
      const categoryEndpoints = {
        pants: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?category=PANTS`,
        boxyvests: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?category=BOXY_VESTS`,
        compressiontshirts: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?category=COMPRESSION_T_SHIRTS`,
        oversizedtshirts: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?category=OVERSIZED_T_SHIRTS`
      };

      const imagePromises = Object.entries(categoryEndpoints).map(async ([category, endpoint]) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000); // fail faster
          const response = await axios.get(endpoint, {
            timeout: 6500,
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' }
          });
          clearTimeout(timeoutId);
          const products = response.data?.data?.items || [];
          const firstProductImage = products.length > 0 ? products[0].images?.[0] : null;
          return { category, image: firstProductImage };
        } catch (error) {
          // downgrade to debug noise
          if (process.env.NODE_ENV !== 'production') {
            console.debug(`Category ${category} image fetch fallback:`, error?.message || error);
          }
          return { category, image: `/placeholder-${category}.svg` };
        }
      });

      try {
        const results = await Promise.all(imagePromises);
        const newCategoryImages = {};
        results.forEach(({ category, image }) => {
          newCategoryImages[category] = image;
        });
        setCategoryImages(newCategoryImages);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.debug("fetchCategoryImages fallback:", error?.message || error);
        }
        // Set fallback images
        setCategoryImages({
          pants: "/placeholder-pants.svg",
          boxyvests: "/placeholder-boxyvests.svg",
          compressiontshirts: "/placeholder-compressiontshirts.svg",
          oversizedtshirts: "/placeholder-oversizedtshirts.svg"
        });
      }
    };

    fetchCategoryImages();
  }, []);

  return (
    <>
      <div className={style.herosection} id="herosection">
        <div className={style.herocontent}>
          <div className={style.herotext}>
            <h1 className={style.herotitle}>DUMBBERS</h1>
            <p className={style.herosubtitle}>Premium Athletic Wear</p>
            <p className={style.herodescription}>
              Elevate your performance with our cutting-edge athletic wear designed for champions. 
              Experience the perfect blend of style, comfort, and functionality.
            </p>
            <div className={style.herobuttons}>
              <button 
                className={style.ctabutton}
                onClick={() => {
                  document.getElementById('categoriessection')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                Explore Collections
              </button>
              <button 
                className={style.secondarybutton}
                onClick={() => {
                  document.getElementById('featuredsection')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                Featured Product
              </button>
            </div>
          </div>
          <div className={style.herovisual}>
            <div className={style.herobanner}>
              {/* Background images handled via CSS for responsive design */}
            </div>
          </div>
        </div>
      </div>
      <div className={style.categoriessection} id="categoriessection">
        <h1>CATEGORIES</h1>
        <div className={style.categorycardscontainer}>
          <Link href="/pants" style={{ textDecoration: "none" }}>
            <Categorycard
              category="PANTS"
              imageUrl={categoryImages.pants || "/placeholder-pants.svg"}
            />
          </Link>
          <Link href="/boxyvests" style={{ textDecoration: "none" }}>
            <Categorycard
              category="BOXY VESTS"
              imageUrl={categoryImages.boxyvests || "/placeholder-boxyvests.svg"}
            />
          </Link>
          <Link href="/compressiontshirts" style={{ textDecoration: "none" }}>
            <Categorycard
              category="COMPRESSION T-SHIRTS"
              imageUrl={categoryImages.compressiontshirts || "/placeholder-compressiontshirts.svg"}
            />
          </Link>
          <Link href="/oversizedtshirts" style={{ textDecoration: "none" }}>
            <Categorycard
              category="OVERSIZED T-SHIRTS"
              imageUrl={categoryImages.oversizedtshirts || "/placeholder-oversizedtshirts.svg"}
            />
          </Link>
        </div>
      </div>
      <div className={style.featuredsection} id="featuredsection">
        <h1>FEATURED PRODUCT</h1>
        <div className={style.featuredproductcard}>
          <div className={style.featuredproductimg}>
            <Image
              src="https://res.cloudinary.com/dziymwwa3/image/upload/v1758299369/926c4d73-9ddf-41ff-bbf0-869791122708.png"
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
                  <h2>700</h2>
                </div>
                <div className={style.stat}>
                  <h1>Donations</h1>
                  <h2>250</h2>
                </div>
              </div>
        </div>
      </div>
    </>
  );
}
