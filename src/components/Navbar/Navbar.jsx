import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import logoImg from '../../assets/logo.png';
import './Navbar.scss';

export default function Navbar({ onBookClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [activeLink, setActiveLink] = useState('#home');
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = [
        { id: 'contact', href: '#contact' },
        { id: 'blog', href: '#blog' },
        { id: 'faq', href: '#pages' },
        { id: 'reviews', href: '#pages' },
        { id: 'services', href: '#services' },
        { id: 'destinations', href: '#destinations' },
        { id: 'tours', href: '#tours' },
        { id: 'about', href: '#about' },
        { id: 'home', href: '#home' },
      ];

      const scrollPosition = window.scrollY + 180;
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveLink(sec.href);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#home' },
    { name: 'ABOUT', href: '#about' },
    { name: 'TOURS', href: '#tours' },
    { name: 'DESTINATIONS', href: '#destinations' },
    { name: 'SERVICES', href: '#services' },
    { 
      name: 'PAGES', 
      href: '#reviews',
      subLinks: [
        { name: 'Customer Reviews', href: '#reviews' },
        { name: 'Trip FAQs', href: '#faq' },
        { name: 'Booking Search', href: '#bookingBar' },
      ]
    },
    { name: 'BLOG', href: '#blog' },
    { name: 'CONTACT', href: '#contact' },
  ];

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
          <a href="#home" className="brand-logo" aria-label="Mahajanrides Home">
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
          </a>

          {/* Desktop Navigation Links */}
          <ul className="navbar-nav desktop-nav">
            {navLinks.map((item) => (
              <li 
                key={item.name} 
                className={`nav-item ${item.subLinks ? 'has-dropdown' : ''}`}
                onMouseEnter={() => item.subLinks && setPagesDropdownOpen(true)}
                onMouseLeave={() => item.subLinks && setPagesDropdownOpen(false)}
              >
                <a 
                  href={item.href} 
                  className={`nav-link ${activeLink === item.href ? 'active' : ''}`}
                  onClick={() => setActiveLink(item.href)}
                >
                  <span className="rolling-text">{item.name}</span>
                </a>

                {item.subLinks && (
                  <ul className={`nav-dropdown-menu ${pagesDropdownOpen ? 'show' : ''}`}>
                    {item.subLinks.map((sub) => (
                      <li key={sub.name}>
                        <a 
                          href={sub.href} 
                          onClick={() => {
                            setActiveLink('#pages');
                            setPagesDropdownOpen(false);
                          }}
                        >
                          {sub.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* CTA & Mobile Toggle */}
          <div className="nav-actions">
            <button className="butn-arrow" onClick={onBookClick}>
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
                    <a 
                      href={item.href}
                      className={activeLink === item.href ? 'active' : ''}
                      onClick={() => {
                        setActiveLink(item.href);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
                <li className="mobile-cta-item">
                  <a 
                    href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="butn-whatsapp"
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
