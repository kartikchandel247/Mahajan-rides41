import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BLOG_PREVIEW_DATA } from '../../data/toursData';
import { openWhatsAppInquiry } from '../../utils/whatsapp';
import { fetchCustomerReviews } from '../../lib/supabase';
import FeedbackModal from '../FeedbackModal/FeedbackModal';
import './BlogPreview.scss';

export default function BlogPreview() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetchCustomerReviews();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const cloud = res.data.map(r => ({
            id: r.id,
            name: r.name,
            city: r.city || "Valued Passenger",
            route: r.tour || "Himachal Mountain Route",
            rating: Number(r.rating) || 5,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "Verified Review",
            comment: r.comment,
            photo: r.photo || null
          }));
          setFeedbacks(cloud);
        }
      } catch (err) {
        console.warn('Could not load blog preview reviews:', err);
      }
    }
    loadReviews();
  }, []);

  const handleInquireArticle = (title) => {
    openWhatsAppInquiry({
      tourName: `Route Query: ${title}`,
      destination: "Tour Guide Route",
      days: 5
    });
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
              viewport={{ once: false, amount: 0.15 }}
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
        {feedbacks.length > 0 && (
          <div className="recent-feedbacks-section">
            <div className="feedbacks-title-row">
              <h4><i className="fa-solid fa-shield-heart text-primary"></i> Verified Passenger Feedbacks</h4>
              <span className="feedbacks-count">{feedbacks.length} Passenger Experiences</span>
            </div>

            <div className="feedbacks-grid">
              {feedbacks.map((f) => (
                <div key={f.id} className={`feedback-card ${f.photo ? 'has-review-photo' : ''}`}>
                  {f.photo && (
                    <div className="feedback-card-photo-wrap">
                      <img src={f.photo} alt={`${f.name}'s trip memory`} className="feedback-card-photo" loading="lazy" />
                      <div className="photo-card-overlay">
                        <div className="overlay-stars-row">
                          {[...Array(f.rating || 5)].map((_, i) => (
                            <i key={i} className="fa-solid fa-star"></i>
                          ))}
                        </div>
                        <span className="overlay-photo-badge">
                          <i className="fa-solid fa-camera"></i> Trip Memory
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="feedback-card-inner">
                    <div className="feedback-card-header">
                      <div>
                        <strong>{f.name}</strong>
                        <span className="feedback-city"><i className="fa-solid fa-location-dot"></i> {f.city}</span>
                      </div>
                      {!f.photo && (
                        <div className="feedback-stars">
                          {[...Array(f.rating || 5)].map((_, i) => (
                            <i key={i} className="fa-solid fa-star"></i>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="feedback-route-tag">
                      <i className="fa-solid fa-route"></i> {f.route}
                    </div>

                    <p className="feedback-text">"{f.comment}"</p>
                    <div className="feedback-badge">
                      <i className="fa-solid fa-circle-check"></i> Verified Rider
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Passenger Feedback Modal */}
        {/* Passenger Feedback Modal */}
        <FeedbackModal 
          isOpen={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          onFeedbackAdded={(newFeedback) => {
            setFeedbacks(prev => [newFeedback, ...prev]);
          }}
        />
      </div>
    </section>
  );
}
