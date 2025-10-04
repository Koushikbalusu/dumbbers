"use client";
import React from 'react';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>About Dumbbers</h1>
        
        <div className={styles.brandSection}>
          <div className={styles.logoContainer}>
            <img src="/logo.png" alt="Dumbbers" className={styles.logo} />
            <h2 className={styles.brandName}>Dumbbers</h2>
          </div>
          <p className={styles.brandDescription}>
            Dumbbers is a clothing brand specializing in premium streetwear.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            At Dumbbers, we create gear for the streets and the grind. We stand for quality and fairness, so while we keep policies simple, we also expect our fam to respect the rules.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What We Do</h2>
          <ul className={styles.list}>
            <li>Specialize in premium streetwear clothing</li>
            <li>Create gear designed for the streets and everyday grind</li>
            <li>Focus on quality and fair practices</li>
            <li>Maintain simple, transparent policies</li>
            <li>Build a community that respects our values</li>
          </ul>
        </section>

        <div className={styles.quote}>
          <p>"Quality and fairness are at the heart of everything we do at Dumbbers."</p>
        </div>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>Get In Touch</h3>
          <p>Want to know more about us? Contact us at:</p>
          <p className={styles.email}>support@dumbbers.com</p>
        </div>
      </div>
    </div>
  );
}
