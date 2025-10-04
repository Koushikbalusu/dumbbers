"use client";
import React from 'react';
import styles from './exchange.module.css';

export default function ExchangePage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Exchange Policy</h1>
        
        <p className={styles.intro}>
          We want you to love your Dumbbers gear. If something doesn't fit right, we've got you covered:
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Eligibility for Exchange</h2>
          <ul className={styles.list}>
            <li>Exchange requests must be raised within 7 days of delivery.</li>
            <li>Product must be unworn, unwashed, and in original condition with tags and packaging intact.</li>
            <li>Exchanges are only allowed for size issues or defective items.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Process</h2>
          <ul className={styles.list}>
            <li>Email us at support@dumbbers.com with your order details and reason for exchange.</li>
            <li>Once approved, ship the product back to us. Return shipping charges will be borne by the customer (except in case of defective/damaged items).</li>
            <li>After inspection, we will ship the new size/item within 5–7 business days.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Non-Exchangeable Items</h2>
          <ul className={styles.list}>
            <li>Discounted / Sale items are final and cannot be exchanged.</li>
            <li>Accessories, customized, or limited-edition drops are not eligible for exchange.</li>
          </ul>
        </section>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>Need Help?</h3>
          <p>For any exchange-related queries, contact us at:</p>
          <p className={styles.email}>support@dumbbers.com</p>
        </div>
      </div>
    </div>
  );
}
