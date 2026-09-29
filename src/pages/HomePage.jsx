import Hero from '../components/Hero/Hero';
import BookingBar from '../components/BookingBar/BookingBar';
import { FEATURED_TOURS } from '../data/toursData';
import { AGENCY_CONFIG } from '../config/agencyConfig';
import { openWhatsAppInquiry } from '../utils/whatsapp';
import './HomePage.scss';

export default function HomePage({ onNavigateDestinations, onNavigateAbout, onNavigateBlog, onNavigateContact }) {
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
      badge: '6 Packages',
      icon: 'fa-solid fa-mountain',
      desc: 'Manali, Rohtang, Kasol & Spiti packages.',
      actionText: 'View Tours',
      onClick: onNavigateDestinations
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
    },
    {
      id: 'contact',
      title: 'Direct Contact',
      badge: '24/7 Support',
      icon: 'fa-solid fa-phone-volume',
      desc: 'Instant WhatsApp & custom quotes.',
      actionText: 'Get Quote',
      onClick: onNavigateContact
    }
  ];

  return (
    <div className="home-page-minimal">
      {/* 1. Hero Section */}
      <Hero onExploreTours={onNavigateDestinations} />

      {/* 2. Fast WhatsApp Tour Booking Bar */}
      <div id="bookingBar" className="home-booking-strip">
        <div className="container">
          <BookingBar />
        </div>
      </div>

      {/* 3. Sleek Subpage Hub (4 Interactive Quick Cards) */}
      <section className="home-subpages-hub">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-subtitle">Quick Navigation Hub</span>
            <h2 className="section-title">Explore <i>Mahajanrides</i></h2>
            <p className="hub-intro">Choose an area to explore full itineraries, fleet specs, route guides, or contact options:</p>
          </div>

          <div className="hub-cards-grid">
            {subpageHub.map((item) => (
              <div
                key={item.id}
                className="hub-card"
                onClick={item.onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && item.onClick()}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top 3 Featured Circuits (Clean & Compact) */}
      <section className="home-destinations-preview">
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
              <span>View All 6 Packages</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div className="preview-cards-grid">
            {topDestinations.map((tour) => (
              <div 
                key={tour.id}
                className="preview-tour-card"
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
                      onClick={() => handleInquire(tour)}
                      title="Quick WhatsApp quote"
                    >
                      <i className="fa-brands fa-whatsapp"></i> Inquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Tours Button */}
          <div className="preview-view-all-wrap">
            <button 
              type="button" 
              className="butn-arrow"
              onClick={onNavigateDestinations}
            >
              <span className="btn-text">Explore All 6 Himachal Packages</span>
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

      {/* 5. Minimalist WhatsApp Direct Strip */}
      <section className="home-quick-cta">
        <div className="container">
          <div className="quick-cta-box">
            <div className="cta-left">
              <h3>Custom Mountain Trip Planning</h3>
              <p>Speak directly with {AGENCY_CONFIG.ownerName} for customized dates, doorstep pickup, and instant quotes.</p>
            </div>
            <div className="cta-right">
              <a 
                href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=Hello%20${AGENCY_CONFIG.name}!%20I%20want%20to%20plan%20a%20custom%20tour.`} 
                target="_blank" 
                rel="noreferrer" 
                className="butn-whatsapp"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>Chat on WhatsApp</span>
              </a>
              <a 
                href={`tel:${AGENCY_CONFIG.ownerPhone}`} 
                className="butn-contact-subpage"
              >
                <i className="fa-solid fa-phone"></i>
                <span>Call {AGENCY_CONFIG.displayPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
