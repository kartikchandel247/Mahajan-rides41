import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import { fetchCustomerReviews, saveCustomerReview } from '../../lib/supabase';
import './Testimonials.scss';

const TOUR_OPTIONS = [
  "Manali, Atal Tunnel & Rohtang Pass",
  "Kasol, Manikaran Sahib & Tosh",
  "Spiti Valley & Chandratal Expedition",
  "Dharamshala, McLeodGanj & Kangra Fort",
  "Dalhousie, Khajjiar & Chamba",
  "Shimla, Kufri & Narkanda Hills",
  "Bir Billing Paragliding & Palampur",
  "Custom Himachal Round Trip"
];

const RATING_LABELS = {
  1: "1/5 - Poor Experience",
  2: "2/5 - Fair Journey",
  3: "3/5 - Good Trip",
  4: "4/5 - Very Good Experience",
  5: "5/5 - Outstanding Trip & Force Tempo!"
};

export default function Testimonials() {
  const [reviews, setReviews] = useState(() => {
    try {
      localStorage.removeItem('mahajan_rides_user_reviews');
      localStorage.removeItem('mahajan_rides_reviews_v1');
    } catch {
      // ignore
    }
    return [];
  });

  const [activeId, setActiveId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'stories' | 'recent'
  const [hoverRating, setHoverRating] = useState(0);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    tour: TOUR_OPTIONS[0],
    rating: 5,
    quote: ''
  });

  // Calculate authentic statistics
  const totalReviewsCount = reviews.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : "5.0";

  // Fetch permanently saved reviews from Supabase on mount
  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetchCustomerReviews();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const cloudReviews = res.data.map((r) => ({
            id: r.id,
            tour: r.tour || TOUR_OPTIONS[0],
            name: r.name,
            city: r.city || 'Himachal Passenger',
            rating: Number(r.rating) || 5,
            quote: r.comment,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Verified Trip',
            verified: r.verified ?? true,
            isUserAdded: true,
            image: r.photo || '/places/himachal_mountain_scenery.jpg',
            photo: r.photo || null,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.name)}&backgroundColor=2095ae,0f2454`
          }));
          setReviews(cloudReviews);
          if (cloudReviews[0]?.id) {
            setActiveId(cloudReviews[0].id);
          }
        }
      } catch (err) {
        console.warn('Could not load Supabase reviews:', err);
      }
    }
    loadReviews();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (ratingVal) => {
    setFormData((prev) => ({ ...prev, rating: ratingVal }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) {
      return;
    }

    const newReview = {
      id: Date.now(),
      tour: formData.tour,
      name: formData.name.trim(),
      city: formData.city.trim() || 'Himachal Passenger',
      rating: Number(formData.rating),
      quote: formData.quote.trim(),
      date: 'Just now',
      verified: true,
      isUserAdded: true,
      image: '/places/himachal_mountain_scenery.jpg',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name.trim())}&backgroundColor=2095ae,0f2454`
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);

    // 1. Permanently save to Supabase database
    saveCustomerReview(newReview).catch((err) => {
      console.warn('Supabase review save error:', err);
    });

    // 2. Also save to localStorage as instant offline fallback
    try {
      const userAddedOnly = updated.filter((r) => r.isUserAdded);
      localStorage.setItem('mahajan_rides_reviews_v1', JSON.stringify(userAddedOnly));
    } catch (err) {
      console.error('Could not save to localStorage', err);
    }

    setSubmittedSuccess(true);
    setFormData({
      name: '',
      city: '',
      tour: TOUR_OPTIONS[0],
      rating: 5,
      quote: ''
    });

    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowForm(false);
    }, 4000);
  };

  const handleWhatsAppReview = () => {
    if (!formData.name.trim() || !formData.quote.trim()) {
      alert('Please fill in your name and review message first.');
      return;
    }
    const text = `*New Trip Review for Mahajanrides*\n\n*Name:* ${formData.name}\n*City:* ${formData.city || 'Himachal'}\n*Tour:* ${formData.tour}\n*Rating:* ${'⭐'.repeat(formData.rating)} (${formData.rating}/5)\n\n*Feedback:* ${formData.quote}`;
    window.open(`https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const userAddedReviews = reviews.filter((r) => r.isUserAdded);
  const featuredStories = reviews.slice(0, 3);

  return (
    <section className="testimonials-section section-padding" id="reviews">
      {/* Anchor for backward compatibility with #testimonials */}
      <span id="testimonials" style={{ position: 'relative', top: '-80px', display: 'block' }}></span>

      <div className="container">
        {/* Section Header */}
        <motion.div 
          className="reviews-header-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <div className="section-subtitle">Traveler Reviews &amp; Feedback</div>
            <h2 className="section-title">
              Our happy <i>traveller stories</i>
            </h2>
          </div>

          {/* Rating Summary & Add Review CTA */}
          <div className="reviews-summary-actions">
            <div className="rating-score-pill">
              <div className="score-num">{totalReviewsCount > 0 ? averageRating : "5.0"}</div>
              <div className="score-meta">
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star"></i>
                  ))}
                </div>
                <span>{totalReviewsCount > 0 ? `${totalReviewsCount} Verified Reviews` : "Be The First To Review"}</span>
              </div>
            </div>

            <button 
              type="button" 
              className={`btn-add-review ${showForm ? 'active' : ''}`}
              onClick={() => {
                setShowForm(!showForm);
                setSubmittedSuccess(false);
              }}
            >
              <i className={showForm ? "fa-solid fa-xmark" : "fa-solid fa-pen-to-square"}></i>
              <span>{showForm ? 'Close Form' : 'Write a Review / Feedback'}</span>
            </button>
          </div>
        </motion.div>

        {/* Success Confirmation Toast */}
        <AnimatePresence>
          {submittedSuccess && (
            <motion.div 
              className="review-success-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="success-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="success-text">
                <h4>Thank You for Your Feedback!</h4>
                <p>Your review has been successfully published on Mahajan Rides. We look forward to serving you again!</p>
              </div>
              <button className="close-toast" onClick={() => setSubmittedSuccess(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expandable Review Submission Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              className="review-form-card"
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="form-card-header">
                <div className="form-title-group">
                  <span className="form-kicker">Post-Trip Feedback</span>
                  <h3>Share Your Himachal Journey Experience</h3>
                  <p>Traveled with our Force Tempo Traveller? Your real feedback helps fellow tourists and inspires our local team!</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="review-actual-form">
                <div className="form-grid-fields">
                  {/* Name */}
                  <div className="review-field">
                    <label htmlFor="revName">
                      <i className="fa-solid fa-user"></i> Your Full Name *
                    </label>
                    <input 
                      type="text" 
                      id="revName" 
                      name="name" 
                      placeholder="e.g. Rahul Sharma" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  {/* City */}
                  <div className="review-field">
                    <label htmlFor="revCity">
                      <i className="fa-solid fa-city"></i> City / Origin
                    </label>
                    <input 
                      type="text" 
                      id="revCity" 
                      name="city" 
                      placeholder="e.g. Chandigarh / Delhi NCR / Mumbai" 
                      value={formData.city} 
                      onChange={handleChange} 
                    />
                  </div>

                  {/* Tour Route */}
                  <div className="review-field full-width">
                    <label htmlFor="revTour">
                      <i className="fa-solid fa-route"></i> Himachal Tour / Place Visited
                    </label>
                    <select 
                      id="revTour" 
                      name="tour" 
                      value={formData.tour} 
                      onChange={handleChange}
                    >
                      {TOUR_OPTIONS.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Interactive Star Rating */}
                  <div className="review-field full-width rating-picker-box">
                    <label>
                      <i className="fa-solid fa-star"></i> Rate Your Experience with Mahajan Rides *
                    </label>
                    <div className="interactive-stars-wrap">
                      <div className="star-icons">
                        {[1, 2, 3, 4, 5].map((starVal) => {
                          const isLit = (hoverRating || formData.rating) >= starVal;
                          return (
                            <button
                              key={starVal}
                              type="button"
                              className={`star-btn ${isLit ? 'lit' : ''}`}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => handleRatingClick(starVal)}
                              title={`${starVal} Star`}
                            >
                              <i className="fa-solid fa-star"></i>
                            </button>
                          );
                        })}
                      </div>
                      <span className="rating-feedback-badge">
                        {RATING_LABELS[hoverRating || formData.rating]}
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="review-field full-width">
                    <label htmlFor="revQuote">
                      <i className="fa-solid fa-message"></i> Your Review &amp; Vehicle Experience *
                    </label>
                    <textarea 
                      id="revQuote" 
                      name="quote" 
                      rows="4" 
                      placeholder="Tell future travelers about our Force Tempo Traveller comfort, mountain driver skill, timing, and scenic stops..." 
                      value={formData.quote} 
                      onChange={handleChange} 
                      required 
                    ></textarea>
                  </div>
                </div>

                <div className="form-submit-row">
                  <button type="submit" className="btn-submit-review">
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Publish Review</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-whatsapp-review"
                    onClick={handleWhatsAppReview}
                    title="Send review on WhatsApp"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>Share on WhatsApp</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-cancel-review"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {reviews.length === 0 ? (
          <div className="no-reviews-card">
            <div className="no-reviews-icon">
              <i className="fa-regular fa-comments"></i>
            </div>
            <h3>Be the First to Review Your Journey</h3>
            <p>
              Recently traveled in our 17-seater luxury Force Tempo Traveller? Share your mountain road trip memories, driver rating, and feedback to help fellow travelers!
            </p>
            <div className="no-reviews-btn-row">
              <button 
                type="button" 
                className="btn-add-review"
                onClick={() => {
                  setShowForm(true);
                  setSubmittedSuccess(false);
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
                <span>Write a Passenger Review</span>
              </button>

              <a 
                href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=${encodeURIComponent("Hi Atish ji, I would like to share a review for our Himachal trip with Mahajan Rides.")}`}
                target="_blank" 
                rel="noreferrer" 
                className="btn-whatsapp-action"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Filters */}
            <div className="reviews-tab-nav">
              <button 
                type="button" 
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <span>All Reviews</span>
                <span className="count-pill">{reviews.length}</span>
              </button>

              <button 
                type="button" 
                className={`tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
                onClick={() => setActiveTab('stories')}
              >
                <span>Featured Spotlight</span>
              </button>

              {userAddedReviews.length > 0 && (
                <button 
                  type="button" 
                  className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recent')}
                >
                  <span>Guest Submissions</span>
                  <span className="count-pill highlight">{userAddedReviews.length}</span>
                </button>
              )}
            </div>

            {/* Tab Content: Spotlight Expandable Accordions */}
            {(activeTab === 'stories' || activeTab === 'all') && featuredStories.length > 0 && (
              <div className="featured-stories-block">
                {activeTab === 'all' && (
                  <div className="block-subtitle">Featured Passenger Journeys</div>
                )}
                <div className="testimonials-expand-container">
                  {featuredStories.map((t) => {
                    const isActive = activeId === t.id;

                    return (
                      <div 
                        key={t.id} 
                        className={`testi-expand-item ${isActive ? 'active' : ''}`}
                        onMouseEnter={() => setActiveId(t.id)}
                        onClick={() => setActiveId(t.id)}
                      >
                        <div className="testi-img-wrap">
                          <img src={t.image || '/places/himachal_mountain_scenery.jpg'} alt={t.tour} loading="lazy" />
                        </div>

                        <div className="testi-cont">
                          <div className="testi-cont-inner">
                            <span className="testi-tour-tag">Verified Trip</span>
                            <h3 className="testi-tour-name">{t.tour}</h3>
                            
                            <div className="testi-rating">
                              {[...Array(t.rating || 5)].map((_, i) => (
                                <i key={i} className="fa-solid fa-star"></i>
                              ))}
                            </div>

                            <p className="testi-quote">"{t.quote}"</p>

                            <div className="testi-travellers-row">
                              <div className="traveller-avatars">
                                <img src={t.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}&backgroundColor=2095ae,0f2454`} alt={t.name} />
                                <span className="avatars-badge">
                                  <i className="fa-solid fa-check"></i>
                                </span>
                              </div>
                              <div className="traveller-info">
                                <strong>{t.name}</strong>
                                <small>{t.city}</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grid of Community Reviews (Recent & All) */}
            {(activeTab === 'all' || activeTab === 'recent') && (
              <div className="community-reviews-grid-wrap">
                <div className="block-subtitle">
                  {activeTab === 'recent' ? 'Recent Passenger Feedbacks' : 'Community Traveler Feedbacks'}
                </div>

                <div className="reviews-cards-grid">
                  {(activeTab === 'recent' ? userAddedReviews : reviews).map((rev) => (
                    <div 
                      key={rev.id} 
                      className={`review-card-item ${rev.isUserAdded ? 'user-submitted' : ''}`}
                    >
                      <div className="review-card-top">
                        <div className="review-stars">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <i key={i} className="fa-solid fa-star"></i>
                          ))}
                        </div>
                        {rev.isUserAdded ? (
                          <span className="card-badge new-badge">
                            <i className="fa-solid fa-sparkles"></i> Guest Review
                          </span>
                        ) : (
                          <span className="card-badge verified-badge">
                            <i className="fa-solid fa-certificate"></i> Verified Trip
                          </span>
                        )}
                      </div>

                      <div className="review-tour-route">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>{rev.tour}</span>
                      </div>

                      <p className="review-quote-text">
                        "{rev.quote}"
                      </p>

                      <div className="review-card-footer">
                        <div className="reviewer-avatar">
                          {rev.avatar ? (
                            <img src={rev.avatar} alt={rev.name} />
                          ) : (
                            <div className="avatar-initials">
                              {rev.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="reviewer-meta">
                          <h5>{rev.name}</h5>
                          <span>{rev.city} &bull; {rev.date || 'Verified Traveler'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
