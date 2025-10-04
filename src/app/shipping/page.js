"use client";
import React from 'react';
import styles from './shipping.module.css';

export default function ShippingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Shipping & Delivery</h1>
        
        <p className={styles.intro}>
          We are committed to getting your Dumbbers gear to you as quickly as possible.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Delivery Timelines</h2>
          <ul className={styles.list}>
            <li>Our estimated delivery time for orders across India is 5–10 business days.</li>
            <li>Timelines are dependent on your location and our logistics partners.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Please Note</h2>
          <ul className={styles.list}>
            <li>Delays may occur due to unforeseen circumstances such as strikes, natural disasters, or courier-side issues. Dumbbers is not responsible for such delays.</li>
            <li>Applicable shipping charges will be calculated and displayed at checkout.</li>
          </ul>
        </section>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>Need Help?</h3>
          <p>For any shipping-related queries, contact us at:</p>
          <p className={styles.email}>support@dumbbers.com</p>
        </div>
      </div>
    </div>
  );
}
