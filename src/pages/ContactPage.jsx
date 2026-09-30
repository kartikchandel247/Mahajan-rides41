import { useState } from 'react';
import { motion } from 'framer-motion';
import PageBanner from '../components/PageBanner/PageBanner';
import { AGENCY_CONFIG } from '../config/agencyConfig';
import { openWhatsAppInquiry } from '../utils/whatsapp';
import { openEmailInquiry, getGmailComposeUrl } from '../utils/email';
import { saveClientInquiry } from '../lib/supabase';
import './ContactPage.scss';

export default function ContactPage({ onNavigateHome }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    destination: 'Manali & Atal Tunnel 5D/4N',
    pickup: 'Chandigarh Airport/Station',
    date: '',
    passengers: '8 to 15 Persons',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Permanently record inquiry in Supabase database
    saveClientInquiry({
      name: formData.name,
      phone: formData.phone,
      destination: formData.destination,
      pickupLocation: formData.pickup,
      travelDate: formData.date,
      groupSize: formData.passengers,
      specialNotes: formData.notes
    }).catch(err => console.warn('Supabase lead save error:', err));
    const query = `🏔️ *New Tour Inquiry from Mahajanrides Website*%0A%0A` +
      `👤 *Name:* ${encodeURIComponent(formData.name || 'Traveler')}%0A` +
      `📞 *Phone:* ${encodeURIComponent(formData.phone || 'Direct WhatsApp')}%0A` +
      `📍 *Destination:* ${encodeURIComponent(formData.destination)}%0A` +
      `🚖 *Pickup Location:* ${encodeURIComponent(formData.pickup)}%0A` +
      `📅 *Tentative Travel Date:* ${encodeURIComponent(formData.date || 'To be decided')}%0A` +
      `👥 *Group Size:* ${encodeURIComponent(formData.passengers)}%0A` +
      `🚐 *Vehicle:* 17-Seater Force Tempo Traveller%0A` +
      `💬 *Special Notes:* ${encodeURIComponent(formData.notes || 'Looking for best rates and itinerary.')}`;

    window.open(`https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=${query}`, '_blank');
  };

  return (
    <div className="contact-page">
      <PageBanner 
        title="Contact & Tour Inquiries"
        subtitle="Direct Fleet Owner Support 24/7"
        breadcrumb="Contact Us"
        bgImage="/places/manali.jpg"
        onNavigateHome={onNavigateHome}
      />

      <section className="contact-content-section section-padding">
        <div className="container">
          <div className="contact-grid">
            {/* Left Contact Info Column */}
            <motion.div 
              className="contact-info-col"
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="section-subtitle">Get In Touch Directly</span>
              <h2 className="section-title">We Are Here To Plan Your <i>Dream Mountain Trip</i></h2>
              <p className="contact-intro">
                Have questions regarding road conditions, Rohtang permits, luggage capacity, or customized itineraries? Reach out directly to the owner for immediate assistance and transparent pricing.
              </p>

              <div className="contact-cards-list">
                <a href={`tel:${AGENCY_CONFIG.ownerPhone}`} className="contact-info-card">
                  <div className="card-icon phone">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div className="card-details">
                    <span>Direct Phone Call</span>
                    <strong>{AGENCY_CONFIG.displayPhone}</strong>
                    <small>Tap to call directly</small>
                  </div>
                </a>

                <a 
                  href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="contact-info-card"
                >
                  <div className="card-icon whatsapp">
                    <i className="fa-brands fa-whatsapp"></i>
                  </div>
                  <div className="card-details">
                    <span>Instant WhatsApp Chat</span>
                    <strong>+{AGENCY_CONFIG.ownerPhone}</strong>
                    <small>Instant reply &amp; quotes</small>
                  </div>
                </a>

                <a 
                  href={getGmailComposeUrl()} 
                  onClick={(e) => {
                    e.preventDefault();
                    openEmailInquiry();
                  }}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-info-card"
                  title="Click to compose email in Gmail"
                >
                  <div className="card-icon email">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="card-details">
                    <span>Email Us (Direct Gmail)</span>
                    <strong>{AGENCY_CONFIG.email}</strong>
                    <small>Tap to compose inquiry in Gmail</small>
                  </div>
                </a>

                <div className="contact-info-card">
                  <div className="card-icon location">
                    <i className="fa-solid fa-map-location-dot"></i>
                  </div>
                  <div className="card-details">
                    <span>Fleet Base &amp; Coverage</span>
                    <strong>Himachal Pradesh, India</strong>
                    <small>Serving Manali, Shimla, Dharamshala, Spiti &amp; Chandigarh</small>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Booking / Quote Builder Form */}
            <motion.div 
              className="contact-form-col"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="quote-form-card">
                <div className="form-head">
                  <h3><i className="fa-solid fa-van-shuttle text-primary"></i> Fast WhatsApp Quote Builder</h3>
                  <p>Fill out your basic trip requirements to get instant pricing on WhatsApp:</p>
                </div>

                <form onSubmit={handleSubmit} className="custom-quote-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Amit Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone / WhatsApp Number</label>
                      <input 
                        type="tel" 
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Destination Circuit *</label>
                      <select 
                        value={formData.destination}
                        onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      >
                        <option value="Manali, Solang & Atal Tunnel 5D/4N">Manali, Solang &amp; Atal Tunnel (5D/4N)</option>
                        <option value="Kasol, Manikaran & Tosh 4D/3N">Kasol, Manikaran &amp; Tosh (4D/3N)</option>
                        <option value="Dharamshala, McLeod Ganj & Dalhousie 6D/5N">Dharamshala, McLeod Ganj &amp; Dalhousie (6D/5N)</option>
                        <option value="Spiti Valley Expedition 7D/6N">Spiti Valley High Passes Circuit (7D/6N)</option>
                        <option value="Bir Billing & Palampur Tea Gardens 4D/3N">Bir Billing &amp; Palampur (4D/3N)</option>
                        <option value="Chamba & Khajjiar Pines 5D/4N">Chamba &amp; Khajjiar (5D/4N)</option>
                        <option value="Custom Himachal Family Circuit">Custom Himachal Circuit</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Pickup Location *</label>
                      <select 
                        value={formData.pickup}
                        onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                      >
                        <option value="Chandigarh Airport/Railway Station">Chandigarh Airport / Station</option>
                        <option value="Delhi NCR Doorstep Pickup">Delhi NCR Doorstep</option>
                        <option value="Kalka Railway Station">Kalka Railway Station</option>
                        <option value="Amritsar / Pathankot">Amritsar / Pathankot</option>
                        <option value="Shimla / Manali Local">Shimla / Manali Local</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tentative Travel Date</label>
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Group Size (1 to 17 Persons)</label>
                      <select 
                        value={formData.passengers}
                        onChange={(e) => setFormData({...formData, passengers: e.target.value})}
                      >
                        <option value="4 to 8 Persons">4 to 8 Persons (Spacious)</option>
                        <option value="8 to 12 Persons">8 to 12 Persons</option>
                        <option value="12 to 17 Persons">12 to 17 Persons (Full 17-Seater Force)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Additional Requirements / Questions</label>
                    <textarea 
                      rows="3"
                      placeholder="e.g. Senior citizens traveling, hotel recommendations, Rohtang pass snow permit..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    ></textarea>
                  </div>

                  <button type="submit" className="butn-whatsapp submit-quote-btn">
                    <i className="fa-brands fa-whatsapp"></i> Get Quote on WhatsApp
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
