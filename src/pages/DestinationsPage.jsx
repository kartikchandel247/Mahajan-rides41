import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageBanner from '../components/PageBanner/PageBanner';
import BookingBar from '../components/BookingBar/BookingBar';
import { FEATURED_TOURS } from '../data/toursData';
import './DestinationsPage.scss';

export default function DestinationsPage({ onNavigateHome, _onNavigateContact, onNavigateBooking }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPlace, setSelectedPlace] = useState('All Places');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedTourForQuote, setSelectedTourForQuote] = useState('');

  const categories = [
    { id: 'All', label: 'All Tourist Places', icon: 'fa-solid fa-mountain' },
    { id: 'Snow & High Passes', label: 'Snow & High Passes', icon: 'fa-solid fa-snowflake' },
    { id: 'Spiritual & Sacred Temples', label: 'Spiritual & Sacred Temples', icon: 'fa-solid fa-om' },
    { id: 'Tibetan & Monasteries', label: 'Tibetan & Monasteries', icon: 'fa-solid fa-landmark' },
    { id: 'Alpine Lakes & High Altitude', label: 'Alpine Lakes & High Altitude', icon: 'fa-solid fa-water' },
    { id: 'Adventure & Valleys', label: 'Adventure & Valleys', icon: 'fa-solid fa-parachute-box' },
    { id: 'Colonial Hills & Pine', label: 'Colonial Hills & Pine', icon: 'fa-solid fa-tree' },
  ];

  const popularPlaces = [
    'All Places',
    'Manali',
    'Rohtang Pass',
    'Atal Tunnel',
    'Shimla',
    'Kufri',
    'Kasol',
    'Manikaran',
    'Dharamshala',
    'McLeod Ganj',
    'Spiti Valley',
    'Chandratal',
    'Khajjiar',
    'Dalhousie',
    'Bir Billing',
    'Palampur',
    'Chitkul',
    'Sangla',
    'Jibhi',
    'Tirthan Valley',
    'Keylong',
    'Baralacha La',
    'Prashar Lake',
    'Mandi',
    'Kasauli',
    'Chamba',
    'Bharmour'
  ];

  // Comprehensive filter logic
  const filteredTours = FEATURED_TOURS.filter(tour => {
    // 1. Category check
    const matchesCategory = activeCategory === 'All' || tour.category === activeCategory;

    // 2. Popular place quick-pill check
    const matchesPlace = selectedPlace === 'All Places' || 
      tour.placesCovered?.some(p => p.toLowerCase().includes(selectedPlace.toLowerCase())) ||
      tour.location.toLowerCase().includes(selectedPlace.toLowerCase()) ||
      tour.title.toLowerCase().includes(selectedPlace.toLowerCase());

    // 3. Search query check
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q ||
      tour.title.toLowerCase().includes(q) ||
      tour.location.toLowerCase().includes(q) ||
      tour.description.toLowerCase().includes(q) ||
      tour.placesCovered?.some(p => p.toLowerCase().includes(q)) ||
      tour.highlights?.some(h => h.toLowerCase().includes(q));

    return matchesCategory && matchesPlace && matchesSearch;
  });

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim() && activeCategory !== 'All') {
      setActiveCategory('All');
    }
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    if (place !== 'All Places' && activeCategory !== 'All') {
      setActiveCategory('All');
    }
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSelectedPlace('All Places');
    setSearchTerm('');
  };

  // Helper to count tours per category
  const getCategoryCount = (catId) => {
    if (catId === 'All') return FEATURED_TOURS.length;
    return FEATURED_TOURS.filter(t => t.category === catId).length;
  };

  return (
    <div className="destinations-page">
      {/* 1. Subpage Header Banner */}
      <PageBanner 
        title="Explore Himachal Tourist Places"
        subtitle="17-Seater Luxury Force Tempo Traveller Circuits"
        breadcrumb="Destinations & Circuits"
        bgImage="/places/himachal_mountain_scenery.jpg"
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Comprehensive Filter & Search Suite */}
      <section className="destinations-filter-section">
        <div className="container">
          {/* Instant Search Bar */}
          <div className="destinations-search-box">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input 
              type="text"
              placeholder="Search any Himachal place (e.g. Rohtang, Spiti, Khajjiar, Chitkul, Jibhi, Shimla, Kasol...)"
              value={searchTerm}
              onChange={handleSearchChange}
              className="destinations-search-input"
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')} aria-label="Clear search">
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Category Filter Pills with Live Counts */}
          <div className="categories-pills-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <i className={cat.icon}></i>
                <span>{cat.label}</span>
                <span className="pill-count">({getCategoryCount(cat.id)})</span>
              </button>
            ))}
          </div>

          {/* Popular Tourist Spots Quick-Filter Cloud */}
          <div className="places-cloud-strip">
            <span className="places-cloud-title">
              <i className="fa-solid fa-location-crosshairs"></i> Quick Tourist Spots:
            </span>
            <div className="places-cloud-list">
              {popularPlaces.map((place) => (
                <button
                  key={place}
                  type="button"
                  className={`place-tag-btn ${selectedPlace === place ? 'active' : ''}`}
                  onClick={() => handlePlaceClick(place)}
                >
                  {place}
                </button>
              ))}
            </div>
          </div>
          
          {/* Filter Status & Active Reset */}
          <div className="filter-results-info">
            <span>
              Showing <strong>{filteredTours.length}</strong> of <strong>{FEATURED_TOURS.length}</strong> Himachal tourist circuits
              {selectedPlace !== 'All Places' && <em> • Filtered by spot: <strong>{selectedPlace}</strong></em>}
              {activeCategory !== 'All' && <em> • Category: <strong>{activeCategory}</strong></em>}
              {searchTerm && <em> • Matching: "<strong>{searchTerm}</strong>"</em>}
            </span>
            {(activeCategory !== 'All' || selectedPlace !== 'All Places' || searchTerm) && (
              <button className="reset-filter-btn" onClick={handleResetFilters}>
                <i className="fa-solid fa-xmark"></i> Clear All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Tour Grid Layout */}
      <section className="destinations-grid-section">
        <div className="container">
          {filteredTours.length === 0 ? (
            <div className="no-tours-found">
              <i className="fa-solid fa-mountain-sun"></i>
              <h3>No Circuits Match Your Filter</h3>
              <p>We provide custom Force Tempo Traveller tours to every part of Himachal Pradesh!</p>
              <div className="no-tours-actions">
                <button className="reset-filter-btn-lg" onClick={handleResetFilters}>
                  Show All 18 Himachal Circuits
                </button>
                <a 
                  href={`https://wa.me/918580462440?text=Hello%20Mahajanrides!%20I%20want%20to%20plan%20a%20custom%20tour%20to%20${searchTerm || selectedPlace}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="wa-custom-btn"
                >
                  <i className="fa-brands fa-whatsapp"></i> Inquire Custom Route on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="destinations-cards-grid">
              {filteredTours.map((tour) => (
                <motion.div 
                  key={tour.id}
                  className="destination-card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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

                    {/* Tourist Places Covered Pills */}
                    {tour.placesCovered && (
                      <div className="dest-places-row">
                        <span className="places-title">
                          <i className="fa-solid fa-map-pin"></i> Key Places:
                        </span>
                        <div className="places-pills-list">
                          {tour.placesCovered.map((place, pIdx) => (
                            <span 
                              key={pIdx} 
                              className="place-mini-pill"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlaceClick(place);
                              }}
                              title={`Filter tours with ${place}`}
                            >
                              {place}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

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
                          Itinerary
                        </button>
                        <button 
                          type="button" 
                          className="dest-whatsapp-btn"
                          onClick={() => {
                            if (onNavigateBooking) {
                              onNavigateBooking(tour.title);
                            } else {
                              setSelectedTourForQuote(tour.title);
                              const el = document.getElementById('instantQuoteSection');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          title="Instant quotation for this tour"
                        >
                          <i className="fa-solid fa-calendar-check"></i> Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* 4. Fleet & Vehicle Feature Highlight Banner */}
          <div className="destinations-fleet-strip">
            <div className="fleet-strip-content">
              <div className="fleet-strip-badge">
                <i className="fa-solid fa-shield-heart"></i>
                <span>Exclusive Mountain Fleet</span>
              </div>
              <h2>Travel Together In A Luxury 17-Seater Force Tempo Traveller</h2>
              <p>
                All tours across Himachal Pradesh are operated in commercially registered Force Tempo Travellers featuring luxury pushback seats, dual AC, panoramic view windows, heavy luggage carriers, and verified Himachal commercial green permits.
              </p>
              <div className="fleet-features-row">
                <div className="fleet-item">
                  <i className="fa-solid fa-couch"></i> Pushback Seats
                </div>
                <div className="fleet-item">
                  <i className="fa-solid fa-snowflake"></i> Dual Powerful AC
                </div>
                <div className="fleet-item">
                  <i className="fa-solid fa-suitcase-rolling"></i> Large Luggage Boot
                </div>
                <div className="fleet-item">
                  <i className="fa-solid fa-user-shield"></i> Local Mountain Chauffeur
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Booking Search Bar */}
      <section className="destinations-booking-wrap" id="instantQuoteSection">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-subtitle">Instant Quotation</span>
            <h2 className="section-title">Ready to Plan Your <i>Himachal Vacation?</i></h2>
            <p>Select your dates and group size below to generate an immediate WhatsApp quote:</p>
          </div>
          <BookingBar initialDestination={selectedTourForQuote} />
        </div>
      </section>

      {/* 6. Comprehensive Itinerary Modal */}
      <AnimatePresence>
        {selectedTour && (
          <div className="tour-modal-backdrop" onClick={() => setSelectedTour(null)}>
            <motion.div 
              className="tour-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
                
                {/* Places Covered List in Modal */}
                {selectedTour.placesCovered && (
                  <div className="modal-places-covered">
                    <h4><i className="fa-solid fa-map-location-dot"></i> Tourist Places Visited:</h4>
                    <div className="modal-places-tags">
                      {selectedTour.placesCovered.map((place, idx) => (
                        <span key={idx} className="modal-place-badge">
                          <i className="fa-solid fa-check"></i> {place}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Day-by-Day Itinerary Breakdown */}
                {selectedTour.itinerary && selectedTour.itinerary.length > 0 && (
                  <div className="modal-itinerary-timeline">
                    <h4><i className="fa-solid fa-route"></i> Day-by-Day Tour Plan:</h4>
                    <div className="timeline-items">
                      {selectedTour.itinerary.map((dayItem) => (
                        <div key={dayItem.day} className="timeline-item">
                          <div className="timeline-day-badge">Day {dayItem.day}</div>
                          <div className="timeline-content">
                            <h5>{dayItem.title}</h5>
                            <p>{dayItem.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="tour-itinerary-box">
                  <h4><i className="fa-solid fa-star"></i> Key Tour Highlights:</h4>
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
                    <span>Direct quote and timing customized on WhatsApp based on your arrival point (Chandigarh, Delhi, Kalka, Manali).</span>
                  </div>
                  <div className="tour-modal-actions-row">
                    <button 
                      className="butn-book-modal"
                      onClick={() => {
                        const title = selectedTour.title;
                        setSelectedTour(null);
                        if (onNavigateBooking) {
                          onNavigateBooking(title);
                        } else {
                          setSelectedTourForQuote(title);
                          const el = document.getElementById('instantQuoteSection');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      type="button"
                    >
                      <i className="fa-solid fa-calendar-check"></i> Book Now (Get Quote)
                    </button>
                    <button 
                      className="butn-whatsapp-modal"
                      onClick={() => {
                        handleInquire(selectedTour);
                        setSelectedTour(null);
                      }}
                      type="button"
                    >
                      <i className="fa-brands fa-whatsapp"></i> Inquire on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
