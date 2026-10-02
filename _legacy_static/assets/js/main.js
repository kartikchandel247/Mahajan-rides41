/**
 * MAHAJAN RIDE & TOURS — MAIN JAVASCRIPT ENGINE
 * Handles WhatsApp Inquiry Generation, Passenger Reviews, Navigation & Animations
 */

// 1. Central Configuration
const AGENCY_CONFIG = {
  name: "Mahajan Ride",
  tagline: "Discover The World With Our Guide",
  ownerPhone: "919876543210", // Primary WhatsApp Number (international format without +)
  displayPhone: "+91 98765 43210",
  email: "info@mahajanride.com",
  instagramUser: "mahajan_rides",
  instagramUrl: "https://www.instagram.com/mahajan_rides/",
  address: "Mall Road, Shimla & Connaught Place, New Delhi, India"
};

// 2. WhatsApp Message Generator & Dispatcher
function sendWhatsAppInquiry({ destination, date, days, travelers, vehicle, notes, tourName }) {
  const targetDestination = tourName || destination || "Custom Tour";
  const formattedDate = date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Flexible / To Discuss";
  const durationText = days ? `${days} Days` : "Custom Duration";
  const travelerText = travelers || "2 Travelers";

  let message = `👋 *Hello ${AGENCY_CONFIG.name}!*%0A%0A`;
  message += `I would like to inquire about a tour package with the following details:%0A%0A`;
  message += `📍 *Destination:* ${encodeURIComponent(targetDestination)}%0A`;
  message += `📅 *Date of Tour:* ${encodeURIComponent(formattedDate)}%0A`;
  message += `⏳ *Duration:* ${encodeURIComponent(durationText)}%0A`;
  message += `👥 *Number of Travelers:* ${encodeURIComponent(travelerText)}%0A`;
  
  if (vehicle) {
    message += `🚗 *Cab / Vehicle Preference:* ${encodeURIComponent(vehicle)}%0A`;
  }
  if (notes) {
    message += `📝 *Special Request / Notes:* ${encodeURIComponent(notes)}%0A`;
  }
  
  message += `%0A💬 *Please share the best available price quotation and detailed itinerary.* Thank you!`;

  const waUrl = `https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=${message}`;
  window.open(waUrl, '_blank');
}

// 3. Passenger Feedback & Review Storage Engine
const FEEDBACK_STORAGE_KEY = "mahajan_passenger_reviews";

// Seed Reviews for initial rich display
const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Aman Sharma",
    avatar: "AS",
    destination: "Himachal Circuit (Shimla & Manali)",
    rating: 5,
    date: "18 Sep 2026",
    comment: "Our 6-day family trip to Manali and Rohtang Pass with Mahajan Ride was flawless! The Innova Crysta was spotless, and our driver-cum-guide knew all the best mountain scenic spots."
  },
  {
    id: 2,
    name: "Rohit & Priya Verma",
    avatar: "RV",
    destination: "Kashmir Paradise (Srinagar & Gulmarg)",
    rating: 5,
    date: "04 Sep 2026",
    comment: "Incredible hospitality! Everything was coordinated directly via WhatsApp with the owner. The houseboat stay in Dal Lake and the gondola ride at Gulmarg were dreamlike."
  },
  {
    id: 3,
    name: "Dr. Vikram Sethi",
    avatar: "VS",
    destination: "Ladakh Adventure Expedition",
    rating: 5,
    date: "22 Aug 2026",
    comment: "High altitude travel demands absolute trust. Mahajan Ride provided seasoned drivers who navigated Khardung La safely. Highly recommend for custom mountain road trips!"
  }
];

function getStoredReviews() {
  const data = localStorage.getItem(FEEDBACK_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_REVIEWS;
  }
}

function saveReview(review) {
  const reviews = getStoredReviews();
  reviews.unshift(review);
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(reviews));
  return reviews;
}

