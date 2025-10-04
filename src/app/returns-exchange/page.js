"use client";
import React from 'react';
import styles from './returns-exchange.module.css';

export default function ReturnsExchangePage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Returns & Exchange Policy</h1>
        
        <p className={styles.intro}>
          We want you to love your Dumbbers gear. If something isn't quite right, we're here to help.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>General Conditions for Returns & Exchanges</h2>
          <ul className={styles.list}>
            <li>All requests must be initiated within 7 days of the delivery date.</li>
            <li>The product must be unworn, unwashed, and in its original, saleable condition.</li>
            <li>All original tags and packaging must be intact.</li>
            <li>The product must be received and pass our quality inspection before a refund or exchange is processed.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Exchange Policy</h2>
          <p className={styles.subsectionIntro}>We offer exchanges for size issues or if you have received a defective item.</p>
          
          <h3 className={styles.subsectionTitle}>Process</h3>
          <p>To start an exchange, please email us at support@dumbbers.com with your order details and the reason for the exchange.</p>
          
          <h3 className={styles.subsectionTitle}>Return Shipping</h3>
          <p>Once your request is approved, you will need to ship the product back to us. Return shipping charges are to be borne by the customer, except in the case of defective or damaged items sent by us.</p>
          
          <h3 className={styles.subsectionTitle}>Dispatch</h3>
          <p>After we receive and inspect the item, we will ship your new size/item within 5–7 business days.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Return Policy</h2>
          <p className={styles.subsectionIntro}>If you've changed your mind, we offer hassle-free returns.</p>
          
          <h3 className={styles.subsectionTitle}>Process</h3>
          <p>Refunds will be processed within 7–10 business days after the returned product is received and approved by our team.</p>
          
          <h3 className={styles.subsectionTitle}>Refund Method</h3>
          <p>Refunds will be issued only to the original payment method used for the purchase.</p>
          
          <h3 className={styles.subsectionTitle}>Non-Refundable Charges</h3>
          <p>Shipping charges (if any) applied to your original order are non-refundable.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Non-Returnable & Non-Exchangeable Items</h2>
          <p>The following items are not eligible for a return or exchange:</p>
          <ul className={styles.list}>
            <li>Discounted / Sale items</li>
            <li>Accessories</li>
            <li>Gift cards</li>
            <li>Customized or limited-edition drops</li>
          </ul>
        </section>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>Need Help?</h3>
          <p>For any returns or exchange queries, contact us at:</p>
          <p className={styles.email}>support@dumbbers.com</p>
        </div>
      </div>
    </div>
  );
}
