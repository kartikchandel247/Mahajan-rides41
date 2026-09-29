import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageBanner from '../components/PageBanner/PageBanner';
import { BLOG_PREVIEW_DATA } from '../data/toursData';
import { AGENCY_CONFIG } from '../config/agencyConfig';
import { openWhatsAppInquiry } from '../utils/whatsapp';
import './BlogPage.scss';

export default function BlogPage({ onNavigateHome, onNavigateDestinations }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      name: "Rohit & Ananya Verma",
      city: "Delhi NCR",
      route: "Manali, Solang & Rohtang Pass 5D/4N",
      rating: 5,
      date: "Recent Tour",
      comment: "Our driver was extremely professional and courteous. The 17-seater Force Tempo Traveller was spotless and drove smoothly through mountain curves. Highly recommend Mahajanrides!"
    },
    {
      id: 2,
      name: "Vikram Singhania",
      city: "Chandigarh",
      route: "Spiti Valley High Passes Circuit",
      rating: 5,
      date: "Recent Tour",
      comment: "Best travel agency for Himachal mountain road trips! Punctual pickup from Chandigarh airport and tailored the itinerary exactly to our family's pace."
    },
    {
      id: 3,
      name: "Meenakshi Iyer",
      city: "Bengaluru",
      route: "Dharamshala, McLeod Ganj & Dalhousie",
      rating: 5,
      date: "Recent Tour",
      comment: "Traveling with senior citizens and kids was so comfortable thanks to the pushback seats and gentle mountain driving. 10/10 service!"
    }
  ]);

  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    city: '',
    route: 'Manali, Solang Valley & Atal Tunnel',
    rating: 5,
    comment: ''
  });

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
      route: 'Manali, Solang Valley & Atal Tunnel',
      rating: 5,
      comment: ''
    });

    setTimeout(() => {
      setFeedbackSuccess(false);
      setFeedbackOpen(false);
    }, 2500);
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
                animate={{ opacity: 1, y: 0 }}
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

          <div className="feedback-cards-grid">
            {feedbacks.map((f) => (
              <div key={f.id} className="review-box">
                <div className="review-box-top">
                  <div>
                    <h4>{f.name}</h4>
                    <span className="review-city"><i className="fa-solid fa-location-dot"></i> {f.city}</span>
                  </div>
                  <div className="review-stars">
                    {[...Array(f.rating)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
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
            ))}
          </div>
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
                        <option value="Manali, Solang Valley & Atal Tunnel">Manali, Solang &amp; Atal Tunnel</option>
                        <option value="Kullu, Kasol & Manikaran Sahib">Kullu, Kasol &amp; Manikaran</option>
                        <option value="Shimla, Kufri & Narkanda Hills">Shimla, Kufri &amp; Narkanda</option>
                        <option value="Dharamshala, McLeod Ganj & Dalhousie">Dharamshala &amp; McLeod Ganj</option>
                        <option value="Spiti Valley & Lahaul Circuit">Spiti Valley &amp; Lahaul Circuit</option>
                        <option value="Bir Billing & Palampur Tea Gardens">Bir Billing &amp; Palampur</option>
                        <option value="Chamba & Khajjiar Sightseeing">Chamba &amp; Khajjiar</option>
                        <option value="Custom Himachal Family Package">Custom Himachal Package</option>
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
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
