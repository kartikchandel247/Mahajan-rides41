import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './ExploreBanner.scss';

export default function ExploreBanner({ onExploreTours, onBookClick, onNavigateAbout }) {
  const sectionRef = useRef(null);

  const handleScrollDown = () => {
    const nextSection = document.getElementById('popular-tours') || document.getElementById('services');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Continuous scroll progress for trending swipe/scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.18,
    restDelta: 0.001
  });

  // Trending opposing wave motion for cards as user scrolls or swipes:
  // Even cards float in phase A:
  const cardWaveA = useTransform(smoothProgress, [0, 1], [-16, 16]);
  const cardTiltA = useTransform(smoothProgress, [0, 1], [-2, 2]);

  // Odd cards float in opposite phase B:
  const cardWaveB = useTransform(smoothProgress, [0, 1], [16, -16]);
  const cardTiltB = useTransform(smoothProgress, [0, 1], [2, -2]);

  const featurePillars = [
    {
      id: 'circuits',
      icon: 'fa-solid fa-earth-americas',
      title: '18 Tour Circuits',
      subtitle: 'Complete Himachal packages',
      onClick: onExploreTours
    },
    {
      id: 'transfers',
      icon: 'fa-solid fa-plane-departure',
      title: 'Doorstep Pickup',
      subtitle: 'Delhi & Chandigarh transfers',
      onClick: () => onBookClick ? onBookClick('Doorstep Transfer') : null
    },
    {
      id: 'passes',
      icon: 'fa-solid fa-mountain-sun',
      title: 'Mountain Passes',
      subtitle: 'Rohtang, Atal Tunnel & Spiti',
      onClick: onExploreTours
    },
    {
      id: 'scenery',
      icon: 'fa-solid fa-camera',
      title: 'Scenic Photography',
      subtitle: 'Unmatched mountain memories',
      onClick: onNavigateAbout
    }
  ];

  return (
    <section className="explore-banner-section" id="exploreBanner" ref={sectionRef}>
      <div className="container">
        {/* Main Curved Panoramic Banner Frame with cards fitted directly inside */}
        <div className="explore-banner-frame">
          {/* Real Panoramic Background Image of Spiti Valley, Himachal Pradesh */}
          <div className="banner-bg-media">
            <img 
              src="/places/himachal_explore_banner.jpg" 
              alt="Real Panoramic View of Spiti Valley Kee Monastery, Himachal Pradesh" 
              loading="lazy" 
            />
            <div className="banner-scrim-overlay"></div>
          </div>

          {/* Banner Content Body (Text + Rotating Seal + Cards fitted inside) */}
          <div className="banner-content-body">
            <motion.div 
              className="banner-text-wrap text-center"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="banner-eyebrow">
                <i className="fa-solid fa-compass"></i> Discover Devbhoomi Himachal
              </span>
              <h2 className="banner-headline">
                Get ready to explore and<br />
                discover your world.
              </h2>
            </motion.div>

            {/* Rotating Circular Stamp with Down Arrow */}
            <motion.div 
              className="stamp-seal-wrap"
              onClick={handleScrollDown}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleScrollDown()}
              title="Scroll down to popular circuits"
              aria-label="Scroll down to popular circuits"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <div className="stamp-circle-disc">
                <svg className="rotating-text-svg" viewBox="0 0 160 160">
                  <path
                    id="stampCirclePath"
                    d="M 80, 80 m -56, 0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0"
                    fill="none"
                  />
                  <text>
                    <textPath href="#stampCirclePath" startOffset="0%">
                      NATURE ESCAPE • CULTURAL PATHS • MOUNTAIN TRAILS •
                    </textPath>
                  </text>
                </svg>

                <div className="stamp-center-arrow">
                  <i className="fa-solid fa-arrow-down"></i>
                </div>
              </div>
            </motion.div>

            {/* 4 Feature Cards Fitted Directly Inside the Image Banner */}
            <div className="explore-floating-cards-grid">
              {featurePillars.map((item, idx) => {
                const isEven = idx % 2 === 0;
                const waveY = isEven ? cardWaveA : cardWaveB;
                const tiltZ = isEven ? cardTiltA : cardTiltB;

                return (
                  <motion.div
                    key={item.id}
                    className="floating-feature-card"
                    onClick={item.onClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && item.onClick && item.onClick()}
                    style={{
                      y: waveY,
                      rotateZ: tiltZ
                    }}
                    initial={{ opacity: 0, y: 35, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.15, margin: "0px 0px -25px 0px" }}
                    transition={{ 
                      duration: 0.6, 
                      delay: idx * 0.08 + 0.05, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    whileHover={{ 
                      scale: 1.045, 
                      boxShadow: "0 20px 45px rgba(0, 0, 0, 0.28)",
                      transition: { duration: 0.22 } 
                    }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {/* Feature Icon */}
                    <div className="card-icon-wrap">
                      <i className={item.icon}></i>
                    </div>

                    {/* Card Text */}
                    <div className="card-info">
                      <h4>{item.title}</h4>
                      <p>{item.subtitle}</p>
                    </div>

                    {/* Micro Corner / Action Arrow */}
                    <div className="card-action-arrow">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
