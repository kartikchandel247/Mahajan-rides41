import { motion } from 'framer-motion';
import { TESTIMONIALS_DATA } from '../../data/toursData';
import './Testimonials.scss';

export default function Testimonials() {
  return (
    <section className="testimonials-section section-padding" id="testimonials">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <div className="section-subtitle">Real Passenger Reviews</div>
          <h2 className="section-title">Our happy <i>traveller stories</i></h2>
        </div>

        <div className="testimonials-accordion-grid">
          {TESTIMONIALS_DATA.map((t, idx) => (
            <motion.div 
              key={t.id} 
              className="testi-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={t.image} alt={t.tour} loading="lazy" />
              <div className="testi-card-overlay">
                <h3 className="testi-tour-name">{t.tour}</h3>
                <div className="testi-rating">
                  {[...Array(t.rating)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star"></i>
                  ))}
                </div>
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-author">
                  <img src={t.avatar} alt={t.name} />
                  <div className="testi-author-info">
                    <h4>{t.name}</h4>
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
