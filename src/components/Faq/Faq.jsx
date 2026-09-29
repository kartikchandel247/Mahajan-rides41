import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_DATA } from '../../data/toursData';
import './Faq.scss';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section section-padding" id="faq">
      <div className="container">
        <div className="faq-grid">
          {/* Dual Image Column */}
          <div className="faq-images">
            <div className="faq-img">
              <img 
                src="/places/atal_tunnel.jpg" 
                alt="Atal Tunnel & Sissu, Himachal Pradesh" 
                loading="lazy"
              />
              <div className="faq-img-badge">
                <i className="fa-solid fa-mountain-sun"></i>
                <span>Atal Tunnel &amp; Sissu</span>
              </div>
            </div>
            <div className="faq-img">
              <img 
                src="/places/dharamshala.jpg" 
                alt="Dharamshala & Dhauladhar Range, Himachal Pradesh" 
                loading="lazy"
              />
              <div className="faq-img-badge">
                <i className="fa-solid fa-tree"></i>
                <span>Dharamshala &amp; Kangra</span>
              </div>
            </div>
          </div>

          {/* Right Accordion Column */}
          <div>
            <div className="section-subtitle">Got Questions?</div>
            <h2 className="section-title">Frequently asked <i>questions</i></h2>

            <div className="faq-accordion">
              {FAQ_DATA.map((item, idx) => {
                const isActive = activeIndex === idx;

                return (
                  <div key={idx} className={`faq-item ${isActive ? 'active' : ''}`}>
                    <button 
                      className="faq-header"
                      onClick={() => toggleAccordion(idx)}
                      aria-expanded={isActive}
                    >
                      <span>{item.question}</span>
                      <motion.i 
                        className="fa-solid fa-chevron-down"
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      ></motion.i>
                    </button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          className="faq-content-wrap"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="faq-content">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-text-style4">QUESTIONS</div>
    </section>
  );
}
