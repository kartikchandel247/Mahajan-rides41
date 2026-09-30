import { motion } from 'framer-motion';
import PageBanner from '../components/PageBanner/PageBanner';
import Services from '../components/Services/Services';
import Testimonials from '../components/Testimonials/Testimonials';
import Faq from '../components/Faq/Faq';
import { AGENCY_CONFIG } from '../config/agencyConfig';
import './AboutPage.scss';

export default function AboutPage({ onNavigateHome, onNavigateDestinations, _onNavigateContact }) {
  const trustPillars = [
    {
      icon: "fa-solid fa-mountain",
      title: "Local Himachali Chauffeurs",
      desc: "Our drivers are born and raised in the mountains, skilled in handling steep hairpin bends, icy passes, and high-altitude weather windows across Rohtang, Atal Tunnel, and Spiti."
    },
    {
      icon: "fa-solid fa-shield-halved",
      title: "100% Authorized State Permits",
      desc: "All Mahajanrides commercial Force Tempo Travellers have legal Himachal Pradesh transport permits, green tax certifications, and verified access for Rohtang & Lahaul crossings."
    },
    {
      icon: "fa-solid fa-couch",
      title: "17-Seater Luxury Pushback Comfort",
      desc: "Travel together without dividing into smaller taxis. Enjoy dual air-conditioning, individual pushback bucket seats, panoramic mountain windows, and huge luggage space."
    },
    {
      icon: "fa-solid fa-headset",
      title: "Direct Owner Accountability",
      desc: "No middlemen or commissions. Speak directly with the fleet owner on WhatsApp or phone for transparent prices, customized itineraries, and round-the-clock road assistance."
    }
  ];

  return (
    <div className="about-page">
      {/* 1. Header Banner */}
      <PageBanner 
        title="About Mahajanrides"
        subtitle="Himachal Mountain Tour Specialists"
        breadcrumb="About Us & Fleet"
        bgImage="/places/himachal_sangla_scenery.jpg"
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Core Story & Heritage */}
      <section className="about-story-section section-padding">
        <div className="container">
          <div className="about-story-grid">
            <motion.div 
              className="about-story-media"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <div className="story-img-main">
                <img 
                  src="/vehicle/tempo_traveller_exterior.png" 
                  alt="Force Tempo Traveller Exterior - Mahajanrides" 
                />
                <div className="story-floating-badge">
                  <span className="number">10+</span>
                  <span className="label">Years of Mountain Road Mastery</span>
                </div>
              </div>

              <div className="story-img-subgrid">
                <div className="story-img-secondary">
                  <img 
                    src="/vehicle/tempo_traveller_seats.png" 
                    alt="Force Tempo Traveller Luxury 17-Seater Pushback Seats" 
                  />
                  <span className="interior-badge">
                    <i className="fa-solid fa-couch"></i> 17-Seater Pushback Seats
                  </span>
                </div>

                <div className="story-img-secondary">
                  <img 
                    src="/vehicle/tempo_traveller_cockpit.png" 
                    alt="Force Tempo Traveller Luxury Cockpit" 
                  />
                  <span className="interior-badge badge-cockpit">
                    <i className="fa-solid fa-gauge-high"></i> Luxury Cockpit
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="about-story-content"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-subtitle">Born &amp; Rooted in Himachal</span>
              <h2 className="section-title">Your Trusted Local Partner For <i>Unforgettable Mountain Trips</i></h2>
              
              <p className="lead-text">
                Founded with a deep love for Himachal Pradesh, <strong>{AGENCY_CONFIG.name}</strong> was created to eliminate the stress of crowded public transport and disjointed multi-car journeys.
              </p>

              <p className="body-text">
                Whether you are planning a family holiday to Manali, Sissu, and Solang, a spiritual pilgrimage to Manikaran Sahib, or an epic adventure across the high passes of Spiti Valley, we provide dedicated, commercially licensed 17-seater Force Tempo Travellers driven exclusively by local mountain veterans.
              </p>

              <div className="founder-quote-box">
                <i className="fa-solid fa-quote-left quote-icon"></i>
                <p>
                  "In the mountains, safety and local knowledge matter more than anything else. When you travel with Mahajanrides, you are treated like family."
                </p>
                <div className="quote-author">
                  <strong>— {AGENCY_CONFIG.ownerName}</strong>
                  <span>Founder &amp; Fleet Operations Lead</span>
                </div>
              </div>

              <div className="story-cta-row">
                <button 
                  type="button" 
                  className="butn-arrow"
                  onClick={onNavigateDestinations}
                >
                  <span className="btn-text">Explore All Tours</span>
                  <span className="arrow-wrap">
                    <span className="arrow-inner">
                      <i className="fa-solid fa-arrow-right"></i>
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </span>
                </button>

                <a 
                  href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="butn-whatsapp"
                >
                  <i className="fa-brands fa-whatsapp"></i> Chat With Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Trust Pillars */}
      <section className="about-pillars-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-subtitle">Why Choose Us</span>
            <h2 className="section-title">The Four Pillars Of <i>Our Promise</i></h2>
            <p>Every journey with Mahajanrides is built upon four uncompromised standards:</p>
          </div>

          <div className="pillars-grid">
            {trustPillars.map((p, idx) => (
              <motion.div 
                key={idx} 
                className="pillar-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="pillar-icon-box">
                  <i className={p.icon}></i>
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dedicated Services Component */}
      <Services />

      {/* 5. Customer Testimonials */}
      <Testimonials />

      {/* 6. Trip FAQs */}
      <Faq />
    </div>
  );
}
