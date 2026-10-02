import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Services.scss';

export default function Services({ 
  onNavigateDestinations, 
  onNavigateAbout, 
  onNavigateBooking,
  onNavigateSection 
}) {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 992 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobileOrTablet(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = (serviceId) => {
    switch (serviceId) {
      case 'circuits':
        if (onNavigateDestinations) {
          onNavigateDestinations();
        } else if (onNavigateSection) {
          onNavigateSection('destinations');
        } else if (typeof window !== 'undefined') {
          window.location.hash = '#/destinations';
        }
        break;

      case 'fleet':
        if (onNavigateSection) {
          onNavigateSection('about', 'fleetDetails');
        } else if (onNavigateAbout) {
          onNavigateAbout('fleetDetails');
        } else if (typeof window !== 'undefined') {
          window.location.hash = '#/about';
          setTimeout(() => {
            document.getElementById('fleetDetails')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
        break;

      case 'transfers':
        if (onNavigateBooking) {
          onNavigateBooking('Doorstep Pickup & Transfer (Delhi / Chandigarh / Kalka)', 'doorstepTransfers');
        } else if (onNavigateSection) {
          onNavigateSection('booking', 'doorstepTransfers', 'Doorstep Pickup & Transfer (Delhi / Chandigarh / Kalka)');
        } else if (typeof window !== 'undefined') {
          window.location.hash = '#/booking';
          setTimeout(() => {
            document.getElementById('doorstepTransfers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
        break;

      case 'permits':
        if (onNavigateSection) {
          onNavigateSection('about', 'permitsChauffeurs');
        } else if (onNavigateAbout) {
          onNavigateAbout('permitsChauffeurs');
        } else if (typeof window !== 'undefined') {
          window.location.hash = '#/about';
          setTimeout(() => {
            document.getElementById('permitsChauffeurs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
        break;

      default:
        break;
    }
  };

  const servicesList = [
    {
      id: 'circuits',
      icon: 'fa-solid fa-map-location-dot',
      title: '18 Mountain Circuits',
      desc: 'All-inclusive packages for Manali, Rohtang, Spiti, Kasol & Dharamshala.',
      actionText: 'Explore Tours',
      onClick: () => handleCardClick('circuits')
    },
    {
      id: 'fleet',
      icon: 'fa-solid fa-van-shuttle',
      title: '17-Seater Force Luxury',
      desc: 'Pushback 2x1 reclining seats, ambient cabin lights & dual high-power AC.',
      actionText: 'Fleet Details',
      onClick: () => handleCardClick('fleet')
    },
    {
      id: 'transfers',
      icon: 'fa-solid fa-plane-arrival',
      title: 'Doorstep Transfers',
      desc: 'Punctual pickup & drop from Delhi, Chandigarh Airport & Kalka Station.',
      actionText: 'Book Transfer',
      onClick: () => handleCardClick('transfers')
    },
    {
      id: 'permits',
      icon: 'fa-solid fa-mountain-sun',
      title: 'Permits & Chauffeurs',
      desc: 'Certified local drivers, snow chains & pre-arranged Rohtang green permits.',
      actionText: 'Inquire Now',
      onClick: () => handleCardClick('permits')
    }
  ];

  return (
    <section className="services pt-120" id="services">
      <div className="container">
        {/* Section Header */}
        <motion.div 
          className="services-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-subtitle">Our Specialized Services</span>
          <h2 className="section-title">
            Exclusive Mountain Travel <i>Crafted For Comfort</i>
          </h2>
          <p className="services-subtitle">
            Dedicated private travel solutions for families, corporate teams, and adventure groups exploring Himachal Pradesh.
          </p>
        </motion.div>

        {/* 4 Services Cards Grid with alternating left/right motion */}
        <div className="services-cards-grid">
          {servicesList.map((service, idx) => {
            // Directional entrance:
            // Mobile (1-col) & Tablet (2-col): alternating left (idx 0, 2) and right (idx 1, 3)
            // Desktop (4-col): idx 0, 1 from left, idx 2, 3 from right
            const isFromLeft = isMobileOrTablet ? (idx % 2 === 0) : (idx < 2);
            const initialX = isFromLeft ? -45 : 45;
            const delay = isMobileOrTablet 
              ? (idx * 0.08 + 0.04) 
              : (idx * 0.09 + 0.05);

            return (
              <motion.div
                key={service.id}
                className="item"
                onClick={service.onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && service.onClick()}
                initial={{ opacity: 0, x: initialX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15, margin: "0px 0px -25px 0px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: delay, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{ y: -8, scale: 1.035, transition: { duration: 0.25 } }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Floating Corner Arrow (Signature Tourvex on Desktop) */}
                <div className="arrow desktop-corner-arrow">
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </div>

                {/* Service Icon Badge */}
                <div className="icon">
                  <i className={service.icon}></i>
                </div>

                {/* Content Info */}
                <div className="item-content">
                  <h5>{service.title}</h5>
                  <p>{service.desc}</p>
                  
                  {/* Desktop Action Link */}
                  <div className="item-action desktop-action">
                    <span>{service.actionText}</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>

                {/* Mobile / Tablet Slim Action Pill & Arrow */}
                <div className="mobile-slim-action" aria-label={service.actionText}>
                  <span className="slim-action-label">{service.actionText}</span>
                  <div className="slim-action-arrow">
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
