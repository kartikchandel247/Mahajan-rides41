import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero/Hero';
import BookingBar from '../components/BookingBar/BookingBar';
import About2 from '../components/About2/About2';
import Services from '../components/Services/Services';
import ExploreBanner from '../components/ExploreBanner/ExploreBanner';
import { FEATURED_TOURS } from '../data/toursData';
import { AGENCY_CONFIG } from '../config/agencyConfig';
import { openWhatsAppInquiry } from '../utils/whatsapp';
import './HomePage.scss';

export default function HomePage({ 
  onNavigateDestinations, 
  onNavigateAbout, 
  onNavigateBlog, 
  onNavigateContact,
  onNavigateBooking 
}) {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 992 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobileOrTablet(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Top 3 handpicked tours for the compact preview
  const topDestinations = FEATURED_TOURS.slice(0, 3);

  const handleInquire = (tour) => {
    openWhatsAppInquiry({
      tourName: tour.title,
      destination: tour.location,
      days: tour.daysCount,
      vehicle: tour.vehicle
    });
  };

  const subpageHub = [
    {
      id: 'destinations',
      title: 'Tour Circuits',
      badge: '18 Circuits',
      icon: 'fa-solid fa-mountain',
      desc: 'Manali, Rohtang, Spiti, Kinnaur & Kangra packages.',
      actionText: 'View Tours',
      onClick: onNavigateDestinations
    },
    {
      id: 'booking',
      title: 'Book Now',
      badge: 'Instant Quote',
      icon: 'fa-solid fa-calendar-check',
      desc: 'Select dates & group for direct WhatsApp quote.',
      actionText: 'Book Now',
      onClick: () => (onNavigateBooking ? onNavigateBooking() : onNavigateContact())
    },
    {
      id: 'about',
      title: 'Tempo Fleet',
      badge: '17-Seater',
      icon: 'fa-solid fa-van-shuttle',
      desc: 'Luxury pushback AC & local drivers.',
      actionText: 'Fleet Details',
      onClick: onNavigateAbout
    },
    {
      id: 'blog',
      title: 'Travel Guides',
      badge: 'Route Advice',
      icon: 'fa-solid fa-book-open',
      desc: 'Permits, weather windows & tips.',
      actionText: 'Read Guides',
      onClick: onNavigateBlog
    }
  ];

  return (
    <div className="home-page-minimal">
      {/* 1. Hero Section */}
      <Hero onExploreTours={onNavigateDestinations} />

      {/* 2. Fast WhatsApp Tour Booking Bar */}
      <div className="home-booking-strip">
        <div className="container">
          <div className="section-head text-center" style={{ marginBottom: '22px' }}>
            <span className="section-subtitle">Instant Quotation</span>
            <h2 className="section-title">Ready to Plan Your <i>Himachal Vacation?</i></h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Select your dates and group size below to generate an immediate WhatsApp quote:</p>
          </div>
          <BookingBar />
        </div>
      </div>

      {/* 3. Sleek Subpage Hub (4 Interactive Quick Cards) */}
      <section className="home-subpages-hub">
        <div className="container">
          <motion.div 
            className="section-head text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-subtitle">Quick Navigation Hub</span>
            <h2 className="section-title">Explore <i>Mahajanrides</i></h2>
            <p className="hub-intro">Choose an area to explore full itineraries, fleet specs, route guides, or contact options:</p>
          </motion.div>

          <div className="hub-cards-grid">
            {subpageHub.map((item, idx) => {
              // In 2x2 mobile/tablet grid:
              // Row 1: idx 0 (left col) from left, idx 1 (right col) from right
              // Row 2: idx 2 (left col) from left, idx 3 (right col) from right
              // On desktop (4 across):
              // idx 0, 1 from left, idx 2, 3 from right
              const isFromLeft = isMobileOrTablet ? (idx % 2 === 0) : (idx < 2);
              const initialX = isFromLeft ? -55 : 55;
              const delay = isMobileOrTablet 
                ? (Math.floor(idx / 2) * 0.12 + (idx % 2) * 0.08) 
                : (idx * 0.09 + 0.05);

              return (
                <motion.div
                  key={item.id}
                  className="hub-card"
                  onClick={item.onClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && item.onClick()}
                  initial={{ opacity: 0, x: initialX }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15, margin: "0px 0px -25px 0px" }}
                  transition={{ 
                    duration: 0.65, 
                    delay: delay, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className="hub-card-top">
                    <div className="hub-icon">
                      <i className={item.icon}></i>
                    </div>
                    <span className="hub-badge">{item.badge}</span>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>

                  <div className="hub-card-action">
                    <span>{item.actionText}</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Tourvex About 2 Section (Staggered Dual Image Showcase & Brand Story) */}
      <About2 onNavigateAbout={onNavigateAbout} />

      {/* 5. Tourvex Services pt-120 Section (4 Specialized Mountain Services with Motion) */}
      <Services 
        onNavigateDestinations={onNavigateDestinations}
        onNavigateAbout={onNavigateAbout}
        onNavigateBooking={onNavigateBooking}
      />

      {/* 6. Scenic Himachal Mountain Explore Panoramic Banner */}
      <ExploreBanner 
        onExploreTours={onNavigateDestinations}
        onBookClick={onNavigateBooking}
        onNavigateAbout={onNavigateAbout}
      />

      {/* 7. Top 3 Featured Circuits (Clean & Compact) */}
      <section className="home-destinations-preview" id="popular-tours">
        <div className="container">
          <div className="section-header-compact">
            <div>
              <span className="section-subtitle">Handpicked Circuits</span>
              <h2 className="section-title">Popular <i>Tours</i></h2>
            </div>
            
            <button 
              type="button" 
              className="view-all-subpage-btn"
              onClick={onNavigateDestinations}
            >
              <span>View All 18 Tour Circuits</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div className="preview-cards-grid">
            {topDestinations.map((tour, idx) => {
              // Directional entrance for popular tour cards
              const isLeft = idx % 2 === 0;
              const tourX = isMobileOrTablet ? (isLeft ? -50 : 50) : (idx === 0 ? -60 : (idx === 2 ? 60 : 0));
              const tourY = (!isMobileOrTablet && idx === 1) ? 35 : 0;

              return (
                <motion.div 
                  key={tour.id}
                  className="preview-tour-card"
                  initial={{ opacity: 0, x: tourX, y: tourY }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: false, amount: 0.15, margin: "0px 0px -25px 0px" }}
                  transition={{ 
                    duration: 0.65, 
                    delay: idx * 0.12 + 0.05, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <div className="card-image-box" onClick={onNavigateDestinations}>
                    <img src={tour.image} alt={tour.title} loading="lazy" />
                    <span className="preview-badge">{tour.tag}</span>
                    <div className="preview-duration">
                      <i className="fa-solid fa-clock"></i> {tour.duration}
                    </div>
                  </div>

                  <div className="card-info-box">
                    <span className="location-pin">
                      <i className="fa-solid fa-location-dot"></i> {tour.location}
                    </span>
                    <h3 onClick={onNavigateDestinations}>{tour.title}</h3>
                    <p>{tour.description}</p>
                    
                    <div className="card-actions-row">
                      <button 
                        type="button" 
                        className="explore-route-btn"
                        onClick={onNavigateDestinations}
                      >
                        Itinerary <i className="fa-solid fa-chevron-right"></i>
                      </button>
                      <button 
                        type="button" 
                        className="inquire-wa-btn"
                        onClick={() => onNavigateBooking ? onNavigateBooking(tour.title) : handleInquire(tour)}
                        title="Quick WhatsApp quote"
                      >
                        <i className="fa-solid fa-calendar-check"></i> Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* View All Tours Button */}
          <div className="preview-view-all-wrap">
            <button 
              type="button" 
              className="butn-arrow"
              onClick={onNavigateDestinations}
            >
              <span className="btn-text">Explore All 18 Himachal Circuits</span>
              <span className="arrow-wrap">
                <span className="arrow-inner">
                  <i className="fa-solid fa-arrow-right"></i>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
