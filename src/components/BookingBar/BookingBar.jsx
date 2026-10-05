import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { openWhatsAppInquiry } from '../../utils/whatsapp';
import { FEATURED_TOURS } from '../../data/toursData';
import { saveClientInquiry } from '../../lib/supabase';
import './BookingBar.scss';

const TODAY_STRING = new Date().toISOString().split('T')[0];

export default function BookingBar({ initialDestination = "", className = "" }) {
  const [formData, setFormData] = useState({
    destination: initialDestination || "",
    date: "",
    days: "",
    travelers: "",
    vehicle: "17-Seater Force Tempo Traveller (Luxury AC Pushback)"
  });

  useEffect(() => {
    if (initialDestination) {
      setFormData(prev => (prev.destination === initialDestination ? prev : { ...prev, destination: initialDestination }));
    }
  }, [initialDestination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'destination' && (value === 'One-Day Trip' || value.toLowerCase().includes('one-day'))) {
        next.days = '1';
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Automatically save lead to Supabase database
    saveClientInquiry({
      name: 'Website Visitor',
      destination: formData.destination,
      travelDate: formData.date,
      groupSize: `${formData.travelers} Travelers (${formData.days === '1' ? 'One-Day Trip' : `${formData.days} Days`})`,
      vehicleType: formData.vehicle
    }).catch(err => console.warn('Supabase auto-save error:', err));

    openWhatsAppInquiry(formData);
  };

  return (
    <section className={`booking-search-bar ${className}`} id="bookingBar">
      <div className="container">
        <motion.div 
          className="booking-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="booking-header">
            <h3>
              <i className="fa-solid fa-compass"></i> Plan Your Tour &amp; Inquire Price
            </h3>
            <span className="booking-tag">
              <i className="fa-brands fa-whatsapp"></i> WhatsApp Inquiry: +91 85804 62440
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
                  <option value="One-Day Trip">One-Day Trip</option>
                  {FEATURED_TOURS && FEATURED_TOURS.map(tour => (
                    <option key={tour.id} value={tour.title}>
                      {tour.title}
                    </option>
                  ))}
                  <option value="Doorstep Pickup & Transfer (Delhi / Chandigarh / Kalka)">Doorstep Pickup & Transfer (Delhi / Chandigarh / Kalka)</option>
                  <option value="Rohtang Green Permits & Chauffeur Services">Rohtang Green Permits & Chauffeur Services</option>
                  <option value="Custom Himachal Tour Itinerary">Custom Himachal Itinerary (Tailored for you)</option>
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
                  min={TODAY_STRING}
                  value={formData.date} 
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            {/* Duration */}
            <div className="booking-field">
              <label htmlFor="days"><i className="fa-solid fa-clock"></i> Duration</label>
              <div className="booking-input-wrap">
                <select 
                  id="days" 
                  name="days" 
                  value={formData.days} 
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Days...</option>
                  <option value="1">1 Day Trip</option>
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
                  <option value="" disabled>Group Size...</option>
                  <option value="Small Group (4-8 Members)">Small Group (4-8 Members)</option>
                  <option value="Family Group (9-12 Members)">Family Group (9-12 Members)</option>
                  <option value="Full Capacity (13-17 Members)">Full Capacity (13-17 Members)</option>
                  <option value="Custom Group Size">Custom Group Size</option>
                </select>
              </div>
            </div>

            {/* Force Tempo Traveller - 17 Seater Only */}
            <div className="booking-field">
              <label htmlFor="vehicle"><i className="fa-solid fa-van-shuttle"></i> Force Tempo</label>
              <div className="booking-input-wrap">
                <select 
                  id="vehicle" 
                  name="vehicle" 
                  value={formData.vehicle} 
                  onChange={handleChange}
                  required
                >
                  <option value="17-Seater Force Tempo Traveller (Luxury AC Pushback)">17-Seater Luxury AC</option>
                </select>
              </div>
            </div>

            {/* Submit to WhatsApp */}
            <button type="submit" className="booking-btn-submit">
              <i className="fa-brands fa-whatsapp"></i>
              <span>Inquire on WhatsApp</span>
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
