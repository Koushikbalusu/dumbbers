"use client";
import React from 'react';
import styles from './terms.module.css';

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>DUMBBERS – Terms & Conditions</h1>
        
        <p className={styles.intro}>
          Welcome to Dumbbers! By using our website and purchasing our products, you agree to the following terms and conditions. Please read them carefully.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. General</h2>
          <ul className={styles.list}>
            <li>Dumbbers ("we," "our," "us") is a clothing brand specializing in premium streetwear.</li>
            <li>By accessing our website or making a purchase, you agree to abide by these Terms & Conditions.</li>
            <li>We reserve the right to update or modify these terms at any time without prior notice.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Products & Pricing</h2>
          <ul className={styles.list}>
            <li>We strive to display our products as accurately as possible, but colors and textures may slightly vary due to screen differences.</li>
            <li>Prices are subject to change without notice. Applicable taxes and shipping charges will be shown at checkout.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Orders & Payments</h2>
          <ul className={styles.list}>
            <li>All orders are subject to availability and confirmation of payment.</li>
            <li>We accept payments through secure gateways listed on our website.</li>
            <li>In case of failed transactions or incorrect billing information, your order may be canceled.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Shipping & Delivery</h2>
          <ul className={styles.list}>
            <li>For detailed information on shipping timelines and procedures, please refer to our Shipping Policy.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Exchange & Return Policy</h2>
          <ul className={styles.list}>
            <li>For detailed information on eligibility and process, please refer to our Returns & Exchange Policy.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Intellectual Property</h2>
          <ul className={styles.list}>
            <li>All content, logos, images, and designs on Dumbbers are our intellectual property. Unauthorized use, reproduction, or distribution is prohibited.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
          <ul className={styles.list}>
            <li>Dumbbers is not liable for any indirect, incidental, or consequential damages arising from product use or website access.</li>
            <li>Our maximum liability is limited to the value of the purchased product.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Governing Law</h2>
          <ul className={styles.list}>
            <li>These terms are governed by and construed under the laws of India. Any disputes will be subject to the jurisdiction of courts in New Delhi.</li>
          </ul>
        </section>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>Need Help?</h3>
          <p>For any terms-related queries, contact us at:</p>
          <p className={styles.email}>support@dumbbers.com</p>
        </div>

        <div className={styles.quote}>
          <p>"At Dumbbers, we create gear for the streets and the grind. We stand for quality and fairness — so while we keep policies simple, we also expect our fam to respect the rules."</p>
        </div>
      </div>
    </div>
  );
}
