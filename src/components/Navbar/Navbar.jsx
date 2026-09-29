import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import logoImg from '../../assets/logo.png';
import './Navbar.scss';

export default function Navbar({ activePage = 'home', onNavigate, onBookClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', page: 'home' },
    { name: 'DESTINATIONS', page: 'destinations' },
    { name: 'ABOUT US', page: 'about' },
    { name: 'BLOG & GUIDES', page: 'blog' },
    { 
      name: 'PAGES', 
      page: 'pages',
      subLinks: [
        { name: 'All Tour Circuits', page: 'destinations' },
        { name: 'About Fleet & Heritage', page: 'about' },
        { name: 'Travel Guides & Reviews', page: 'blog' },
        { name: 'Direct WhatsApp Contact', page: 'contact' },
      ]
    },
    { name: 'CONTACT', page: 'contact' },
  ];

  const handleLinkClick = (page, e) => {
    if (e) e.preventDefault();
    if (page === 'pages') return;
    if (onNavigate) {
      onNavigate(page);
    }
    setMobileMenuOpen(false);
    setPagesDropdownOpen(false);
  };

  return (
    <>
      {/* Top Contact Strip */}
      <div className="header-topbar">
        <div className="container">
          <div className="topbar-content">
            <div className="topbar-info">
              <a href={`tel:${AGENCY_CONFIG.ownerPhone}`} className="topbar-contact-item">
                <i className="fa-solid fa-phone"></i> 
                <span>{AGENCY_CONFIG.displayPhone}</span>
              </a>
              <a href={`mailto:${AGENCY_CONFIG.email}`} className="topbar-contact-item topbar-email-item">
                <i className="fa-solid fa-envelope"></i> 
                <span>{AGENCY_CONFIG.email}</span>
              </a>
              <div className="topbar-live-badge">
                <span className="live-dot"></span>
                <span>24/7 Tour Support</span>
              </div>
            </div>

            <div className="topbar-actions">
              <a 
                href={AGENCY_CONFIG.instagramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="topbar-action-btn insta" 
                title="Follow on Instagram"
              >
                <i className="fa-brands fa-instagram"></i>
                <span>@mahajan_rides_41</span>
              </a>

              <a 
                href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}`} 
                target="_blank" 
                rel="noreferrer" 
                className="topbar-action-btn whatsapp" 
                title="Chat Directly on WhatsApp"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          {/* Logo */}
          <button 
            type="button" 
            onClick={(e) => handleLinkClick('home', e)} 
            className="brand-logo" 
            aria-label="Mahajanrides Home"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div className="logo-img-wrapper">
              <img 
                src={logoImg} 
                alt="Mahajanrides - Force Tempo Traveller Tours" 
                className="logo-img" 
                width="50" 
                height="50" 
              />
            </div>
            <div className="logo-text-group">
              <div className="logo-text">MAHAJAN<span>RIDES</span></div>
              <span className="logo-tagline">Force Tempo Traveller Services</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <ul className="navbar-nav desktop-nav">
            {navLinks.map((item) => (
              <li 
                key={item.name} 
                className={`nav-item ${item.subLinks ? 'has-dropdown' : ''}`}
                onMouseEnter={() => item.subLinks && setPagesDropdownOpen(true)}
                onMouseLeave={() => item.subLinks && setPagesDropdownOpen(false)}
              >
                <button 
                  type="button"
                  id={`nav-${item.page}`}
                  className={`nav-link ${activePage === item.page ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(item.page, e)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span className="rolling-text">{item.name}</span>
                  {item.subLinks && <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.68rem', marginLeft: '4px' }}></i>}
                </button>

                {item.subLinks && (
                  <ul className={`nav-dropdown-menu ${pagesDropdownOpen ? 'show' : ''}`}>
                    {item.subLinks.map((sub) => (
                      <li key={sub.name}>
                        <button 
                          type="button"
                          onClick={(e) => handleLinkClick(sub.page, e)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            width: '100%', 
                            textAlign: 'left',
                            padding: '10px 18px',
                            display: 'block',
                            fontFamily: 'inherit',
                            fontSize: '0.9rem',
                            color: activePage === sub.page ? '#2095AE' : '#0f2454',
                            fontWeight: activePage === sub.page ? '700' : '600'
                          }}
                        >
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* CTA & Mobile Toggle */}
          <div className="nav-actions">
            <button 
              className="butn-arrow" 
              onClick={() => onBookClick ? onBookClick() : handleLinkClick('destinations')}
              id="header-book-btn"
            >
              <span className="btn-text">Book Tour</span>
              <span className="arrow-wrap">
                <span className="arrow-inner">
                  <i className="fa-solid fa-arrow-right"></i>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </span>
            </button>

            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              id="mobile-nav-toggle-btn"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Framer Motion */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="mobile-nav-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul className="mobile-nav-list">
                {navLinks.map((item) => (
                  <li key={item.name} className="mobile-nav-item">
                    <button 
                      type="button"
                      className={activePage === item.page ? 'active' : ''}
                      onClick={(e) => handleLinkClick(item.page === 'pages' ? 'destinations' : item.page, e)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        width: '100%', 
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        color: 'inherit',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{item.name}</span>
                      <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                    </button>
                  </li>
                ))}
                <li className="mobile-cta-item" style={{ padding: '12px 16px' }}>
                  <a 
                    href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="butn-whatsapp"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <i className="fa-brands fa-whatsapp"></i> Chat On WhatsApp
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
