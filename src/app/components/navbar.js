"use client";
import Image from "next/image";
import { CiUser, CiSearch, CiHeart } from "react-icons/ci";
import { PiBagSimple } from "react-icons/pi";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Link from "next/link";
import TextCarousel from "./TextCarousel";
import "./navbar.css";
import { useState } from "react";


export default function Navbar() {
  const categories = ["Pants","Boxy vests","Compression t shirts","Oversized t shirts"];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <TextCarousel />
      <nav className="navbar">
        <div className="logo">
          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src="/logo.png"
              alt="logo"
              width={50}
              height={50}
              priority
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>

        <button
          className="mobileMenuToggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>

        <div className={`links ${mobileMenuOpen ? "active" : ""}`}>

          {categories.map((category) => {
            return (
              <Link
                key={category}
                href={`/${category.toLowerCase().replace(/\s+/g, '')}`}
                style={{ textDecoration: "none" }}
              >
                {category.replace(/_/g, " ").toUpperCase()}
              </Link>
            );
          })}
        </div>

        <div className="icons">
          <CiSearch />
          <CiHeart />
          <PiBagSimple />
          <CiUser />
        </div>
      </nav>
    </>
  );
}
