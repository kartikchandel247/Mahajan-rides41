import { motion } from 'framer-motion';
import Hero from '../components/Hero/Hero';
import BookingBar from '../components/BookingBar/BookingBar';
import Ticker from '../components/Ticker/Ticker';
import { FEATURED_TOURS, BLOG_PREVIEW_DATA } from '../data/toursData';
import { AGENCY_CONFIG } from '../config/agencyConfig';
import { openWhatsAppInquiry } from '../utils/whatsapp';
import './HomePage.scss';

export default function HomePage({ onNavigateDestinations, onNavigateAbout, onNavigateBlog, onNavigateContact }) {
  // Take top 3 destinations for the clean, minimalist preview
  const topDestinations = FEATURED_TOURS.slice(0, 3);
  // Take top 2 blogs for the clean preview
  const topArticles = BLOG_PREVIEW_DATA.slice(0, 2);

  const handleInquire = (tour) => {
    openWhatsAppInquiry({
      tourName: tour.title,
      destination: tour.location,
      days: tour.daysCount,
      vehicle: tour.vehicle
    });
  };

  return (
    <div className="home-page-minimal">
      {/* 1. Hero Section */}
      <Hero onExploreTours={onNavigateDestinations} />

      {/* 2. Quick Tour Booking Bar */}
      <div id="bookingBar" className="home-booking-strip">
        <div className="container">
          <BookingBar />
        </div>
      </div>

      {/* 3. Minimalist Trust Strip (3 Key Quick Pillars) */}
      <section className="home-quick-pillars">
        <div className="container">
          <div className="pillars-row">
            <div className="quick-pillar-item">
              <div className="qp-icon">
                <i className="fa-solid fa-van-shuttle"></i>
              </div>
              <div className="qp-text">
                <h4>17-Seater Force Luxury</h4>
                <p>Pushback seats, dual AC &amp; panoramic views for group comfort.</p>
              </div>
            </div>

            <div className="quick-pillar-item">
              <div className="qp-icon">
                <i className="fa-solid fa-mountain"></i>
              </div>
              <div className="qp-text">
                <h4>Local Mountain Chauffeurs</h4>
                <p>Born and raised in Himachal, masters of Rohtang &amp; Spiti passes.</p>
              </div>
            </div>

            <div className="quick-pillar-item">
              <div className="qp-icon">
                <i className="fa-solid fa-shield-check"></i>
              </div>
              <div className="qp-text">
                <h4>100% Verified Permits</h4>
                <p>Legal state transport permit, green tax &amp; Atal Tunnel access.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Top Destinations Preview (Minimalist 3 Cards + View All Button) */}
      <section className="home-destinations-preview section-padding">
        <div className="container">
          <div className="section-header-compact">
            <div>
              <span className="section-subtitle">Top Himachal Circuits</span>
              <h2 className="section-title">Popular <i>Destinations</i></h2>
            </div>
            
            <button 
              type="button" 
              className="view-all-subpage-btn"
              onClick={onNavigateDestinations}
            >
              <span>View All Circuits</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div className="preview-cards-grid">
            {topDestinations.map((tour, idx) => (
              <motion.div 
                key={tour.id}
                className="preview-tour-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
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
                      View Itinerary <i className="fa-solid fa-chevron-right"></i>
                    </button>
                    <button 
                      type="button" 
                      className="inquire-wa-btn"
                      onClick={() => handleInquire(tour)}
                      title="Quick WhatsApp quote"
                    >
                      <i className="fa-brands fa-whatsapp"></i> Inquire
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile View All CTA */}
          <div className="mobile-view-all-wrap">
            <button 
              type="button" 
              className="butn-arrow full-width"
              onClick={onNavigateDestinations}
            >
              <span className="btn-text">Explore All Himachal Tours ({FEATURED_TOURS.length} Packages)</span>
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

      {/* 5. Minimalist About Snippet with Button */}
      <section className="home-about-teaser section-padding">
        <div className="container">
          <div className="about-teaser-card">
            <div className="teaser-media">
              <img 
                src="/vehicle/tempo_traveller_exterior.png" 
                alt="Mahajanrides Force Tempo Traveller" 
                loading="lazy" 
              />
              <div className="teaser-badge">
                <i className="fa-solid fa-star text-gold"></i>
                <span>4.9 / 5 Rating (9,500+ Passengers)</span>
              </div>
            </div>

            <div className="teaser-content">
              <span className="section-subtitle">About Mahajanrides</span>
              <h2 className="section-title">Rooted in Himachal, <i>Driven by Passion</i></h2>
              <p>
                We specialize exclusively in dedicated 17-seater Force Tempo Traveller mountain tours across Himachal Pradesh. From door-to-door pickups in Chandigarh and Delhi to crossing high Himalayan passes, our experienced local chauffeurs ensure your family travels safely and together.
              </p>

              <div className="teaser-highlights-mini">
                <div className="mini-item">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Doorstep Airport &amp; Station Pickups</span>
                </div>
                <div className="mini-item">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>No Middlemen — Direct Fleet Owner Rates</span>
                </div>
                <div className="mini-item">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Customized Family &amp; Group Itineraries</span>
                </div>
              </div>

              <div className="teaser-actions">
                <button 
                  type="button" 
                  className="butn-arrow"
                  onClick={onNavigateAbout}
                >
                  <span className="btn-text">Read Full Story &amp; Fleet Info</span>
                  <span className="arrow-wrap">
                    <span className="arrow-inner">
                      <i className="fa-solid fa-arrow-right"></i>
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Infinite Ticker */}
      <Ticker />

      {/* 7. Travel Guides & Passenger Reviews Teaser */}
      <section className="home-blog-teaser section-padding">
        <div className="container">
          <div className="section-header-compact">
            <div>
              <span className="section-subtitle">Travel Tips &amp; Stories</span>
              <h2 className="section-title">Himachal <i>Travel Insights</i></h2>
            </div>
            
            <button 
              type="button" 
              className="view-all-subpage-btn"
              onClick={onNavigateBlog}
            >
              <span>All Guides &amp; Reviews</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div className="blog-teaser-grid">
            {topArticles.map((article) => (
              <div key={article.id} className="blog-teaser-card" onClick={onNavigateBlog}>
                <div className="teaser-card-media">
                  <img src={article.image} alt={article.title} loading="lazy" />
                  <span className="cat-badge">{article.category}</span>
                </div>
                <div className="teaser-card-body">
                  <span className="date-tag"><i className="fa-regular fa-clock"></i> {article.date}</span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <span className="read-more-link">
                    Read Full Guide <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Quick Contact / WhatsApp CTA Strip */}
      <section className="home-quick-cta">
        <div className="container">
          <div className="quick-cta-box">
            <div className="cta-left">
              <h3>Planning A Custom Family Road Trip in Himachal?</h3>
              <p>Speak directly with {AGENCY_CONFIG.ownerName} for immediate rates, weather advice, and custom stops.</p>
            </div>
            <div className="cta-right">
              <a 
                href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}`} 
                target="_blank" 
                rel="noreferrer" 
                className="butn-whatsapp"
              >
                <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
              </a>
              <button 
                type="button" 
                className="butn-contact-subpage"
                onClick={onNavigateContact}
              >
                <i className="fa-solid fa-phone"></i> Contact Details
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
