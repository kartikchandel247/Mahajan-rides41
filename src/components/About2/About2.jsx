import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import './About2.scss';

// Interactive 3D Tilt Card with cursor zoom in/out and touch support
function About2TiltCard({
  imageSrc,
  altText,
  badgeIcon,
  badgeText,
  className = '',
  scrollOffsetY,
  scrollRotateZ,
  isMobileOrTablet
}) {
  const cardRef = useRef(null);

  // Mouse / Touch offset from center [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scale = useMotionValue(1);
  const glareOpacity = useMotionValue(0);

  // Springs for smooth physics response
  const springX = useSpring(mouseX, { stiffness: 220, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 20 });
  const springScale = useSpring(scale, { stiffness: 220, damping: 22 });
  const springGlare = useSpring(glareOpacity, { stiffness: 200, damping: 24 });

  // 3D Tilt calculation:
  // Cursor moving up (mouseY < 0) -> Card tilts up (rotateX > 0)
  // Cursor moving down (mouseY > 0) -> Card tilts down (rotateX < 0)
  // Cursor moving left (mouseX < 0) -> Card tilts left (rotateY < 0)
  // Cursor moving right (mouseX > 0) -> Card tilts right (rotateY > 0)
  const maxTilt = isMobileOrTablet ? 8 : 13;
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Dynamic glare coordinates for glossy reflection
  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : null);
    if (clientX === null || clientY === null) return;

    const xPct = Math.max(-0.5, Math.min(0.5, (clientX - rect.left) / rect.width - 0.5));
    const yPct = Math.max(-0.5, Math.min(0.5, (clientY - rect.top) / rect.height - 0.5));

    mouseX.set(xPct);
    mouseY.set(yPct);
    scale.set(isMobileOrTablet ? 1.035 : 1.05); // Zoom in on cursor / touch
    glareOpacity.set(0.35);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1); // Zoom back out
    glareOpacity.set(0);
  };

  return (
    <motion.div 
      className="about2-card-scroll-wrap"
      style={{
        y: scrollOffsetY,
        rotateZ: scrollRotateZ
      }}
    >
      <motion.div
        ref={cardRef}
        className={`main-img img-cover ${className}`}
        style={{
          rotateX,
          rotateY,
          scale: springScale,
          transformPerspective: 1000,
          transformStyle: 'preserve-3d'
        }}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        onTouchStart={handlePointerMove}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerLeave}
        onTouchCancel={handlePointerLeave}
      >
        <img src={imageSrc} alt={altText} loading="lazy" />
        
        <div className="img-floating-badge">
          <i className={badgeIcon}></i>
          <span>{badgeText}</span>
        </div>

        {/* 3D Dynamic Glare Sheen Reflection */}
        <motion.div 
          className="tilt-glare-overlay"
          style={{
            opacity: springGlare,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 65%)`
            )
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function About2({ onNavigateAbout }) {
  const containerRef = useRef(null);

  const [deviceType, setDeviceType] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth < 640) return 'mobile';
    if (window.innerWidth < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track continuous scroll progress across the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth physical spring to eliminate jitter during rapid thumb/mouse scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.18,
    restDelta: 0.001
  });

  // Prominent travel distance for clearly visible motion:
  // Mobile: ±32px, Tablet: ±45px, Desktop: ±65px
  const travelDistance = deviceType === 'mobile' ? 32 : (deviceType === 'tablet' ? 45 : 65);

  // Dynamic tilt angle with scroll:
  // Mobile: ±2deg, Tablet: ±3deg, Desktop: ±4deg
  const scrollTiltAngle = deviceType === 'mobile' ? 2 : (deviceType === 'tablet' ? 3 : 4);

  // Card 1 goes DOWN when scrolling down, and UP when scrolling up
  const yDown = useTransform(smoothProgress, [0, 1], [-travelDistance, travelDistance]);
  const tiltDown = useTransform(smoothProgress, [0, 1], [-scrollTiltAngle, scrollTiltAngle]);

  // Card 2 goes UP when scrolling down, and DOWN when scrolling up
  const yUp = useTransform(smoothProgress, [0, 1], [travelDistance, -travelDistance]);
  const tiltUp = useTransform(smoothProgress, [0, 1], [scrollTiltAngle, -scrollTiltAngle]);

  const highlights = [
    { icon: 'fa-solid fa-map-location-dot', text: '18 Himachal Tour Circuits' },
    { icon: 'fa-solid fa-user-shield', text: 'Local Mountain Chauffeurs' },
    { icon: 'fa-solid fa-couch', text: '17-Seater Luxury AC Pushback' },
    { icon: 'fa-solid fa-route', text: 'Doorstep Pickup (Delhi / Chd)' },
  ];

  return (
    <div className="about2 section-padding bg-white" id="about" ref={containerRef}>
      <div className="container">
        <div className="about2-grid">
          {/* Left: Staggered Double Image Showcase with motion from left to right */}
          <motion.div 
            className="about2-img-col"
            initial={{ opacity: 0, x: -75 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="about2-img">
              {/* Image 1: Force Tempo Exterior — 3D Tilt + Moves DOWN when scrolling down, UP when scrolling up */}
              <About2TiltCard
                imageSrc="/vehicle/tempo_traveller_exterior.png"
                altText="Mahajanrides 17 Seater Force Tempo Traveller Exterior"
                badgeIcon="fa-solid fa-van-shuttle"
                badgeText="Force Tempo 17-Seater"
                className="duru-slide-down"
                scrollOffsetY={yDown}
                scrollRotateZ={tiltDown}
                isMobileOrTablet={deviceType !== 'desktop'}
              />

              {/* Image 2: Force Tempo Interior — 3D Tilt + Moves UP when scrolling down, DOWN when scrolling up */}
              <About2TiltCard
                imageSrc="/vehicle/tempo_traveller_interior.png"
                altText="Mahajanrides Luxury Recliner Pushback Seats"
                badgeIcon="fa-solid fa-couch"
                badgeText="Luxury AC Pushback"
                className="duru-slide-up"
                scrollOffsetY={yUp}
                scrollRotateZ={tiltUp}
                isMobileOrTablet={deviceType !== 'desktop'}
              />
            </div>
          </motion.div>

          {/* Right: Content Column with motion from right to left */}
          <motion.div 
            className="about2-content-col"
            initial={{ opacity: 0, x: 75 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-subtitle">Himachal Fleet Specialists</div>
            <h2 className="section-title">
              Discover Himachal <i>with our mountain chauffeurs</i>
            </h2>
            <p className="about2-desc">
              Rooted in the Himalayas, <strong>{AGENCY_CONFIG.name}</strong> delivers safe, punctual, and luxury 17-Seater Force Tempo Traveller travel across Devbhoomi. From the snow-capped heights of Rohtang Pass, Atal Tunnel, and Spiti Valley to the lush orchards of Kasol, Manali, and Dharamshala — we handle road permits, high-altitude driving, and luggage comfort with seasoned local drivers.
            </p>

            {/* Benefit Highlights List */}
            <ul className="listo">
              {highlights.map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: 0.15 + idx * 0.08 }}
                >
                  <i className={item.icon}></i>
                  <span>{item.text}</span>
                </motion.li>
              ))}
            </ul>

            {/* Customers Proof Bar & Action Button */}
            <div className="customers">
              <div className="c-img">
                <ul>
                  <li><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Customer 1" /></li>
                  <li><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Customer 2" /></li>
                  <li><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Customer 3" /></li>
                </ul>
                <div className="c-text">
                  <h3><b>500+</b></h3>
                  <span>Happy Mountain Tours</span>
                </div>
              </div>

              <button 
                type="button" 
                className="butn-arrow" 
                onClick={onNavigateAbout}
              >
                <span className="btn-text">About Our Fleet</span>
                <span className="arrow-wrap">
                  <span className="arrow-inner">
                    <i className="fa-solid fa-arrow-right"></i>
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tourvex Background Subtle Watermark */}
      <div className="bg-text-style">MAHAJAN</div>
    </div>
  );
}
