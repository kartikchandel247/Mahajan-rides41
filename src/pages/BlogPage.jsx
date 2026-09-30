import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageBanner from '../components/PageBanner/PageBanner';
import { BLOG_PREVIEW_DATA } from '../data/toursData';
import { openWhatsAppInquiry } from '../utils/whatsapp';
import { fetchCustomerReviews } from '../lib/supabase';
import FeedbackModal from '../components/FeedbackModal/FeedbackModal';
import './BlogPage.scss';

export default function BlogPage({ onNavigateHome, _onNavigateDestinations }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [feedbacks, setFeedbacks] = useState([]);

  // Load reviews from Supabase backend on mount
  useEffect(() => {
    async function loadCloudReviews() {
      try {
        const res = await fetchCustomerReviews();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const cloudFeedbacks = res.data.map((r) => ({
            id: r.id,
            name: r.name,
            city: r.city || "Valued Passenger",
            route: r.tour || "Himachal Mountain Route",
            rating: Number(r.rating) || 5,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "Verified Review",
            comment: r.comment,
            photo: r.photo || null
          }));
          setFeedbacks(cloudFeedbacks);
        }
      } catch (err) {
        console.warn('Could not load blog feedbacks from Supabase:', err);
      }
    }
    loadCloudReviews();
  }, []);


  const categories = [
    'All',
    'Pass Permits & Routes',
    'Spiritual & Valley',
    'Adventure & Heritage',
    'High Passes & Lakes',
    'Fleet & Comfort',
    'Colonial & Nature'
  ];

  const filteredArticles = activeCategory === 'All'
    ? BLOG_PREVIEW_DATA
    : BLOG_PREVIEW_DATA.filter(a => a.category === activeCategory);

  const handleInquireArticle = (title) => {
    openWhatsAppInquiry({
      tourName: `Route Query: ${title}`,
      destination: "Tour Guide Route",
      days: 5
    });
  };



  return (
    <div className="blog-page">
      {/* 1. Header Banner */}
      <PageBanner 
        title="Himachal Travel Guides & Insights"
        subtitle="Mountain Routes, Permits & Local Tips"
        breadcrumb="Travel Blog & Reviews"
        bgImage="/places/baralacha_la.jpg"
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Category Filter Bar */}
      <section className="blog-filter-section">
        <div className="container">
          <div className="categories-pills-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'All' && <i className="fa-solid fa-book-open"></i>}
                {cat === 'Pass Permits & Routes' && <i className="fa-solid fa-passport"></i>}
                {cat === 'Spiritual & Valley' && <i className="fa-solid fa-om"></i>}
                {cat === 'Adventure & Heritage' && <i className="fa-solid fa-compass"></i>}
                {cat === 'High Passes & Lakes' && <i className="fa-solid fa-mountain-sun"></i>}
                {cat === 'Fleet & Comfort' && <i className="fa-solid fa-van-shuttle"></i>}
                {cat === 'Colonial & Nature' && <i className="fa-solid fa-tree"></i>}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          <div className="filter-results-info">
            <span>Showing <strong>{filteredArticles.length}</strong> travel articles &amp; route guides</span>
            {activeCategory !== 'All' && (
              <button className="reset-filter-btn" onClick={() => setActiveCategory('All')}>
                <i className="fa-solid fa-xmark"></i> Clear Filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Articles Grid */}
      <section className="blog-grid-section section-padding">
        <div className="container">
          <div className="blog-cards-grid">
            {filteredArticles.map((post, idx) => (
              <motion.article 
                key={post.id}
                className="blog-full-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <div className="card-media" onClick={() => setSelectedArticle(post)}>
                  <img src={post.image} alt={post.title} loading="lazy" />
                  <span className="card-category-badge">{post.category}</span>
                  <div className="card-read-pill">
                    <i className="fa-regular fa-clock"></i> {post.readTime || '5 min read'}
                  </div>
                </div>

                <div className="card-body">
                  <div className="card-date">
                    <i className="fa-regular fa-calendar"></i> {post.date}
                  </div>

                  <h3 className="card-title" onClick={() => setSelectedArticle(post)}>
                    {post.title}
                  </h3>

                  <p className="card-excerpt">
                    {post.excerpt}
                  </p>

                  <div className="card-footer">
                    <button 
                      type="button" 
                      className="read-more-btn"
                      onClick={() => setSelectedArticle(post)}
                    >
                      Read Guide <i className="fa-solid fa-arrow-right"></i>
                    </button>

                    <button 
                      type="button" 
                      className="inquire-route-btn"
                      onClick={() => handleInquireArticle(post.title)}
                      title="Plan this route on WhatsApp"
                    >
                      <i className="fa-brands fa-whatsapp"></i> Plan Trip
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Verified Passenger Feedback & Reviews Section */}
      <section className="blog-feedback-section">
        <div className="container">
          <div className="feedback-header-row">
            <div>
              <span className="section-subtitle">Real Traveler Stories</span>
              <h2 className="section-title">Verified Passenger <i>Reviews &amp; Voice</i></h2>
              <p>Read real travel stories from travelers who explored Himachal with us:</p>
            </div>

            <button 
              type="button" 
              className="butn-arrow"
              onClick={() => setFeedbackOpen(true)}
            >
              <span className="btn-text">Share Your Review</span>
              <span className="arrow-wrap">
                <span className="arrow-inner">
                  <i className="fa-solid fa-pen-to-square"></i>
                  <i className="fa-solid fa-pen-to-square"></i>
                </span>
              </span>
            </button>
          </div>

          {feedbacks.length === 0 ? (
            <div className="no-feedbacks-card">
              <div className="no-feedbacks-icon">
                <i className="fa-regular fa-comments"></i>
              </div>
              <h3>Be the First to Share Your Travel Story</h3>
              <p>Traveled on our Himachal routes recently? Share your honest road trip review and tips for future travelers!</p>
              <button 
                type="button" 
                className="butn-arrow"
                onClick={() => setFeedbackOpen(true)}
              >
                <span className="btn-text">Share Your Review</span>
                <span className="arrow-wrap">
                  <span className="arrow-inner">
                    <i className="fa-solid fa-pen-to-square"></i>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </span>
                </span>
              </button>
            </div>
          ) : (
            <div className="feedback-cards-grid">
              {feedbacks.map((f) => (
                <div key={f.id} className={`review-box ${f.photo ? 'has-review-photo' : ''}`}>
                  {f.photo && (
                    <div className="review-photo-container">
                      <img src={f.photo} alt={`${f.name}'s Himachal trip memory`} className="review-card-photo" loading="lazy" />
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

                  <div className="review-box-inner">
                    <div className="review-box-top">
                      <div>
                        <h4>{f.name}</h4>
                        <span className="review-city"><i className="fa-solid fa-location-dot"></i> {f.city}</span>
                      </div>
                      {!f.photo && (
                        <div className="review-stars">
                          {[...Array(f.rating || 5)].map((_, i) => (
                            <i key={i} className="fa-solid fa-star"></i>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="review-route-badge">
                      <i className="fa-solid fa-route"></i> {f.route}
                    </div>

                    <p className="review-text">"{f.comment}"</p>

                    <div className="review-box-footer">
                      <span className="verified-badge"><i className="fa-solid fa-circle-check"></i> Verified Rider</span>
                      <span className="review-date">{f.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="article-modal-backdrop" onClick={() => setSelectedArticle(null)}>
            <motion.div 
              className="article-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 25 }}
              transition={{ duration: 0.3 }}
            >
              <button className="modal-close-btn" onClick={() => setSelectedArticle(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div className="article-modal-media">
                <img src={selectedArticle.image} alt={selectedArticle.title} />
                <div className="article-modal-overlay">
                  <span className="article-badge">{selectedArticle.category}</span>
                  <h3>{selectedArticle.title}</h3>
                  <div className="article-meta">
                    <span><i className="fa-regular fa-calendar"></i> {selectedArticle.date}</span>
                    <span><i className="fa-regular fa-clock"></i> {selectedArticle.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="article-modal-body">
                <div className="article-lead">{selectedArticle.excerpt}</div>
                <div className="article-content-text">
                  <p>{selectedArticle.content}</p>
                  <h4>Essential Road Trip Takeaways:</h4>
                  <ul>
                    <li><i className="fa-solid fa-check text-primary"></i> <strong>Vehicle Choice:</strong> High mountain passes require vehicles with strong torque and ample ground clearance, such as our 17-seater Force Tempo Traveller.</li>
                    <li><i className="fa-solid fa-check text-primary"></i> <strong>Permits &amp; Green Tax:</strong> Rohtang Pass requires online green permits with strict vehicle quotas. Our chauffeurs handle all paperwork in advance.</li>
                    <li><i className="fa-solid fa-check text-primary"></i> <strong>Weather Windows:</strong> Snowfall can cause sudden road advisories at Kunzum Pass or Rohtang. Local chauffeurs ensure route safety at all times.</li>
                  </ul>
                </div>

                <div className="article-modal-footer">
                  <button 
                    type="button" 
                    className="butn-whatsapp"
                    onClick={() => {
                      handleInquireArticle(selectedArticle.title);
                      setSelectedArticle(null);
                    }}
                  >
                    <i className="fa-brands fa-whatsapp"></i> Inquire About This Route on WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Leave Feedback Modal */}
      <FeedbackModal 
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onFeedbackAdded={(newFeedback) => {
          setFeedbacks(prev => [newFeedback, ...prev]);
        }}
      />
    </div>
  );
}