function renderFeedbackStream() {
  const container = document.getElementById("passengerFeedbackStream");
  if (!container) return;

  const reviews = getStoredReviews();
  container.innerHTML = "";

  reviews.forEach(item => {
    const card = document.createElement("div");
    card.className = "feedback-bubble";

    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<i class="fa-${i <= item.rating ? 'solid' : 'regular'} fa-star"></i>`;
    }

    card.innerHTML = `
      <div>
        <div class="feedback-bubble-header">
          <div class="feedback-user-info">
            <div class="feedback-avatar">${item.avatar || item.name.charAt(0)}</div>
            <div>
              <h5 style="margin-bottom: 2px; color: var(--clr-heading); font-size: 1.1rem;">${escapeHtml(item.name)}</h5>
              <small style="color: var(--clr-muted); font-size: 0.8rem;">${escapeHtml(item.date)}</small>
            </div>
          </div>
          <div class="feedback-stars">${starsHtml}</div>
        </div>
        <p class="feedback-bubble-text">"${escapeHtml(item.comment)}"</p>
      </div>
      <div class="feedback-bubble-tag">
        <i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i> ${escapeHtml(item.destination)}
      </div>
    `;
    container.appendChild(card);
  });
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.innerText = string;
  return div.innerHTML;
}

// 4. Initialize DOM Events
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const navbarNav = document.getElementById("navbarNav");
  if (mobileToggle && navbarNav) {
    mobileToggle.addEventListener("click", () => {
      navbarNav.classList.toggle("active");
      const icon = mobileToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
      }
    });
  }

  // Set default min date to today for date pickers
  const todayStr = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = todayStr;
    if (!input.value) {
      // Default to 3 days from now
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 3);
      input.value = nextDate.toISOString().split('T')[0];
    }
  });

  // Home Quick Booking Bar Form
  const homeBookingForm = document.getElementById("homeBookingForm");
  if (homeBookingForm) {
    homeBookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const destination = document.getElementById("bookingDestination")?.value || "";
      const date = document.getElementById("bookingDate")?.value || "";
      const days = document.getElementById("bookingDays")?.value || "";
      const travelers = document.getElementById("bookingTravelers")?.value || "";

      sendWhatsAppInquiry({ destination, date, days, travelers });
    });
  }

  // Contact Page Form
  const contactInquiryForm = document.getElementById("contactInquiryForm");
  if (contactInquiryForm) {
    contactInquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contactName")?.value || "";
      const destination = document.getElementById("contactDestination")?.value || "";
      const date = document.getElementById("contactDate")?.value || "";
      const days = document.getElementById("contactDays")?.value || "";
      const travelers = document.getElementById("contactTravelers")?.value || "";
      const vehicle = document.getElementById("contactVehicle")?.value || "";
      const notes = document.getElementById("contactMessage")?.value || "";

      sendWhatsAppInquiry({ destination, date, days, travelers, vehicle, notes });
    });
  }

  // Direct Tour Card WhatsApp Buttons
  document.querySelectorAll("[data-tour-inquire]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const tourName = btn.getAttribute("data-tour-inquire") || "Tour Package";
      const days = btn.getAttribute("data-tour-days") || "5";
      sendWhatsAppInquiry({ tourName, days });
    });
  });

  // FAQ Accordion Functionality
  document.querySelectorAll(".faq-header").forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const wasActive = item.classList.contains("active");
      
      // Close siblings if in same accordion
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll(".faq-item").forEach(si => si.classList.remove("active"));
      }

      if (!wasActive) {
        item.classList.add("active");
      }
    });
  });

  // Interactive Star Rating on Blog / Feedback page
  let selectedRating = 5;
  const starsContainer = document.getElementById("feedbackStars");
  if (starsContainer) {
    const stars = starsContainer.querySelectorAll(".star");
    
    stars.forEach(star => {
      star.addEventListener("mouseenter", () => {
        const val = parseInt(star.getAttribute("data-value"));
        stars.forEach(s => {
          s.classList.toggle("hovered", parseInt(s.getAttribute("data-value")) <= val);
        });
      });

      star.addEventListener("mouseleave", () => {
        stars.forEach(s => s.classList.remove("hovered"));
      });

      star.addEventListener("click", () => {
        selectedRating = parseInt(star.getAttribute("data-value"));
        stars.forEach(s => {
          s.classList.toggle("selected", parseInt(s.getAttribute("data-value")) <= selectedRating);
        });
      });
    });
  }

  // Passenger Feedback Form Submission
  const feedbackForm = document.getElementById("passengerFeedbackForm");
  if (feedbackForm) {
    renderFeedbackStream();

    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("feedbackName")?.value.trim() || "Happy Traveler";
      const destination = document.getElementById("feedbackDestination")?.value.trim() || "Scenic Tour";
      const comment = document.getElementById("feedbackComment")?.value.trim();

      if (!comment) return;

      const newReview = {
        id: Date.now(),
        name,
        avatar: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "TR",
        destination,
        rating: selectedRating,
        date: "Just now",
        comment
      };

      saveReview(newReview);
      renderFeedbackStream();
      feedbackForm.reset();

      // Show alert or confirmation
      const alertBox = document.getElementById("feedbackSuccessAlert");
      if (alertBox) {
        alertBox.style.display = "block";
        setTimeout(() => { alertBox.style.display = "none"; }, 5000);
      }
    });
  }

  // Category Filtering on Tours and Destinations pages
  const filterBtns = document.querySelectorAll(".filter-btn");
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const category = btn.getAttribute("data-filter");

        document.querySelectorAll(".filterable-item").forEach(item => {
          const itemCat = item.getAttribute("data-category");
          if (category === "all" || itemCat === category) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }
});
