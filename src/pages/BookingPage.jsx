import { useEffect } from 'react';
import { motion } from 'framer-motion';
import PageBanner from '../components/PageBanner/PageBanner';
import BookingBar from '../components/BookingBar/BookingBar';
import { AGENCY_CONFIG } from '../config/agencyConfig';
import './BookingPage.scss';

export default function BookingPage({ 
  selectedTour = '', 
  onNavigateHome, 
  onNavigateDestinations, 
  onNavigateContact 
}) {
  useEffect(() => {
    // Smooth scroll to quotation bar when landing on booking page
    const timer = setTimeout(() => {
      const el = document.getElementById('bookingBar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedTour]);

  return (
    <div className="booking-page">
      {/* 1. Subpage Header Banner */}
      <PageBanner 
        title="Book Your Himachal Tour"
        subtitle="Instant Quotation & Fast Confirmation"
        breadcrumb="Book Now"
        bgImage="/places/himachal_mountain_scenery.jpg"
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Main Quotation & Booking Bar Section */}
      <section className="booking-page-main-wrap section-padding">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-subtitle">Instant Quotation</span>
            <h2 className="section-title">Ready to Plan Your <i>Himachal Vacation?</i></h2>
            <p className="booking-page-lead">
              Select your dates and group size below to generate an immediate WhatsApp quote:
            </p>
          </div>

          {/* Booking Bar Component */}
          <div className="booking-bar-container">
            <BookingBar initialDestination={selectedTour} />
          </div>
        </div>
      </section>

      {/* 3. Fleet & Service Guarantees */}
      <section className="booking-guarantees-section">
        <div className="container">
          <div className="guarantees-grid">
            <div className="guarantee-card">
              <div className="guarantee-icon">
                <i className="fa-solid fa-van-shuttle"></i>
              </div>
              <h4>17-Seater Force Luxury</h4>
              <p>Comfortable pushback seats, dual AC, large luggage carrier, and clean interiors for group travel.</p>
            </div>

            <div className="guarantee-card">
              <div className="guarantee-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4>Himachal Green Permits</h4>
              <p>Authorized access for Rohtang Pass, Atal Tunnel, Sissu, and all Himachal commercial border checkpoints.</p>
            </div>

            <div className="guarantee-card">
              <div className="guarantee-icon">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <h4>Local Mountain Drivers</h4>
              <p>Born and trained in Himachal hills with 10+ years mastery of snow, steep hairpin bends, and high passes.</p>
            </div>

            <div className="guarantee-card">
              <div className="guarantee-icon">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <h4>Direct Owner Pricing</h4>
              <p>No agent commission or broker markups. Instant transparent quotation directly from the fleet owner.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 3-Step Simple Booking Guide */}
      <section className="booking-steps-section section-padding">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-subtitle">How It Works</span>
            <h2 className="section-title">Booking Your Ride in <i>3 Simple Steps</i></h2>
            <p>Direct, transparent, and completely customized to your group schedule.</p>
          </div>

          <div className="steps-cards-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Select Dates &amp; Circuit</h3>
                <p>Choose your favorite Himachal circuit (Manali, Spiti, Kasol, Dharamshala, or custom) and travel dates.</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Receive Instant Quote</h3>
                <p>Click "Inquire on WhatsApp" to send your pre-formatted request directly to owner {AGENCY_CONFIG.ownerName}.</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Confirmed Mountain Pickup</h3>
                <p>Lock your 17-seater Tempo Traveller with driver details, pickup time, and hassle-free tour itinerary.</p>
              </div>
            </div>
          </div>

          {/* Quick Help Strip */}
          <div className="booking-direct-strip">
            <div className="direct-strip-info">
              <h3>Need Custom Pick-up from Delhi, Chandigarh, or Kalka?</h3>
              <p>We provide doorstep pickup across North India for all 18 Himachal Pradesh circuits.</p>
            </div>
            <div className="direct-strip-actions">
              <a 
                href={`tel:${AGENCY_CONFIG.ownerPhone}`} 
                className="btn-call-direct"
              >
                <i className="fa-solid fa-phone"></i>
                <span>Call {AGENCY_CONFIG.displayPhone}</span>
              </a>
              <a 
                href={`https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=Hello%20${AGENCY_CONFIG.name}!%20I%20want%20to%20customize%20my%20Himachal%20tour.`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-whatsapp-direct"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>Chat On WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
