import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEATURED_TOURS } from '../../data/toursData';
import { openWhatsAppInquiry } from '../../utils/whatsapp';
import './FeaturedTours.scss';

export default function FeaturedTours() {
  const [selectedTour, setSelectedTour] = useState(null);

  const handleInquire = (tour) => {
    openWhatsAppInquiry({
      tourName: tour.title,
      destination: tour.location,
      days: tour.daysCount,
      vehicle: tour.vehicle
    });
  };

  return (
    <section className="tours-section section-padding" id="tours">
      <span id="destinations" style={{ display: 'block', position: 'relative', top: '-100px', visibility: 'hidden' }}></span>
      <div className="container">
        <div className="tours-grid-layout">
          {/* Pinned Sticky Section Sidebar */}
          <motion.div 
            className="tours-sticky-sidebar"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-subtitle">Himachal Tour Packages</div>
            <h2 className="section-title">Discover dream <i>destinations</i></h2>
            <p>
              Handcrafted itineraries with verified mountain chauffeurs, dedicated Force Tempo Traveller comfort, and 24/7 personal care.
            </p>

            <button 
              className="butn-arrow" 
              style={{ marginTop: '20px' }}
              onClick={() => handleInquire({ title: "Custom Himachal Tour Package", location: "Himachal Pradesh Circuit", daysCount: 5, vehicle: "Force Tempo Traveller" })}
            >
              <span className="btn-text">Plan Custom Tour</span>
              <span className="arrow-wrap">
                <span className="arrow-inner">
                  <i className="fa-solid fa-arrow-right"></i>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </span>
            </button>
          </motion.div>

          {/* Tour Cards Stack */}
          <div className="tour-cards-stack">
            {FEATURED_TOURS.map((tour, idx) => (
              <motion.div 
                key={tour.id} 
                className="tour-card"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="tour-card-media" onClick={() => setSelectedTour(tour)} style={{ cursor: 'pointer' }}>
                  <img src={tour.image} alt={tour.title} loading="lazy" />
                  <span className="tour-badge-top">{tour.tag}</span>
                  <button 
                    className="clicko" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTour(tour);
                    }} 
                    title="View Tour Details & Itinerary"
                    aria-label={`View ${tour.title} tour details`}
                  >
                    <span className="icon-wrap">
                      <i className="fa-solid fa-route"></i>
                    </span>
                  </button>
                </div>

                <div className="tour-card-content">
                  <div>
                    <div className="tour-location-pin">
                      <i className="fa-solid fa-location-dot"></i> {tour.location}
                    </div>
                    <h3 className="tour-title" onClick={() => setSelectedTour(tour)} style={{ cursor: 'pointer' }}>
                      {tour.title}
                    </h3>
                    <p style={{ fontSize: '0.94rem', color: '#5e6282', marginBottom: '14px' }}>
                      {tour.description}
                    </p>
                    <div className="tour-meta-row">
                      <div className="tour-meta-item">
                        <i className="fa-solid fa-clock"></i> {tour.duration}
                      </div>
                      <div className="tour-meta-item">
                        <i className="fa-solid fa-van-shuttle"></i> {tour.vehicle}
                      </div>
                    </div>
                  </div>

                  <div className="tour-footer-row">
                    <div className="tour-rating">
                      <i className="fa-solid fa-star"></i> {tour.rating} <span>({tour.reviewsCount}+ Reviews)</span>
                    </div>
                    
                    <div className="tour-actions-group">
                      <button 
                        className="tour-details-btn"
                        onClick={() => setSelectedTour(tour)}
                        type="button"
                      >
                        <i className="fa-solid fa-circle-info"></i> Tour Details
                      </button>

                      <button 
                        className="tour-whatsapp-action"
                        onClick={() => handleInquire(tour)}
                        type="button"
                      >
                        <i className="fa-brands fa-whatsapp"></i> Inquire on WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Tour Details & Itinerary Modal (Price-Free) */}
        <AnimatePresence>
          {selectedTour && (
            <div className="tour-modal-backdrop" onClick={() => setSelectedTour(null)}>
              <motion.div 
                className="tour-modal-card"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.92, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 25 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <button className="tour-modal-close" onClick={() => setSelectedTour(null)} aria-label="Close modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="tour-modal-header">
                  <img src={selectedTour.image} alt={selectedTour.title} />
                  <div className="tour-modal-header-overlay">
                    <span className="tour-modal-tag">{selectedTour.tag}</span>
                    <h3>{selectedTour.title}</h3>
                    <div className="tour-modal-meta">
                      <span><i className="fa-solid fa-location-dot"></i> {selectedTour.location}</span>
                      <span><i className="fa-solid fa-clock"></i> {selectedTour.duration}</span>
                      <span><i className="fa-solid fa-van-shuttle"></i> {selectedTour.vehicle}</span>
                    </div>
                  </div>
                </div>

                <div className="tour-modal-body">
                  <p className="tour-modal-desc">{selectedTour.description}</p>
                  
                  <div className="tour-itinerary-box">
                    <h4><i className="fa-solid fa-map-location-dot"></i> Route &amp; Sightseeing Highlights:</h4>
                    <ul className="tour-highlights-list">
                      {selectedTour.highlights?.map((item, i) => (
                        <li key={i}>
                          <i className="fa-solid fa-circle-check"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="tour-modal-amenities">
                    <div className="amenity-item">
                      <i className="fa-solid fa-user-shield"></i>
                      <span>Mountain Chauffeur</span>
                    </div>
                    <div className="amenity-item">
                      <i className="fa-solid fa-shield-halved"></i>
                      <span>State Permit &amp; Green Tax</span>
                    </div>
                    <div className="amenity-item">
                      <i className="fa-solid fa-snowflake"></i>
                      <span>Pushback AC Seats</span>
                    </div>
                    <div className="amenity-item">
                      <i className="fa-solid fa-headset"></i>
                      <span>24/7 Road Support</span>
                    </div>
                  </div>

                  <div className="tour-modal-footer">
                    <div className="quote-note">
                      <i className="fa-solid fa-circle-info"></i>
                      <span>Personalized itinerary and custom quotation provided instantly on WhatsApp based on your travel dates.</span>
                    </div>
                    <button 
                      className="butn-whatsapp-modal"
                      onClick={() => {
                        handleInquire(selectedTour);
                        setSelectedTour(null);
                      }}
                      type="button"
                    >
                      <i className="fa-brands fa-whatsapp"></i> Inquire Tour on WhatsApp
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
