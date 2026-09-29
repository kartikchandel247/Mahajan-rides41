import { useState } from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS_DATA } from '../../data/toursData';
import './Testimonials.scss';

export default function Testimonials() {
  const [activeId, setActiveId] = useState(TESTIMONIALS_DATA[0]?.id || 1);

  return (
    <section className="testimonials-section section-padding" id="testimonials">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '45px' }}>
          <div className="section-subtitle">Testimonials</div>
          <h2 className="section-title">Our happy <i>traveller stories</i></h2>
        </div>

        <div className="testimonials-expand-container">
          {TESTIMONIALS_DATA.map((t) => {
            const isActive = activeId === t.id;

            return (
              <div 
                key={t.id} 
                className={`testi-expand-item ${isActive ? 'active' : ''}`}
                onMouseEnter={() => setActiveId(t.id)}
                onClick={() => setActiveId(t.id)}
              >
                <div className="testi-img-wrap">
                  <img src={t.image} alt={t.tour} loading="lazy" />
                </div>

                <div className="testi-cont">
                  <div className="testi-cont-inner">
                    <span className="testi-tour-tag">Verified Trip</span>
                    <h3 className="testi-tour-name">{t.tour}</h3>
                    
                    <div className="testi-rating">
                      {[...Array(t.rating)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </div>

                    <p className="testi-quote">"{t.quote}"</p>

                    <div className="testi-travellers-row">
                      <div className="traveller-avatars">
                        <img src={t.avatar} alt={t.name} />
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Traveler 2" />
                        <span className="avatars-badge">3+</span>
                      </div>
                      <div className="traveller-info">
                        <strong>{t.name}</strong>
                        <small>{t.city}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
