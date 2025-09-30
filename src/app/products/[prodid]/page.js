"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import WishlistButton from '../../components/WishlistButton';
import styles from './products.module.css';
import AuthModal from '../../components/AuthModal';

export default function ProductPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', body: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (params.prodid) {
      fetchProduct();
      fetchReviews();
    }
  }, [params.prodid]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`https://dumbbers-backend.onrender.com/api/products/${params.prodid}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data.product);
        console.log('Product loaded:', data.data.product); // Debug log
        if (data.data.product.variants && data.data.product.variants.length > 0) {
          setSelectedVariant(data.data.product.variants[0]);
          setSelectedSize(data.data.product.variants[0].size);
        }
      } else {
        setMessage('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setMessage('Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setSelectedSize(variant.size);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setMessage('Please select a variant');
      return;
    }

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    const result = await addToCart(product._id, selectedVariant._id, quantity);
    setMessage(result.message);
    
    if (result.success) {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`https://dumbbers-backend.onrender.com/api/products/${params.prodid}/reviews?populate=user`);
      const data = await response.json();
      console.log('Reviews data:', data); // Debug log
      if (data.success) {
        setReviews(data.data.items || []);
        // Check if current user has already reviewed
        checkUserReview(data.data.items || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkUserReview = (reviewsList) => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.sub;
          const hasReviewed = reviewsList.some(review => review.user?._id === userId);
          setUserHasReviewed(hasReviewed);
        } catch (error) {
          console.error('Error checking user review:', error);
        }
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setMessage('Please login to submit a review');
      return;
    }
    if (reviewForm.rating === 0) {
      setMessage('Please select a rating');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://dumbbers-backend.onrender.com/api/products/${params.prodid}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();
      console.log('Review submission response:', data); // Debug log
      if (data.success) {
        setMessage('Review submitted successfully!');
        setReviewForm({ rating: 0, title: '', body: '' });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
        fetchProduct(); // Refresh product to update rating
      } else {
        // Handle specific error cases
        if (data.message && data.message.includes('duplicate key')) {
          setMessage('You have already reviewed this product. You can only submit one review per product.');
        } else {
          setMessage(data.message || 'Failed to submit review');
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage('Error submitting review');
    }
  };

  if (loading) {
    return (
      <div className={styles['product-container']}>
        <div className={styles['loading-state']}>
          <div className={styles['loading-spinner']}></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles['product-container']}>
        <div className={styles['error-state']}>
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const availableSizes = [...new Set(product.variants.map(v => v.size))];
  const getSizeStock = (size) => {
    const variant = product.variants.find(v => v.size === size);
    return variant ? variant.stock : 0;
  };

  return (
    <div className={styles['product-container']}>
      <div className={styles['product-content']}>
        {/* Left Column - Images and Reviews */}
        <div className={styles['left-column']}>
          <div className={styles['product-images']}>
            <div className={styles['main-image']}>
            <Image
              src={product.images[currentImageIndex] || '/placeholder.jpg'}
              alt={product.name}
              width={500}
              height={500}
                className={styles['product-image']}
            />
          </div>
          {product.images.length > 1 && (
              <div className={styles['thumbnail-images']}>
              {product.images.map((image, index) => (
                <button
                  key={index}
                    className={`${styles['thumbnail']} ${index === currentImageIndex ? styles['active'] : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

          {/* Reviews Section - Below images in left column */}
          <div className={styles['reviews-section']}>
            <div className={styles['reviews-header']}>
              <h2>Customer Reviews</h2>
              <button 
                className={styles['add-review-btn']}
                onClick={() => {
                  if (!isAuthenticated) {
                    setAuthModalOpen(true);
                  } else if (!userHasReviewed) {
                    setShowReviewForm(!showReviewForm);
                  }
                }}
                disabled={userHasReviewed}
              >
                {!isAuthenticated ? 'Login to Review' : 
                 userHasReviewed ? 'Already Reviewed' : 'Write a Review'}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && isAuthenticated && !userHasReviewed && (
              <div className={styles['review-form-container']}>
                <form onSubmit={handleReviewSubmit} className={styles['review-form']}>
                  <h3>Write Your Review</h3>
                  
                  <div className={styles['rating-input']}>
                    <label>Rating *</label>
                    <div className={styles['star-rating']}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`${styles['star']} ${reviewForm.rating >= star ? styles['active'] : ''}`}
                          onClick={() => setReviewForm({...reviewForm, rating: star})}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles['form-group']}>
                    <label htmlFor="review-title">Title (Optional)</label>
                    <input
                      type="text"
                      id="review-title"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                      placeholder="Summarize your review"
                    />
                  </div>

                  <div className={styles['form-group']}>
                    <label htmlFor="review-body">Review *</label>
                    <textarea
                      id="review-body"
                      value={reviewForm.body}
                      onChange={(e) => setReviewForm({...reviewForm, body: e.target.value})}
                      placeholder="Tell us about your experience with this product"
                      rows="4"
                      required
                    />
                  </div>

                  <div className={styles['form-actions']}>
                    <button type="button" onClick={() => setShowReviewForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className={styles['submit-review-btn']}>
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Already Reviewed Message */}
            {showReviewForm && isAuthenticated && userHasReviewed && (
              <div className={styles['already-reviewed-message']}>
                <p>You have already reviewed this product. Thank you for your feedback!</p>
                <button 
                  className={styles['close-review-btn']}
                  onClick={() => setShowReviewForm(false)}
                >
                  Close
                </button>
              </div>
            )}

            {/* Reviews List */}
            <div className={styles['reviews-list']}>
              {reviewsLoading ? (
                <div className={styles['reviews-loading']}>
                  <div className={styles['loading-spinner']}></div>
                  <p>Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className={styles['no-reviews']}>
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className={styles['review-item']}>
                    <div className={styles['review-header']}>
                      <div className={styles['review-rating']}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`${styles['star']} ${review.rating >= star ? styles['active'] : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className={styles['review-meta']}>
                        <span className={styles['review-author']}>
                          {review.user?.name || 'Anonymous User'}
                        </span>
                        <span className={styles['review-date']}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {review.title && (
                      <h4 className={styles['review-title']}>{review.title}</h4>
                    )}
                    
                    <p className={styles['review-body']}>{review.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className={styles['right-column']}>
          <div className={styles['product-details']}>
        <div className={styles['product-header']}>
            <div className={styles['product-title-section']}>
              <h1 className={styles['product-name']}>{product.name}</h1>
              <WishlistButton productId={product._id} />
            </div>
            <div className={styles['product-rating']}>
              <span className={styles['rating-stars']}>
                {'★'.repeat(Math.floor(product.ratingAverage))}
                {'☆'.repeat(5 - Math.floor(product.ratingAverage))}
              </span>
              <span className={styles['rating-text']}>
                ({product.ratingCount} reviews)
              </span>
            </div>
          </div>

          <div className={styles['product-description']}>
            <p>{product.description}</p>
          </div>

          <div className={styles['product-price']}>
            {selectedVariant && (
              <>
                <span className={styles['current-price']}>₹{selectedVariant.price}</span>
                {selectedVariant.mrp > selectedVariant.price && (
                  <span className={styles['original-price']}>₹{selectedVariant.mrp}</span>
                )}
                {selectedVariant.mrp > selectedVariant.price && (
                  <span className={styles['discount']}>
                    {Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)}% OFF
                  </span>
                )}
              </>
            )}
          </div>


          <div className={styles['variant-selection']}>
            <div className={styles['size-selection']}>
              <h3>Size</h3>
              <div className={styles['size-options']}>
                {availableSizes.map(size => {
                  const stock = getSizeStock(size);
                  const isDisabled = stock === 0;
                  return (
                  <button
                    key={size}
                      className={`${styles['size-option']} ${selectedSize === size ? styles['selected'] : ''} ${isDisabled ? styles['disabled'] : ''}`}
                    onClick={() => {
                        if (!isDisabled) {
                          const variant = product.variants.find(v => v.size === size);
                      if (variant) handleVariantChange(variant);
                        }
                    }}
                      disabled={isDisabled}
                  >
                    {size}
                      {isDisabled && <span className={styles['out-of-stock']}> (Out of Stock)</span>}
                  </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles['quantity-selection']}>
            <h3>Quantity</h3>
            <div className={styles['quantity-controls']}>
              <button 
                className={styles['quantity-btn']}
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className={styles['quantity-value']}>{quantity}</span>
              <button 
                className={styles['quantity-btn']}
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= (selectedVariant?.stock || 0)}
              >
                +
              </button>
            </div>
            <span className={styles['stock-info']}>
              {selectedVariant ? `${selectedVariant.stock} in stock` : 'Select a variant'}
            </span>
          </div>

          {message && (
            <div className={`${styles['message']} ${message.includes('success') || message.includes('Added') ? styles['success'] : styles['error']}`}>
              {message}
            </div>
          )}

          <div className={styles['product-actions']}>
            <button 
              className={styles['add-to-cart-btn']}
              onClick={handleAddToCart}
              disabled={!selectedVariant}
            >
              {!isAuthenticated ? 'Login to Add to Cart' : 'Add to Cart'}
            </button>
          </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}