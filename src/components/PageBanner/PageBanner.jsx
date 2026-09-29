import { motion } from 'framer-motion';
import './PageBanner.scss';

export default function PageBanner({ title, subtitle, breadcrumb, bgImage = '/places/himachal_mountain_scenery.jpg', onNavigateHome }) {
  return (
    <div className="subpage-banner" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="subpage-banner-overlay"></div>
      <div className="container subpage-banner-container">
        <motion.div 
          className="subpage-banner-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {subtitle && <span className="subpage-badge">{subtitle}</span>}
          <h1 className="subpage-title">{title}</h1>
          
          <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
            <button 
              type="button" 
              className="breadcrumb-btn" 
              onClick={() => onNavigateHome ? onNavigateHome() : (window.location.hash = '#/')}
            >
              <i className="fa-solid fa-house"></i> Home
            </button>
            <span className="breadcrumb-separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="breadcrumb-current">{breadcrumb || title}</span>
          </nav>
        </motion.div>
      </div>
    </div>
  );
}
