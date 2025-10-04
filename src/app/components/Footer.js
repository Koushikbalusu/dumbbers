"use client";
import React from 'react';
import Link from 'next/link';
import { FaInstagram } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaPinterestP } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <img src="/logo.png" alt="Dumbbers" className={styles.logo} />
              <h3 className={styles.brandName}>Dumbbers</h3>
            </div>
            <p className={styles.brandDescription}>
              Your ultimate destination for premium clothing and accessories. 
              Discover the latest trends and express your unique style.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <ul className={styles.linksList}>
              <li><Link href="/" className={styles.footerLink}>Home</Link></li>
              <li><Link href="/products" className={styles.footerLink}>All Products</Link></li>
              <li><Link href="/about" className={styles.footerLink}>About Us</Link></li>
              <li><Link href="/contact" className={styles.footerLink}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Terms & Policies Section */}
          <div className={styles.termsSection}>
            <h4 className={styles.sectionTitle}>Terms & Policies</h4>
            <ul className={styles.linksList}>
              <li><Link href="/terms" className={styles.footerLink}>Terms & Conditions</Link></li>
              <li><Link href="/shipping" className={styles.footerLink}>Shipping Policy</Link></li>
              <li><Link href="/returns-exchange" className={styles.footerLink}>Returns & Exchange</Link></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className={styles.socialSection}>
            <h4 className={styles.sectionTitle}>Follow Us</h4>
            <p className={styles.socialDescription}>
              Stay connected and get the latest updates
            </p>
            <div className={styles.socialLinks}>
              <a
                href="https://www.instagram.com/dumbbersofficials?igsh=cTQ2OGdmNWMxenlj"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className={`${styles.socialIcon} ${styles.instagram}`} />
                Instagram
              </a>
              <a
                href="https://www.facebook.com/share/1J3jyD6n3s/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on Facebook"
              >
                <FaFacebook className={`${styles.socialIcon} ${styles.facebook}`} />
                Facebook
              </a>
              <a
                href="https://youtube.com/@dumbbers?si=nMF5B08xexIXkJSA"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Subscribe to our YouTube channel"
              >
                <AiOutlineYoutube className={`${styles.socialIcon} ${styles.youtube}`} />
                YouTube
              </a>
              <a
                href="https://www.pinterest.com/dumbbers/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on Pinterest"
              >
                <FaPinterestP className={`${styles.socialIcon} ${styles.pinterest}`} />
                Pinterest
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBottomContent}>
            <p className={styles.copyright}>
              © 2024 Dumbbers. All rights reserved.
            </p>
            <div className={styles.bottomLinks}>
              <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
              <span className={styles.separator}>|</span>
              <Link href="/cookies" className={styles.bottomLink}>Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}