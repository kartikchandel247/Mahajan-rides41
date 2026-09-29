import { AGENCY_CONFIG } from '../config/agencyConfig';

/**
 * Builds encoded WhatsApp redirect link with tour inquiry parameters
 */
export function buildWhatsAppInquiryUrl({
  destination,
  date,
  days,
  travelers,
  vehicle,
  notes,
  tourName
}) {
  const targetDestination = tourName || destination || "Custom Tour Plan";
  const formattedDate = date 
    ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : "Flexible / To Discuss";
  const durationText = days ? `${days} Days` : "Custom Duration";
  const travelerText = travelers || "2 Adults";

  let message = `👋 *Hello ${AGENCY_CONFIG.name}!*%0A%0A`;
  message += `I would like to inquire about a tour package with the following details:%0A%0A`;
  message += `📍 *Destination:* ${encodeURIComponent(targetDestination)}%0A`;
  message += `📅 *Date of Tour:* ${encodeURIComponent(formattedDate)}%0A`;
  message += `⏳ *Duration:* ${encodeURIComponent(durationText)}%0A`;
  message += `👥 *Travelers:* ${encodeURIComponent(travelerText)}%0A`;

  if (vehicle) {
    message += `🚐 *Force Tempo Traveller:* ${encodeURIComponent(vehicle)}%0A`;
  }
  if (notes) {
    message += `📝 *Notes / Special Requests:* ${encodeURIComponent(notes)}%0A`;
  }

  message += `%0A💬 *Please share the best price quotation and detailed itinerary.* Thank you!`;

  return `https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=${message}`;
}

export function openWhatsAppInquiry(details) {
  const url = buildWhatsAppInquiryUrl(details);
  window.open(url, '_blank', 'noopener,noreferrer');
}
