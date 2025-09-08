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
                width: '100%',
                height: 'auto',
                objectFit: 'contain'
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
        
        <div className={`links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link href="/t-shirts" onClick={closeMobileMenu}>
            T-SHIRTS
          </Link>
          <Link href="/vests" onClick={closeMobileMenu}>
            VESTS
          </Link>
          <Link href="/bottoms" onClick={closeMobileMenu}>
            BOTTOMS
          </Link>
          <Link href="/accessories" onClick={closeMobileMenu}>
            ACCESSORIES
          </Link>
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
