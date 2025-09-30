"use client";
import { useEffect } from "react";
import "./TextCarousel.css";

export default function TextCarousel() {
  useEffect(() => {
    const initCarousel = async () => {
      if (typeof window !== "undefined") {
        // Small delay to ensure DOM is ready
        setTimeout(async () => {
          try {
            const { Carousel } = await import("bootstrap");
            const carouselElement = document.getElementById("textCarousel");
            if (carouselElement) {
              // Dispose any existing carousel first
              const existingCarousel = Carousel.getInstance(carouselElement);
              if (existingCarousel) {
                existingCarousel.dispose();
              }
              
              // Create new carousel
              new Carousel(carouselElement, {
                interval: 2000,
                wrap: true,
                touch: false
              });
            }
          } catch (error) {
            console.error('Error initializing carousel:', error);
          }
        }, 100);
      }
    };

    initCarousel();
  }, []);

  return (
    <div className="textCarouselContainer">
      <div
        id="textCarousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="textCarouselMessage">
              LOVED BY OVER 200,000+ HAPPY CUSTOMERS! ⭐
            </div>
          </div>
          <div className="carousel-item">
            <div className="textCarouselMessage">
              FREE SHIPPING ON ORDERS OVER $50 🚚
            </div>
          </div>
          <div className="carousel-item">
            <div className="textCarouselMessage">
              NEW ARRIVALS JUST DROPPED! 🔥
            </div>
          </div>
        </div>
        
        {/* Left Arrow */}
        <button 
          className="carousel-control-prev" 
          type="button" 
          data-bs-target="#textCarousel" 
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        
        {/* Right Arrow */}
        <button 
          className="carousel-control-next" 
          type="button" 
          data-bs-target="#textCarousel" 
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
