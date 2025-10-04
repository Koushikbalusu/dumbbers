"use client";
import React from 'react';
import styles from './returns.module.css';

export default function ReturnsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Return Policy</h1>
        
        <p className={styles.intro}>
          If you change your mind, we offer hassle-free returns.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Eligibility for Return</h2>
          <ul className={styles.list}>
            <li>Returns must be initiated within 7 days of delivery.</li>
            <li>Product must be unused, unwashed, and in its original packaging with tags attached.</li>
            <li>Refunds will only be issued if the product is received in acceptable condition after inspection.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Refund Process</h2>
          <ul className={styles.list}>
            <li>Refunds will be processed within 7–10 business days of product approval.</li>
            <li>Refunds will be issued to the original payment method only.</li>
            <li>Shipping charges (if any) are non-refundable.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Non-Returnable Items</h2>
          <ul className={styles.list}>
            <li>Sale items, gift cards, or customized orders cannot be returned.</li>
          </ul>
        </section>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>Need Help?</h3>
          <p>For any return-related queries, contact us at:</p>
          <p className={styles.email}>support@dumbbers.com</p>
        </div>
      </div>
    </div>
  );
}
