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
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-badge">
            <i className="fa-solid fa-van-shuttle"></i> Exclusive 17-Seater Force Tempo Traveller Services
          </div>

          <h1 className="hero-title">
            <span>Discover Himachal</span>
            <span><i>with our local guide.</i></span>
          </h1>

          <p className="hero-desc">
            Specializing exclusively in Himachal Pradesh, we provide premier tour services in our luxury 17-seater Force Tempo Traveller across Devbhoomi. From Kullu, Manali, Rohtang Pass, and Atal Tunnel to Kasol, Manikaran, Dharamshala, Bir Billing, and Spiti Valley — our mountain-trained local chauffeurs ensure your journey through the hills is safe, scenic, and unforgettable.
          </p>

          <div className="hero-cta-group">
            <button className="butn-arrow2" onClick={onExploreTours}>
              <span className="btn-text">View Tour Details</span>
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
