import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Services.scss';

export default function Services({ 
  onNavigateDestinations, 
  onNavigateAbout, 
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
  const servicesList = [
    {
      id: 'circuits',
      icon: 'fa-solid fa-map-location-dot',
      title: '18 Mountain Circuits',
      desc: 'Complete all-inclusive tour packages across Manali, Rohtang Pass, Spiti Valley, Kasol, and Dharamshala.',
      actionText: 'Explore Tours',
      onClick: onNavigateDestinations
    },
    {
      id: 'fleet',
      icon: 'fa-solid fa-van-shuttle',
      title: '17-Seater Force Luxury',
      desc: 'Dedicated high-roof Force Tempo Traveller with 2x1 pushback reclining seats, ambient cabin lights & dual AC.',
      actionText: 'Fleet Details',
      onClick: onNavigateAbout
    },
    {
      id: 'transfers',
      icon: 'fa-solid fa-plane-arrival',
      title: 'Doorstep Transfers',
      desc: 'Punctual pickup and drop from Delhi Airport, Chandigarh Airport/Station, and Kalka Railway Station.',
      actionText: 'Book Transfer',
      onClick: () => onNavigateBooking ? onNavigateBooking('Doorstep Pickup & Transfer') : null
    },
    {
      id: 'permits',
      icon: 'fa-solid fa-mountain-sun',
      title: 'Permits & Chauffeurs',
      desc: 'Local Himachali drivers with deep mountain terrain mastery, snow chain expertise, and pre-arranged Rohtang permits.',
      actionText: 'Inquire Now',
      onClick: () => onNavigateBooking ? onNavigateBooking('Custom Mountain Tour') : null
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
          viewport={{ once: true, amount: 0.25 }}
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

        {/* 4 Services Cards Grid with 2 from left and 2 from right motion */}
        <div className="services-cards-grid">
          {servicesList.map((service, idx) => {
            // In 2x2 tablet/mobile grid:
            // Row 1: idx 0 (left) from left, idx 1 (right) from right
            // Row 2: idx 2 (left) from left, idx 3 (right) from right
            // On desktop (4 across):
            // idx 0, 1 from left, idx 2, 3 from right
            const isFromLeft = isMobileOrTablet ? (idx % 2 === 0) : (idx < 2);
            const initialX = isFromLeft ? -55 : 55;
            const delay = isMobileOrTablet 
              ? (Math.floor(idx / 2) * 0.12 + (idx % 2) * 0.08) 
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
                viewport={{ once: true, amount: 0.15, margin: "0px 0px -30px 0px" }}
                transition={{ 
                  duration: 0.65, 
                  delay: delay, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                {/* Floating Corner Arrow */}
                <div className="arrow">
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </div>

                {/* Service Icon */}
                <div className="icon">
                  <i className={service.icon}></i>
                </div>

                {/* Content */}
                <h5>{service.title}</h5>
                <p>{service.desc}</p>

                {/* Action Link */}
                <div className="item-action">
                  <span>{service.actionText}</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
