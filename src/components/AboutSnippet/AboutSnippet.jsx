import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import './AboutSnippet.scss';

export default function AboutSnippet({ onLearnMore }) {
  const containerRef = useRef(null);

  const [deviceType, setDeviceType] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth < 640) return 'mobile';
    if (window.innerWidth < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    mass: 0.2,
    restDelta: 0.001
  });

  const travelDistance = deviceType === 'mobile' ? 18 : (deviceType === 'tablet' ? 26 : 40);
  const yDown = useTransform(smoothProgress, [0, 1], [-travelDistance, travelDistance]);
  const yUp = useTransform(smoothProgress, [0, 1], [travelDistance, -travelDistance]);

  const pillars = [
    { icon: "fa-solid fa-earth-americas", title: "Scenic Destinations" },
    { icon: "fa-solid fa-route", title: "Expert Local Guides" },
    { icon: "fa-solid fa-shield-heart", title: "100% Safe Rides" },
    { icon: "fa-solid fa-hotel", title: "Handpicked Stays" },
  ];

  return (
    <section className="about-section section-padding" id="about" ref={containerRef}>
      <div className="container">
        <div className="about-grid">
          {/* Dual Offset Parallax Images */}
          <motion.div 
            className="about-images-wrap"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div className="about-img-box shift-down" style={{ y: yDown }}>
              <img 
                src="/vehicle/tempo_traveller_exterior.png" 
                alt="Force Tempo Traveller Exterior - Mahajan Rides"
                loading="lazy"
              />
              <div className="about-img-badge">
                <i className="fa-solid fa-van-shuttle"></i>
                <span>Force Tempo 17-Seater</span>
              </div>
            </motion.div>
            <motion.div className="about-img-box shift-up" style={{ y: yUp }}>
              <img 
                src="/vehicle/tempo_traveller_interior.png" 
                alt="Force Tempo Traveller Luxury Interior - Mahajan Rides" 
                loading="lazy" 
              />
              <div className="about-img-badge">
                <i className="fa-solid fa-couch"></i>
                <span>Luxury AC Interior</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-subtitle">Himachal Tour Specialists</div>
            <h2 className="section-title">Discover Himachal <i>with our local guide</i></h2>
            <p className="about-text">
              Born and rooted in Himachal Pradesh, {AGENCY_CONFIG.name} provides dedicated 17-seater Force Tempo Traveller tour services exclusively across Devbhoomi. From the snow-capped heights of Rohtang Pass, Atal Tunnel, and Sissu to the tranquil valleys of Kullu, Kasol, Manikaran, Dharamshala, and Spiti — our seasoned local Himachali chauffeurs and luxury 17-seater Force Tempo Traveller guarantee safe, punctual, and breathtaking road journeys.
            </p>

            <div className="about-features-list">
              {pillars.map((p, idx) => (
                <div key={idx} className="about-feature-item">
                  <div className="feature-icon-badge">
                    <i className={p.icon}></i>
                  </div>
                  <span>{p.title}</span>
                </div>
              ))}
            </div>

            <div className="reviews-counter-bar">
              <div className="avatar-stack">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Traveler 1" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Traveler 2" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Traveler 3" />
              </div>
              <div className="reviews-stat">
                <h4>9,500+</h4>
                <span>Happy Passenger Reviews</span>
              </div>
              <a href="#tours" className="butn-arrow" onClick={onLearnMore}>
                <span className="btn-text">View Tour Details</span>
                <span className="arrow-wrap">
                  <span className="arrow-inner">
                    <i className="fa-solid fa-arrow-right"></i>
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="bg-text-style">MAHAJAN</div>
    </section>
  );
}
