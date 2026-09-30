import { motion } from 'framer-motion';
import './ExploreBanner.scss';

export default function ExploreBanner({ onExploreTours, onBookClick, onNavigateAbout }) {
  const handleScrollDown = () => {
    const nextSection = document.getElementById('popular-tours') || document.getElementById('services');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    <section className="explore-banner-section" id="exploreBanner">
      <div className="container">
        {/* Main Curved Panoramic Banner */}
        <div className="explore-banner-frame">
          {/* Scenic Background Image */}
          <div className="banner-bg-media">
            <img 
              src="/places/himachal_explore_banner.jpg" 
              alt="Panoramic View of Himachal Pradesh Mountains and Highway" 
              loading="lazy" 
            />
            <div className="banner-scrim-overlay"></div>
          </div>

          {/* Center Banner Content */}
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
                {/* Rotating SVG circular text */}
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

                {/* Center Down Arrow */}
                <div className="stamp-center-arrow">
                  <i className="fa-solid fa-arrow-down"></i>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 4 Floating Feature Cards Overlapping Banner Bottom */}
        <div className="explore-floating-cards-grid">
          {featurePillars.map((item, idx) => (
            <motion.div
              key={item.id}
              className="floating-feature-card"
              onClick={item.onClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && item.onClick && item.onClick()}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15, margin: "0px 0px -25px 0px" }}
              transition={{ 
                duration: 0.6, 
                delay: idx * 0.08 + 0.05, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              whileHover={{ y: -8, scale: 1.04, transition: { duration: 0.22 } }}
              whileTap={{ scale: 0.97 }}
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
          ))}
        </div>
      </div>
    </section>
  );
}
