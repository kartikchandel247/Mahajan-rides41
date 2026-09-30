import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/logo.png';
import './Navbar.scss';

export default function Navbar({ activePage = 'home', onNavigate, _onBookClick }) {
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
    { name: 'ABOUT', page: 'about' },
    { name: 'TOURS', page: 'destinations' },
    { name: 'BOOK NOW', page: 'booking' },
    { 
      name: 'PAGES', 
      page: 'pages',
      subLinks: [
        { name: 'All 18 Tour Circuits', page: 'destinations' },
        { name: 'Instant Quote & Booking', page: 'booking' },
        { name: 'Tempo Traveller Fleet', page: 'about' },
        { name: 'Travel Guides & Reviews', page: 'blog' },
        { name: 'Direct WhatsApp Contact', page: 'contact' },
      ]
    },
    { name: 'BLOG', page: 'blog' },
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
      {/* Main Sticky Navbar - Clean Light Theme */}
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
                width="46" 
                height="46" 
              />
            </div>
            <div className="logo-text-group">
              <div className="logo-text">MAHAJAN<span>RIDES</span></div>
              <span className="logo-tagline">Himachal Tour Services</span>
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
                  <span>{item.name}</span>
                  {item.subLinks && <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.62rem', marginLeft: '5px' }}></i>}
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

          {/* Mobile Toggle */}
          <div className="nav-actions">
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
                {navLinks.filter(item => item.page !== 'pages').map((item) => (
                  <li key={item.name} className="mobile-nav-item">
                    <button 
                      type="button"
                      className={activePage === item.page ? 'active' : ''}
                      onClick={(e) => handleLinkClick(item.page, e)}
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
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
