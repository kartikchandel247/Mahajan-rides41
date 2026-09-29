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
    destination: "Himachal Circuit (Shimla & Manali)",
    date: defaultDateString,
    days: "5",
    travelers: "2 Adults (Couple)",
    vehicle: "Toyota Innova Crysta"
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
                  <option value="Himachal Circuit (Shimla & Manali)">Himachal (Shimla & Manali)</option>
                  <option value="Kashmir Paradise (Srinagar & Gulmarg)">Kashmir (Srinagar & Gulmarg)</option>
                  <option value="Ladakh Mountain Expedition (Leh, Nubra, Pangong)">Ladakh High Passes</option>
                  <option value="Royal Rajasthan Circuit (Jaipur & Udaipur)">Royal Rajasthan Heritage</option>
                  <option value="Goa Beach & Coastal Holiday">Goa Beach Retreat</option>
                  <option value="Golden Triangle (Delhi, Agra & Jaipur)">Golden Triangle (Agra Taj)</option>
                  <option value="Dubai International Vacation">Dubai Luxury Tour</option>
                  <option value="Custom Tour Itinerary">Custom Destination</option>
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
                  <option value="3">3 Days - 2 Nights (Weekend)</option>
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
                  <option value="1 Solo Traveler">1 Solo Traveler</option>
                  <option value="2 Adults (Couple)">2 Adults (Couple)</option>
                  <option value="Family (3-5 Members)">Family (3-5 Members)</option>
                  <option value="Group (6+ People)">Group (6+ People)</option>
                </select>
              </div>
            </div>

            {/* Cab / Vehicle Preference */}
            <div className="booking-field">
              <label htmlFor="vehicle"><i className="fa-solid fa-car"></i> Cab / Fleet</label>
              <div className="booking-input-wrap">
                <select 
                  id="vehicle" 
                  name="vehicle" 
                  value={formData.vehicle} 
                  onChange={handleChange}
                  required
                >
                  <option value="Toyota Innova Crysta (SUV)">Innova Crysta (SUV)</option>
                  <option value="Swift Dzire / Etios (Sedan)">Sedan (Dzire / Etios)</option>
                  <option value="Tempo Traveller (12/17 Seater)">Tempo Traveller</option>
                  <option value="Force Urbania Luxury Van">Force Urbania (Luxury)</option>
                  <option value="Standard Cab (Budget Friendly)">Standard Cab</option>
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
