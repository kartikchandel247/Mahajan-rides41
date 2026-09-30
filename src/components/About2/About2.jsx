import { motion } from 'framer-motion';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import './About2.scss';

export default function About2({ onNavigateAbout }) {
  const highlights = [
    { icon: 'fa-solid fa-map-location-dot', text: '18 Himachal Tour Circuits' },
    { icon: 'fa-solid fa-user-shield', text: 'Local Mountain Chauffeurs' },
    { icon: 'fa-solid fa-couch', text: '17-Seater Luxury AC Pushback' },
    { icon: 'fa-solid fa-route', text: 'Doorstep Pickup (Delhi / Chd)' },
  ];

  return (
    <div className="about2 section-padding bg-white" id="about">
      <div className="container">
        <div className="about2-grid">
          {/* Left: Staggered Double Image Showcase with motion from left to right */}
          <motion.div 
            className="about2-img-col"
            initial={{ opacity: 0, x: -75 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="about2-img">
              {/* Image 1: Force Tempo Exterior */}
              <div className="main-img img-cover duru-slide-down">
                <img 
                  src="/vehicle/tempo_traveller_exterior.png" 
                  alt="Mahajanrides 17 Seater Force Tempo Traveller Exterior" 
                  loading="lazy" 
                />
                <div className="img-floating-badge">
                  <i className="fa-solid fa-van-shuttle"></i>
                  <span>Force Tempo 17-Seater</span>
                </div>
              </div>

              {/* Image 2: Force Tempo Interior */}
              <div className="main-img img-cover duru-slide-up">
                <img 
                  src="/vehicle/tempo_traveller_interior.png" 
                  alt="Mahajanrides Luxury Recliner Pushback Seats" 
                  loading="lazy" 
                />
                <div className="img-floating-badge">
                  <i className="fa-solid fa-couch"></i>
                  <span>Luxury AC Pushback</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content Column with motion from right to left */}
          <motion.div 
            className="about2-content-col"
            initial={{ opacity: 0, x: 75 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-subtitle">Himachal Fleet Specialists</div>
            <h2 className="section-title">
              Discover Himachal <i>with our mountain chauffeurs</i>
            </h2>
            <p className="about2-desc">
              Rooted in the Himalayas, <strong>{AGENCY_CONFIG.name}</strong> delivers safe, punctual, and luxury 17-Seater Force Tempo Traveller travel across Devbhoomi. From the snow-capped heights of Rohtang Pass, Atal Tunnel, and Spiti Valley to the lush orchards of Kasol, Manali, and Dharamshala — we handle road permits, high-altitude driving, and luggage comfort with seasoned local drivers.
            </p>

            {/* Benefit Highlights List */}
            <ul className="listo">
              {highlights.map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.15 + idx * 0.08 }}
                >
                  <i className={item.icon}></i>
                  <span>{item.text}</span>
                </motion.li>
              ))}
            </ul>

            {/* Customers Proof Bar & Action Button */}
            <div className="customers">
              <div className="c-img">
                <ul>
                  <li><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Customer 1" /></li>
                  <li><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Customer 2" /></li>
                  <li><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Customer 3" /></li>
                </ul>
                <div className="c-text">
                  <h3><b>500+</b></h3>
                  <span>Happy Mountain Tours</span>
                </div>
              </div>

              <button 
                type="button" 
                className="butn-arrow" 
                onClick={onNavigateAbout}
              >
                <span className="btn-text">About Our Fleet</span>
                <span className="arrow-wrap">
                  <span className="arrow-inner">
                    <i className="fa-solid fa-arrow-right"></i>
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tourvex Background Subtle Watermark */}
      <div className="bg-text-style">MAHAJAN</div>
    </div>
  );
}
