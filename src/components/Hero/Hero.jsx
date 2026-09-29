import { motion } from 'framer-motion';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import './Hero.scss';

export default function Hero({ onExploreTours }) {
  // Column 1: Manali, Rohtang, Atal Tunnel, Sissu, Baralacha La
  const col1Images = [
    { name: "Manali", state: "Solang & Snow Valley", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80" },
    { name: "Rohtang Pass", state: "3,978m Snow Ridge", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
    { name: "Atal Tunnel", state: "Gateway to Lahaul", img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80" },
    { name: "Sissu", state: "Lahaul Valley Waterfall", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80" },
    { name: "Baralacha La", state: "High Mountain Pass", img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80" },
  ];

  // Column 2: Kullu, Kasol, Manikaran, Spiti Valley, Mandi
  const col2Images = [
    { name: "Kullu", state: "Valley of Gods", img: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&q=80" },
    { name: "Kasol", state: "Parvati Valley Pines", img: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80" },
    { name: "Manikaran", state: "Hot Springs & Temple", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80" },
    { name: "Spiti Valley", state: "Kaza & Key Monastery", img: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=600&q=80" },
    { name: "Mandi", state: "Historic Beas Ghats", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" },
  ];

  // Column 3: Dharamshala, Bir Billing, Palampur, Kangra, Chamba
  const col3Images = [
    { name: "Dharamshala", state: "McLeod Ganj & Dhauladhar", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80" },
    { name: "Bir Billing", state: "World Paragliding Hub", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80" },
    { name: "Palampur", state: "Tea Gardens & Pines", img: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=600&q=80" },
    { name: "Kangra", state: "Ancient Kangra Fort", img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80" },
    { name: "Chamba", state: "Khajjiar Meadows", img: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=600&q=80" },
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
