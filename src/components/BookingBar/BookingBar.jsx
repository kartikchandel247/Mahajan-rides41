import { useState } from 'react';
import { motion } from 'framer-motion';
import { openWhatsAppInquiry } from '../../utils/whatsapp';
import './BookingBar.scss';

export default function BookingBar() {
  // Default date: 3 days ahead
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);
  const defaultDateString = defaultDate.toISOString().split('T')[0];
  const todayString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    destination: "",
    date: "",
    days: "",
    travelers: "",
    vehicle: "17-Seater Force Tempo Traveller (Luxury AC Pushback)"
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    openWhatsAppInquiry(formData);
  };

  return (
    <section className="booking-search-bar" id="bookingBar">
      <div className="container">
        <motion.div 
          className="booking-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="booking-header">
            <h3>
              <i className="fa-solid fa-compass"></i> Plan Your Tour &amp; Inquire Price
            </h3>
            <span className="booking-tag">
              <i className="fa-brands fa-whatsapp"></i> Instant WhatsApp Dispatch
            </span>
          </div>

          <form onSubmit={handleSubmit} className="booking-form-grid">
            {/* Destination */}
            <div className="booking-field">
              <label htmlFor="destination"><i className="fa-solid fa-location-dot"></i> Destination</label>
              <div className="booking-input-wrap">
                <select 
                  id="destination" 
                  name="destination" 
                  value={formData.destination} 
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Choose Destination...</option>
                  <option value="Manali, Solang Valley & Atal Tunnel">Manali, Solang &amp; Atal Tunnel</option>
                  <option value="Kullu, Kasol & Manikaran Sahib">Kullu, Kasol &amp; Manikaran Sahib</option>
                  <option value="Shimla, Kufri & Narkanda Hills">Shimla, Kufri &amp; Narkanda</option>
                  <option value="Dharamshala, McLeod Ganj & Dalhousie">Dharamshala &amp; McLeod Ganj</option>
                  <option value="Spiti Valley & Lahaul Circuit (Kaza, Key, Chandratal)">Spiti Valley &amp; Lahaul Circuit</option>
                  <option value="Chamba, Dalhousie & Khajjiar (Mini Switzerland)">Chamba &amp; Khajjiar</option>
                  <option value="Bir Billing (Paragliding) & Palampur Tea Gardens">Bir Billing &amp; Palampur</option>
                  <option value="Sissu, Keylong & Baralacha La Pass">Sissu &amp; Baralacha La Pass</option>
                  <option value="Custom Himachal Tour Itinerary">Custom Himachal Itinerary</option>
                </select>
              </div>
            </div>

            {/* Date of Tour */}
            <div className="booking-field">
              <label htmlFor="date"><i className="fa-solid fa-calendar-days"></i> Tour Date</label>
              <div className="booking-input-wrap">
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  min={todayString}
                  value={formData.date} 
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            {/* Duration / Number of Days */}
            <div className="booking-field">
              <label htmlFor="days"><i className="fa-solid fa-clock"></i> How Many Days</label>
              <div className="booking-input-wrap">
                <select 
                  id="days" 
                  name="days" 
                  value={formData.days} 
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Duration...</option>
                  <option value="3">3 Days - 2 Nights (Weekend)</option>
                  <option value="4">4 Days - 3 Nights (Short Trip)</option>
                  <option value="5">5 Days - 4 Nights (Standard)</option>
                  <option value="6">6 Days - 5 Nights (Comfort)</option>
                  <option value="7">7 Days - 6 Nights (Full Circuit)</option>
                  <option value="10">10+ Days (Extended Trip)</option>
                </select>
              </div>
            </div>

            {/* Passengers / Travelers */}
            <div className="booking-field">
              <label htmlFor="travelers"><i className="fa-solid fa-user-group"></i> Travelers</label>
              <div className="booking-input-wrap">
                <select 
                  id="travelers" 
                  name="travelers" 
                  value={formData.travelers} 
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Group Size...</option>
                  <option value="Small Group (4-8 Members)">Small Group (4-8 Members)</option>
                  <option value="Family Group (9-12 Members)">Family Group (9-12 Members)</option>
                  <option value="Full Capacity (13-17 Members)">Full Capacity (13-17 Members)</option>
                  <option value="Custom Group Size">Custom Group Size</option>
                </select>
              </div>
            </div>

            {/* Force Tempo Traveller - 17 Seater Only */}
            <div className="booking-field">
              <label htmlFor="vehicle"><i className="fa-solid fa-van-shuttle"></i> Force Tempo Traveller</label>
              <div className="booking-input-wrap">
                <select 
                  id="vehicle" 
                  name="vehicle" 
                  value={formData.vehicle} 
                  onChange={handleChange}
                  required
                >
                  <option value="17-Seater Force Tempo Traveller (Luxury AC Pushback)">17 Seater Luxury (Pushback AC)</option>
                </select>
              </div>
            </div>

            {/* Submit to WhatsApp */}
            <button type="submit" className="booking-btn-submit">
              <i className="fa-brands fa-whatsapp"></i> Inquire On WhatsApp
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
