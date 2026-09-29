import { motion } from 'framer-motion';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import './AboutSnippet.scss';

export default function AboutSnippet({ onLearnMore }) {
  const pillars = [
    { icon: "fa-solid fa-earth-americas", title: "Scenic Destinations" },
    { icon: "fa-solid fa-route", title: "Expert Local Guides" },
    { icon: "fa-solid fa-shield-heart", title: "100% Safe Rides" },
    { icon: "fa-solid fa-hotel", title: "Handpicked Stays" },
  ];

  return (
    <section className="about-section section-padding" id="about">
      <div className="container">
        <div className="about-grid">
          {/* Dual Offset Parallax Images */}
          <motion.div 
            className="about-images-wrap"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="about-img-box shift-down">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80" 
                alt="Luxury Travel Ride"
                loading="lazy"
              />
            </div>
            <div className="about-img-box shift-up">
              <img 
                src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800&q=80" 
                alt="Scenic Mountain Journey" 
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Right Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-subtitle">{AGENCY_CONFIG.name} Travel</div>
            <h2 className="section-title">Discover the world <i>with our guide</i></h2>
            <p className="about-text">
              With years of experience curating seamless journeys across North India and iconic international getaways, {AGENCY_CONFIG.name} is committed to delivering safety, punctuality, and memorable road trip stories.
            </p>

            <div className="about-features-list">
              {pillars.map((p, idx) => (
                <div key={idx} className="about-feature-item">
                  <div className="feature-icon-badge">
                    <i className={p.icon}></i>
                  </div>
                  <span>{p.title}</span>
                </div>
              ))}
            </div>

            <div className="reviews-counter-bar">
              <div className="avatar-stack">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Traveler 1" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Traveler 2" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Traveler 3" />
              </div>
              <div className="reviews-stat">
                <h4>9,500+</h4>
                <span>Happy Passenger Reviews</span>
              </div>
              <a href="#tours" className="butn-arrow" onClick={onLearnMore}>
                <span className="btn-text">Read More</span>
                <span className="arrow-wrap">
                  <span className="arrow-inner">
                    <i className="fa-solid fa-arrow-right"></i>
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="bg-text-style">MAHAJAN</div>
    </section>
  );
}
