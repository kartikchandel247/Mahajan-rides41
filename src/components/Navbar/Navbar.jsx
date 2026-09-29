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

  const navLinks = [
    { name: 'Home', href: '#home', active: true },
    { name: 'About', href: '#about' },
    { name: 'Tours', href: '#tours' },
    { name: 'Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQs', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Contact Strip */}
      <div className="header-topbar">
        <div className="container">
          <div className="topbar-content">
            <div className="topbar-info">
              <a href={`tel:${AGENCY_CONFIG.ownerPhone}`}><i className="fa-solid fa-phone"></i> {AGENCY_CONFIG.displayPhone}</a>
              <a href={`mailto:${AGENCY_CONFIG.email}`}><i className="fa-solid fa-envelope"></i> {AGENCY_CONFIG.email}</a>
              <span className="topbar-hours"><i className="fa-solid fa-clock"></i> {AGENCY_CONFIG.hours}</span>
            </div>
            <div className="topbar-socials">
              <a href={AGENCY_CONFIG.instagramUrl} target="_blank" rel="noreferrer" title="Instagram Profile">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}`} target="_blank" rel="noreferrer" title="WhatsApp Direct">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a href="#home" title="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
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
              <li key={item.name} className="nav-item">
                <a href={item.href} className={`nav-link ${item.active ? 'active' : ''}`}>
                  <span className="rolling-text">{item.name}</span>
                </a>
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
                  <li key={item.name}>
                    <a 
                      href={item.href}
                      className={item.active ? 'active' : ''}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
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
