import { motion } from 'framer-motion';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import './Hero.scss';

export default function Hero({ onExploreTours }) {
  const col1Images = [
    { name: "Manali", state: "Himachal", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80" },
    { name: "Shimla", state: "Pine Hills", img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80" },
    { name: "Spiti Valley", state: "High Cold Desert", img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80" },
    { name: "Manali", state: "Himachal", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80" },
  ];

  const col2Images = [
    { name: "Kashmir", state: "Dal Lake", img: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=600&q=80" },
    { name: "Jaipur", state: "Pink City", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80" },
    { name: "Goa", state: "Tropical Coast", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80" },
    { name: "Kashmir", state: "Dal Lake", img: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=600&q=80" },
  ];

  const col3Images = [
    { name: "Maldives", state: "Island Escape", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
    { name: "Dubai", state: "Desert & Skyline", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80" },
    { name: "Ladakh", state: "Pangong Tso", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
    { name: "Maldives", state: "Island Escape", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
  ];

  return (
    <header className="hero-layout1" id="home">
      {/* Decorative Floating Elements */}
      <i className="fa-regular fa-compass hero-decor-compass"></i>
      <i className="fa-solid fa-plane-up hero-decor-plane"></i>

      <div className="container">
        {/* Left Editorial Content */}
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-badge">
            <i className="fa-solid fa-award"></i> {AGENCY_CONFIG.name} Travel Agency
          </div>

          <h1 className="hero-title">
            <span>Discover the world</span>
            <span><i>with our guide.</i></span>
          </h1>

          <p className="hero-desc">
            Turn your dream destinations into reality with our expert guidance, private verified chauffeurs, and customized itineraries. From Himalayan snowy heights to royal heritage fortresses, we craft every journey with care.
          </p>

          <div className="hero-cta-group">
            <button className="butn-arrow2" onClick={onExploreTours}>
              <span className="btn-text">View All Tours</span>
              <span className="arrow-wrap">
                <span className="arrow-inner">
                  <i className="fa-solid fa-arrow-right"></i>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </span>
            </button>

            <a 
              href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=Hello%20${AGENCY_CONFIG.name}!%20I%20want%20to%20inquire%20about%20a%20tour%20package.`}
              target="_blank" 
              rel="noreferrer"
              className="butn-whatsapp"
            >
              <i className="fa-brands fa-whatsapp"></i> Chat On WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Right Triple-Column Vertical Marquee Showcase */}
        <motion.div 
          className="hero-marquee-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Column 1 */}
          <div className="marquee-col st1">
            {col1Images.concat(col1Images).map((item, idx) => (
              <div key={`c1-${idx}`} className="marquee-card">
                <img src={item.img} alt={item.name} loading="lazy" />
                <div className="marquee-card-label">
                  <span>{item.name}</span>
                  <small>{item.state}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="marquee-col st2">
            {col2Images.concat(col2Images).map((item, idx) => (
              <div key={`c2-${idx}`} className="marquee-card">
                <img src={item.img} alt={item.name} loading="lazy" />
                <div className="marquee-card-label">
                  <span>{item.name}</span>
                  <small>{item.state}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="marquee-col st3">
            {col3Images.concat(col3Images).map((item, idx) => (
              <div key={`c3-${idx}`} className="marquee-card">
                <img src={item.img} alt={item.name} loading="lazy" />
                <div className="marquee-card-label">
                  <span>{item.name}</span>
                  <small>{item.state}</small>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
