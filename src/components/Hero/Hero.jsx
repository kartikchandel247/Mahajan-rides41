import { motion } from 'framer-motion';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import './Hero.scss';

export default function Hero({ onExploreTours }) {
  // Column 1: Manali, Rohtang, Atal Tunnel, Sissu, Baralacha La
  const col1Images = [
    { name: "Manali", state: "Hadimba Temple & Solang", img: "/places/manali.jpg" },
    { name: "Rohtang Pass", state: "3,978m Snow Ridge", img: "/places/rohtang_pass.jpg" },
    { name: "Atal Tunnel", state: "Gateway to Lahaul", img: "/places/atal_tunnel.jpg" },
    { name: "Sissu", state: "Lahaul Valley Waterfall", img: "/places/sissu.jpg" },
    { name: "Baralacha La", state: "High Mountain Pass", img: "/places/baralacha_la.jpg" },
  ];

  // Column 2: Kullu, Kasol, Manikaran, Spiti Valley, Mandi
  const col2Images = [
    { name: "Kullu", state: "Valley of Gods", img: "/places/kullu.jpg" },
    { name: "Kasol", state: "Parvati River Pines", img: "/places/kasol.jpg" },
    { name: "Manikaran", state: "Sahib Gurudwara & Springs", img: "/places/manikaran.jpg" },
    { name: "Spiti Valley", state: "Key Monastery & Kaza", img: "/places/spiti_valley.jpg" },
    { name: "Mandi", state: "Panchvaktra Temple Ghats", img: "/places/mandi.jpg" },
  ];

  // Column 3: Dharamshala, Bir Billing, Palampur, Kangra, Chamba
  const col3Images = [
    { name: "Dharamshala", state: "HPCA & Dhauladhar", img: "/places/dharamshala.jpg" },
    { name: "Bir Billing", state: "World Paragliding Hub", img: "/places/bir_billing.jpg" },
    { name: "Palampur", state: "Kangra Tea Gardens", img: "/places/palampur.jpg" },
    { name: "Kangra", state: "Historic Kangra Fort", img: "/places/kangra.jpg" },
    { name: "Chamba", state: "Khajjiar Mini Switzerland", img: "/places/chamba.jpg" },
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-eyebrow">
            <i className="fa-solid fa-compass"></i>
            <span>MAHAJANRIDE HIMACHAL</span>
          </div>

          <h1 className="hero-title">
            <span>DISCOVER THE</span>
            <span>HIMACHAL <i>with our guide.</i></span>
          </h1>

          <p className="hero-desc">
            Private customized tours across Manali, Rohtang Pass, Kasol, Atal Tunnel, Dharamshala &amp; Spiti Valley with trusted local mountain chauffeurs.
          </p>

          {/* Quick Highlight Badges */}
          <div className="hero-highlights">
            <div className="highlight-item">
              <i className="fa-solid fa-couch"></i>
              <span>Pushback AC Seats</span>
            </div>
            <div className="highlight-item">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Himachal Permit</span>
            </div>
            <div className="highlight-item">
              <i className="fa-solid fa-user-check"></i>
              <span>Local Driver</span>
            </div>
          </div>

          <div className="hero-cta-group">
            <button className="butn-arrow2" onClick={onExploreTours} id="hero-explore-btn">
              <span className="btn-text">Explore 6 Tours</span>
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
              id="hero-whatsapp-btn"
            >
              <i className="fa-brands fa-whatsapp"></i>
              <span>WhatsApp Booking</span>
            </a>
          </div>
        </motion.div>

        {/* Right Triple-Column Vertical Marquee Showcase */}
        <motion.div 
          className="hero-marquee-wrapper"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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
