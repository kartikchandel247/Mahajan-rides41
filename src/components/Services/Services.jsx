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
      icon: "fa-solid fa-car-side",
      title: "Cab & Fleet Rentals",
      desc: "Sanitized, GPS-tracked Sedans, luxury Innova Crystas, and Tempo Travellers with mountain-trained drivers."
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
              Get ready to explore and discover <i>your world</i>
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
                      Cultural Paths • Nature Escape • Mahajanrides •
                    </textPath>
                  </text>
                </svg>
              </div>
              <div className="in-circle"><i className="fa-solid fa-arrow-down"></i></div>
            </div>
          </a>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="services-grid">
          {servicesList.map((service, idx) => (
            <motion.div 
              key={idx}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleInquireService(service.title)}
            >
              <i className="fa-solid fa-arrow-up-right-from-square service-card-arrow"></i>
              <div className="service-card-icon">
                <i className={service.icon}></i>
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
