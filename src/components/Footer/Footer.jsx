import { AGENCY_CONFIG } from '../../config/agencyConfig';
import logoImg from '../../assets/logo.png';
import './Footer.scss';

export default function Footer({ onNavigate }) {
  const handleLink = (page, e) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="footer-minimal" id="contact">
      <div className="container">
        <div className="footer-main-row">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="logo-img-wrapper">
                <img src={logoImg} alt={AGENCY_CONFIG.name} width="40" height="40" />
              </div>
              <div className="brand-text-block">
                <div className="brand-name">MAHAJAN<span>RIDES</span></div>
                <div className="brand-tagline">Force Tempo Traveller Services</div>
              </div>
            </div>
            <p className="footer-mission">
              Dedicated luxury 17-seater Force Tempo Traveller tours across Manali, Rohtang Pass, Kasol, Atal Tunnel, Dharamshala &amp; Spiti Valley with trusted local mountain chauffeurs.
            </p>
          </div>

          {/* Quick Subpage Links */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Navigation</h4>
            <div className="footer-nav-links">
              <button type="button" onClick={(e) => handleLink('home', e)} className="footer-link-btn">Home</button>
              <button type="button" onClick={(e) => handleLink('destinations', e)} className="footer-link-btn">Tour Circuits</button>
              <button type="button" onClick={(e) => handleLink('about', e)} className="footer-link-btn">About Fleet</button>
              <button type="button" onClick={(e) => handleLink('blog', e)} className="footer-link-btn">Travel Guides</button>
              <button type="button" onClick={(e) => handleLink('contact', e)} className="footer-link-btn">Contact Us</button>
            </div>
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="footer-contact-col">
            <h4 className="footer-col-title">Direct Inquiries</h4>
            <div className="footer-buttons-group">
              <a href={`tel:${AGENCY_CONFIG.ownerPhone}`} className="footer-cta-pill phone">
                <i className="fa-solid fa-phone"></i>
                <span>{AGENCY_CONFIG.displayPhone}</span>
              </a>

              <a 
                href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=Hello%20${AGENCY_CONFIG.name}!%20I%20want%20to%20inquire%20about%20a%20tour.`} 
                target="_blank" 
                rel="noreferrer" 
                className="footer-cta-pill whatsapp"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>WhatsApp Quote</span>
              </a>

              <a 
                href={AGENCY_CONFIG.instagramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="footer-cta-pill insta"
              >
                <i className="fa-brands fa-instagram"></i>
                <span>@{AGENCY_CONFIG.instagramUser}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="copy-text">
            &copy; {new Date().getFullYear()} {AGENCY_CONFIG.name}. All Rights Reserved. Dedicated Himachal Pradesh Force Tempo Traveller Specialists.
          </div>
          <div className="pickup-notice">
            <i className="fa-solid fa-location-dot"></i> Doorstep Pickup: Chandigarh • Delhi • Kalka • Manali
          </div>
        </div>
      </div>
    </footer>
  );
}
