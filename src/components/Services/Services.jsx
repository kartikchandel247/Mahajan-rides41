import { motion } from 'framer-motion';
import { openWhatsAppInquiry } from '../../utils/whatsapp';
import './Services.scss';

export default function Services() {
  const servicesList = [
    {
      icon: "fa-solid fa-route",
      title: "Custom Tour Packages",
      desc: "Personalized itineraries created around your family's schedule, preferred travel pace, and budget."
    },
    {
      icon: "fa-solid fa-van-shuttle",
      title: "17-Seater Force Tempo Traveller",
      desc: "Sanitized, luxury 17-seater Force Tempo Traveller with pushback seats, dual AC, music system, and mountain-trained chauffeurs."
    },
    {
      icon: "fa-solid fa-hotel",
      title: "Resorts & Hotels",
      desc: "Handpicked valley-view luxury resorts, authentic wooden cottages, and boutique hotel partnerships."
    },
    {
      icon: "fa-solid fa-plane-departure",
      title: "Airport & Station Transfers",
      desc: "Punctual, guaranteed pickups and drop-offs from Delhi, Chandigarh, Kalka, and Amritsar terminals."
    }
  ];

  const handleInquireService = (title) => {
    openWhatsAppInquiry({
      tourName: `Service Inquiry: ${title}`,
      destination: "Tour / Fleet Transfer Service",
      days: 5
    });
  };

  return (
    <section className="services-section section-padding" id="services">
      <div className="container">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-white">
              Get ready to explore and discover <i>Himachal Pradesh</i>
            </h2>
          </motion.div>
        </div>

        {/* Rotating Circular SVG Badge Overlay */}
        <div className="rotating-circle-wrapper">
          <a 
            href="#bookingBar" 
            className="circle-button-overlay"
            aria-label="Scroll to tour booking form"
          >
            <div className="circle-button">
              <div className="rotate-circle">
                <svg viewBox="0 0 500 500">
                  <defs>
                    <path id="textcircle" d="M250,400 a150,150 0 0,1 0,-300a150,150 0 0,1 0,300Z"></path>
                  </defs>
                  <text>
                    <textPath href="#textcircle" startOffset="0">
                      Himachal Roads • Mountain Escapes • Mahajanrides •
                    </textPath>
                  </text>
                </svg>
              </div>
              <div className="in-circle"><i className="fa-solid fa-arrow-down"></i></div>
            </div>
          </a>
        </div>

        {/* 4 Service Cards Grid: Left two cards slide from left, Right two cards slide from right */}
        <div className="services-grid">
          {servicesList.map((service, idx) => {
            // Left two cards (indices 0 & 1) slide in from left to right (negative x)
            // Right two cards (indices 2 & 3) slide in from right to left (positive x)
            const isLeft = idx < 2;
            const startX = isLeft ? (idx === 0 ? -120 : -70) : (idx === 3 ? 120 : 70);
            const delay = idx === 0 || idx === 3 ? 0.05 : 0.18;

            return (
              <motion.div 
                key={idx}
                className="service-card"
                initial={{ opacity: 0, x: startX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ 
                  duration: 0.85, 
                  delay: delay, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                onClick={() => handleInquireService(service.title)}
              >
                <i className="fa-solid fa-arrow-up-right-from-square service-card-arrow"></i>
                <div className="service-card-icon">
                  <i className={service.icon}></i>
                </div>
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-desc">{service.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Panoramic Scenic Radius Mask Banner */}
        <div className="services-panoramic-banner">
          <div className="banner-radius-mask">
            <img 
              src="/places/himachal_sangla_scenery.jpg" 
              alt="Majestic Mountain Scenery in Himachal Pradesh Himalayas" 
              loading="lazy" 
            />
            <div className="banner-overlay-text">
              <span>Explore The Roads Less Travelled</span>
              <h3>Luxury Force Tempo Traveller &amp; Mountain Holidays</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
