"use client";
import React from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Get In Touch</h1>
        
        <p className={styles.intro}>
          Have a question about your order or need help with something else? We're here for you.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Customer Support</h2>
          <p className={styles.supportText}>
            For all inquiries, including support, exchanges, and returns, please email us at:
          </p>
          <div className={styles.emailContainer}>
            <a href="mailto:support@dumbbers.com" className={styles.emailLink}>
              support@dumbbers.com
            </a>
          </div>
          <p className={styles.responseTime}>
            We'll do our best to get back to you as soon as possible.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What We Can Help With</h2>
          <ul className={styles.list}>
            <li>Order inquiries and tracking</li>
            <li>Product questions and sizing help</li>
            <li>Returns and exchanges</li>
            <li>Shipping and delivery issues</li>
            <li>General customer support</li>
            <li>Feedback and suggestions</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Response Time</h2>
          <p className={styles.responseInfo}>
            We typically respond to all inquiries within 24-48 hours during business days. 
            For urgent matters, please mention "URGENT" in your email subject line.
          </p>
        </section>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>Ready to Reach Out?</h3>
          <p>Click the email below to start a conversation with our support team:</p>
          <a href="mailto:support@dumbbers.com" className={styles.ctaEmail}>
            support@dumbbers.com
          </a>
        </div>
      </div>
    </div>
  );
}
