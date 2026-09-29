import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageBanner from '../components/PageBanner/PageBanner';
import BookingBar from '../components/BookingBar/BookingBar';
import { FEATURED_TOURS } from '../data/toursData';
import { openWhatsAppInquiry } from '../utils/whatsapp';
import './DestinationsPage.scss';

export default function DestinationsPage({ onNavigateHome, onNavigateContact }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTour, setSelectedTour] = useState(null);

  const categories = [
    'All',
    'Snow & Passes',
    'Spiritual & Valley',
    'Tibetan & Heritage',
    'High Altitude & Lakes',
    'Adventure & Tea Gardens',
    'Colonial Hills & Pine'
  ];

  const filteredTours = activeCategory === 'All'
    ? FEATURED_TOURS
    : FEATURED_TOURS.filter(t => t.category === activeCategory);

  const handleInquire = (tour) => {
    openWhatsAppInquiry({
      tourName: tour.title,
      destination: tour.location,
      days: tour.daysCount,
      vehicle: tour.vehicle
    });
  };

  return (
    <div className="destinations-page">
      {/* 1. Subpage Header Banner */}
      <PageBanner 
        title="Explore Himachal Destinations"
        subtitle="Custom Force Tempo Traveller Tours"
        breadcrumb="Destinations & Circuits"
        bgImage="/places/himachal_mountain_scenery.jpg"
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Interactive Category Filter Bar */}
      <section className="destinations-filter-section">
        <div className="container">
          <div className="categories-pills-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'All' && <i className="fa-solid fa-mountain"></i>}
                {cat === 'Snow & Passes' && <i className="fa-solid fa-snowflake"></i>}
                {cat === 'Spiritual & Valley' && <i className="fa-solid fa-om"></i>}
                {cat === 'Tibetan & Heritage' && <i className="fa-solid fa-landmark"></i>}
                {cat === 'High Altitude & Lakes' && <i className="fa-solid fa-water"></i>}
                {cat === 'Adventure & Tea Gardens' && <i className="fa-solid fa-parachute-box"></i>}
                {cat === 'Colonial Hills & Pine' && <i className="fa-solid fa-tree"></i>}
                <span>{cat}</span>
              </button>
            ))}
          </div>
          
          <div className="filter-results-info">
            <span>Showing <strong>{filteredTours.length}</strong> handcrafted circuits</span>
            {activeCategory !== 'All' && (
              <button className="reset-filter-btn" onClick={() => setActiveCategory('All')}>
                <i className="fa-solid fa-xmark"></i> Clear Filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Tour Grid Layout */}
      <section className="destinations-grid-section">
        <div className="container">
          <div className="destinations-cards-grid">
            {filteredTours.map((tour, idx) => (
              <motion.div 
                key={tour.id}
                className="destination-card"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <div className="destination-media" onClick={() => setSelectedTour(tour)}>
                  <img src={tour.image} alt={tour.title} loading="lazy" />
                  <div className="badge-row">
                    <span className="dest-tag">{tour.tag}</span>
                    <span className="dest-category">{tour.category}</span>
                  </div>
                  <div className="overlay-hover">
                    <span><i className="fa-solid fa-eye"></i> View Itinerary</span>
                  </div>
                </div>

                <div className="destination-body">
                  <div className="dest-location-badge">
                    <i className="fa-solid fa-location-dot"></i> {tour.location}
                  </div>

                  <h3 className="dest-title" onClick={() => setSelectedTour(tour)}>
                    {tour.title}
                  </h3>

                  <p className="dest-desc">
                    {tour.description}
                  </p>

                  <div className="dest-meta-pills">
                    <div className="meta-pill">
                      <i className="fa-solid fa-clock"></i>
                      <span>{tour.duration}</span>
                    </div>
                    <div className="meta-pill">
                      <i className="fa-solid fa-van-shuttle"></i>
                      <span>{tour.vehicle}</span>
                    </div>
                  </div>

                  <div className="dest-highlights-preview">
                    <strong><i className="fa-solid fa-star"></i> Top Highlights:</strong>
                    <ul>
                      {tour.highlights.slice(0, 3).map((h, i) => (
                        <li key={i}><i className="fa-solid fa-check"></i> {h}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="dest-card-footer">
                    <div className="dest-rating">
                      <i className="fa-solid fa-star"></i> {tour.rating}
                      <span className="reviews-label">({tour.reviewsCount}+ reviews)</span>
                    </div>

                    <div className="dest-actions">
                      <button 
                        type="button" 
                        className="dest-details-btn"
                        onClick={() => setSelectedTour(tour)}
                      >
                        Details
                      </button>
                      <button 
                        type="button" 
                        className="dest-whatsapp-btn"
                        onClick={() => handleInquire(tour)}
                        title="Inquire on WhatsApp"
                      >
                        <i className="fa-brands fa-whatsapp"></i> Inquire
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 4. Fleet & Vehicle Feature Highlight Banner */}
          <div className="destinations-fleet-strip">
            <div className="fleet-strip-content">
              <div className="fleet-strip-badge">
                <i className="fa-solid fa-shield-heart"></i>
                <span>Exclusive Mountain Fleet</span>
              </div>
              <h2>Travel Together In A Luxury 17-Seater Force Tempo Traveller</h2>
              <p>
                All tours are operated in commercially registered Force Tempo Travellers featuring luxury pushback seats, dual AC, panoramic view windows, heavy luggage carriers, and verified Himachal commercial green permits.
              </p>
              <div className="fleet-features-row">
                <div className="fleet-item">
                  <i className="fa-solid fa-couch"></i> Pushback Seats
                </div>
                <div className="fleet-item">
                  <i className="fa-solid fa-snowflake"></i> Dual Powerful AC
                </div>
                <div className="fleet-item">
                  <i className="fa-solid fa-suitcase-rolling"></i> Large Luggage Space
                </div>
                <div className="fleet-item">
                  <i className="fa-solid fa-user-shield"></i> Local Himachali Driver
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Booking Search Bar */}
      <section className="destinations-booking-wrap">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-subtitle">Instant Quotation</span>
            <h2 className="section-title">Ready to Plan Your <i>Himachal Vacation?</i></h2>
            <p>Select your dates and group size below to generate an immediate WhatsApp quote:</p>
          </div>
          <BookingBar />
        </div>
      </section>

      {/* 6. Itinerary Modal */}
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
                  <h4><i className="fa-solid fa-map-location-dot"></i> Detailed Sightseeing &amp; Route Stops:</h4>
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
                    <span>Custom quote and day-wise timing provided instantly on WhatsApp based on your arrival point.</span>
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
  );
}
