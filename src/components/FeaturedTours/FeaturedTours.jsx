import { motion } from 'framer-motion';
import { FEATURED_TOURS } from '../../data/toursData';
import { openWhatsAppInquiry } from '../../utils/whatsapp';
import './FeaturedTours.scss';

export default function FeaturedTours() {
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
      <div className="container">
        <div className="tours-grid-layout">
          {/* Pinned Sticky Section Sidebar */}
          <motion.div 
            className="tours-sticky-sidebar"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-subtitle">Choose Your Place</div>
            <h2 className="section-title">Discover dream <i>destinations</i></h2>
            <p>
              Handpicked itineraries, verified mountain chauffeurs, transparent quotations, and 24/7 personal care.
            </p>

            <button 
              className="butn-arrow" 
              style={{ marginTop: '20px' }}
              onClick={() => handleInquire({ title: "Custom Tour Package", location: "Any Scenic Destination", daysCount: 5 })}
            >
              <span className="btn-text">Customize Tour</span>
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
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="tour-card-media">
                  <img src={tour.image} alt={tour.title} loading="lazy" />
                  <span className="tour-badge-top">{tour.tag}</span>
                  <button 
                    className="clicko" 
                    onClick={() => handleInquire(tour)} 
                    title="Inquire Price on WhatsApp"
                    aria-label={`Inquire about ${tour.title} on WhatsApp`}
                  >
                    <span className="icon-wrap">
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </span>
                  </button>
                </div>

                <div className="tour-card-content">
                  <div>
                    <div className="tour-location-pin">
                      <i className="fa-solid fa-location-dot"></i> {tour.location}
                    </div>
                    <h3 className="tour-title">{tour.title}</h3>
                    <p style={{ fontSize: '0.94rem', color: '#5e6282', marginBottom: '14px' }}>
                      {tour.description}
                    </p>
                    <div className="tour-meta-row">
                      <div className="tour-meta-item">
                        <i className="fa-solid fa-clock"></i> {tour.duration}
                      </div>
                      <div className="tour-meta-item">
                        <i className="fa-solid fa-car"></i> {tour.vehicle}
                      </div>
                    </div>
                  </div>

                  <div className="tour-footer-row">
                    <div className="tour-rating">
                      <i className="fa-solid fa-star"></i> {tour.rating} <span>({tour.reviewsCount}+ Reviews)</span>
                    </div>
                    <div className="tour-price-box">
                      {tour.price} <span>/ Traveler</span>
                    </div>
                    <button 
                      className="tour-whatsapp-action"
                      onClick={() => handleInquire(tour)}
                    >
                      <i className="fa-brands fa-whatsapp"></i> Inquire Price
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
