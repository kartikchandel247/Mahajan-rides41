import { useState } from 'react';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import './Footer.scss';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const instaPhotos = [
    { id: 1, img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80" },
    { id: 2, img: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=400&q=80" },
    { id: 3, img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
    { id: 4, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80" },
    { id: 5, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" },
    { id: 6, img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <footer className="footer" id="contact">
      <div className="container">
        {/* Newsletter Section */}
        <div className="footer-newsletter-wrap">
          <div className="section-subtitle">Subscribe to Travel Deals</div>
          <h2 className="section-title text-white">Get seasonal tour offers <i>direct to your inbox!</i></h2>
          
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <button type="submit">Subscribe</button>
          </form>

          {subscribed && (
            <p className="newsletter-success">
              <i className="fa-solid fa-circle-check"></i> Thank you for subscribing to {AGENCY_CONFIG.name}!
            </p>
          )}
        </div>

        {/* Instagram Grid Showcase */}
        <div className="footer-insta-section text-center">
          <h3 className="insta-heading">Follow Our Road Adventures On Instagram</h3>
          
          <div className="footer-insta-grid">
            {instaPhotos.map((photo) => (
              <a 
                key={photo.id}
                href={AGENCY_CONFIG.instagramUrl} 
                target="_blank" 
                rel="noreferrer"
                className="insta-photo-card"
                title={`View ${AGENCY_CONFIG.name} on Instagram`}
              >
                <img src={photo.img} alt={`Trip photo ${photo.id}`} loading="lazy" />
                <div className="insta-overlay">
                  <i className="fa-brands fa-instagram"></i>
                </div>
              </a>
            ))}
          </div>

          <a 
            href={AGENCY_CONFIG.instagramUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="insta-follow-btn"
          >
            <i className="fa-brands fa-instagram"></i> Follow @{AGENCY_CONFIG.instagramUser} on Instagram
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} {AGENCY_CONFIG.name}. All Rights Reserved. Crafted for unforgettable journeys.
          </div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#tours">Tours</a>
            <a href="#services">Services</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQs</a>
          </div>
        </div>
      </div>

      {/* Massive Watermark Typography */}
      <div className="footer-watermark">{AGENCY_CONFIG.name}</div>
    </footer>
  );
}
