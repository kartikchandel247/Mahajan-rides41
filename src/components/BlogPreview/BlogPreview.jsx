import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOG_PREVIEW_DATA } from '../../data/toursData';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import { openWhatsAppInquiry } from '../../utils/whatsapp';
import './BlogPreview.scss';

export default function BlogPreview() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      name: "Rohit & Ananya Verma",
      city: "Delhi NCR",
      route: "Manali & Rohtang Pass 5D/4N",
      rating: 5,
      date: "Just Now",
      comment: "Our driver Mr. Mahajan was extremely professional and courteous. The Innova Crysta was spotless and drove smoothly through mountain curves. Highly recommend!"
    },
    {
      id: 2,
      name: "Vikram Singhania",
      city: "Chandigarh",
      route: "Leh Ladakh High Passes Expedition",
      rating: 5,
      date: "2 days ago",
      comment: "Best travel agency for mountain road trips! Punctual pickup from Chandigarh airport and tailored the itinerary exactly to our family's pace."
    }
  ]);

  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    city: '',
    route: 'Himachal Circuit (Shimla & Manali)',
    rating: 5,
    comment: ''
  });

  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleInquireArticle = (title) => {
    openWhatsAppInquiry({
      tourName: `Route Query: ${title}`,
      destination: "Tour Guide Route",
      days: 5
    });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackForm.name || !feedbackForm.comment) return;

    const newFeedback = {
      id: Date.now(),
      name: feedbackForm.name,
      city: feedbackForm.city || "Valued Passenger",
      route: feedbackForm.route,
      rating: Number(feedbackForm.rating),
      date: "Just now",
      comment: feedbackForm.comment
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setFeedbackSuccess(true);
    setFeedbackForm({
      name: '',
      city: '',
      route: 'Himachal Circuit (Shimla & Manali)',
      rating: 5,
      comment: ''
    });

    setTimeout(() => {
      setFeedbackSuccess(false);
      setFeedbackOpen(false);
    }, 2500);
  };

  const handleWhatsAppFeedback = () => {
    const text = `🌟 *New Passenger Feedback for ${AGENCY_CONFIG.name}*%0A%0A` +
      `👤 *Passenger:* ${encodeURIComponent(feedbackForm.name || 'A traveler')}%0A` +
      `🏙️ *From:* ${encodeURIComponent(feedbackForm.city || 'India')}%0A` +
      `📍 *Route Taken:* ${encodeURIComponent(feedbackForm.route)}%0A` +
      `⭐ *Rating:* ${feedbackForm.rating} / 5 Stars%0A` +
      `💬 *Feedback:* ${encodeURIComponent(feedbackForm.comment || 'Wonderful trip and reliable cab service!')}%0A%0A` +
      `_Sent via Mahajanrides Website Feedback Portal_`;

    window.open(`https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=${text}`, '_blank');
  };

  return (
    <section className="blog-section section-padding" id="blog">
      <div className="container">
        {/* Section Header with Leave Feedback Action */}
        <div className="blog-header-row">
          <div>
            <div className="section-subtitle">Travel Blog &amp; Passenger Voice</div>
            <h2 className="section-title">Travel <i>experience &amp; reviews</i></h2>
          </div>
          
          <button 
            className="butn-arrow" 
            onClick={() => setFeedbackOpen(true)}
            id="leave-feedback-btn"
          >
            <span className="btn-text">Add Passenger Feedback</span>
            <span className="arrow-wrap">
              <span className="arrow-inner">
                <i className="fa-solid fa-arrow-right"></i>
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </span>
          </button>
        </div>

        {/* 3 Travel Story Cards (TourVex layout) */}
        <div className="blog-cards-grid">
          {BLOG_PREVIEW_DATA.map((post, idx) => (
            <motion.div 
              key={post.id}
              className="blog-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="blog-card-media">
                <img src={post.image} alt={post.title} loading="lazy" />
                <span className="blog-card-date"><i className="fa-regular fa-clock"></i> {post.date}</span>
                <button 
                  className="clicko"
                  onClick={() => handleInquireArticle(post.title)}
                  title="Plan This Road Trip on WhatsApp"
                  aria-label={`Plan road trip: ${post.title}`}
                >
                  <span className="icon-wrap">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </span>
                </button>
              </div>

              <div className="blog-card-body">
                <div>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                </div>
                
                <button 
                  className="blog-link-btn"
                  onClick={() => handleInquireArticle(post.title)}
                >
                  Plan This Road Trip <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Verified Passenger Feedbacks Strip */}
        <div className="recent-feedbacks-section">
          <div className="feedbacks-title-row">
            <h4><i className="fa-solid fa-shield-heart text-primary"></i> Verified Passenger Feedbacks</h4>
            <span className="feedbacks-count">{feedbacks.length} Passenger Experiences</span>
          </div>

          <div className="feedbacks-grid">
            {feedbacks.map((f) => (
              <div key={f.id} className="feedback-card">
                <div className="feedback-card-header">
                  <div>
                    <strong>{f.name}</strong>
                    <span className="feedback-city"><i className="fa-solid fa-location-dot"></i> {f.city}</span>
                  </div>
                  <div className="feedback-stars">
                    {[...Array(f.rating)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                </div>

                <div className="feedback-route-tag">
                  <i className="fa-solid fa-route"></i> {f.route}
                </div>

                <p className="feedback-text">"{f.comment}"</p>
                <div className="feedback-badge">
                  <i className="fa-solid fa-circle-check"></i> Verified Rider
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Passenger Feedback Modal */}
        <AnimatePresence>
          {feedbackOpen && (
            <div className="feedback-modal-backdrop" onClick={() => setFeedbackOpen(false)}>
              <motion.div 
                className="feedback-modal-box"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="modal-header">
                  <div>
                    <h3>Share Your Travel Feedback</h3>
                    <p>Help future travelers choose their dream mountain vacation</p>
                  </div>
                  <button className="modal-close-btn" onClick={() => setFeedbackOpen(false)}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                {feedbackSuccess ? (
                  <div className="feedback-success-state">
                    <i className="fa-solid fa-circle-check text-success"></i>
                    <h4>Thank You for Your Feedback!</h4>
                    <p>Your review has been recorded and added to our community stories.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Your Full Name *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Rahul Sharma" 
                          value={feedbackForm.name} 
                          onChange={(e) => setFeedbackForm({...feedbackForm, name: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Your City / State</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Delhi NCR / Mumbai" 
                          value={feedbackForm.city} 
                          onChange={(e) => setFeedbackForm({...feedbackForm, city: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Tour / Route Taken</label>
                        <select 
                          value={feedbackForm.route} 
                          onChange={(e) => setFeedbackForm({...feedbackForm, route: e.target.value})}
                        >
                          <option value="Himachal Circuit (Shimla & Manali)">Himachal (Shimla & Manali)</option>
                          <option value="Leh Ladakh High Passes">Leh Ladakh High Passes</option>
                          <option value="Spiti Valley Cold Desert">Spiti Valley Cold Desert</option>
                          <option value="Kashmir Paradise Tour">Kashmir Paradise Tour</option>
                          <option value="Airport / Outstation Cab Service">Airport / Fleet Transfer</option>
                          <option value="Custom Family Package">Custom Family Package</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Rating (1 to 5 Stars)</label>
                        <div className="star-picker">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              className={`star-btn ${star <= feedbackForm.rating ? 'active' : ''}`}
                              onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                            >
                              <i className="fa-solid fa-star"></i>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Your Trip Experience / Review *</label>
                      <textarea 
                        rows="4" 
                        placeholder="Share details about the driver, vehicle condition, punctuality, and overall trip memories..."
                        value={feedbackForm.comment}
                        onChange={(e) => setFeedbackForm({...feedbackForm, comment: e.target.value})}
                        required
                      ></textarea>
                    </div>

                    <div className="modal-actions-row">
                      <button type="submit" className="butn-arrow">
                        <span className="btn-text">Submit Review</span>
                        <span className="arrow-wrap">
                          <span className="arrow-inner">
                            <i className="fa-solid fa-check"></i>
                            <i className="fa-solid fa-check"></i>
                          </span>
                        </span>
                      </button>

                      <button 
                        type="button" 
                        className="butn-whatsapp"
                        onClick={handleWhatsAppFeedback}
                        title="Send this feedback directly to the agency owner"
                      >
                        <i className="fa-brands fa-whatsapp"></i> Send via WhatsApp
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
