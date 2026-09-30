import { AGENCY_CONFIG } from '../config/agencyConfig';

export const DEFAULT_EMAIL_SUBJECT = "Inquiry for Himachal Tour — 17-Seater Force Tempo Traveller";

export const DEFAULT_EMAIL_BODY = 
`Hello Atish Mahajan (Mahajanrides),

I would like to inquire about booking your 17-Seater Force Tempo Traveller for a Himachal Pradesh tour.

My Travel Details:
• Destination / Circuit: 
• Tentative Travel Date: 
• Number of Days: 
• Group Size: 
• Pickup City (Chandigarh / Delhi / Kalka / Manali): 

Please share vehicle availability, recommended itinerary, and your best all-inclusive price quote.

Thank you!`;

/**
 * Returns the direct Gmail web composer URL (opens Gmail compose in a browser)
 */
export function getGmailComposeUrl(subject = DEFAULT_EMAIL_SUBJECT, body = DEFAULT_EMAIL_BODY) {
  const email = AGENCY_CONFIG.email || "mahajanatish29@gmail.com";
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Returns standard mailto URL for native email clients (Apple Mail, Outlook, mobile default)
 */
export function getMailtoUrl(subject = DEFAULT_EMAIL_SUBJECT, body = DEFAULT_EMAIL_BODY) {
  const email = AGENCY_CONFIG.email || "mahajanatish29@gmail.com";
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Opens email composer directly for the client:
 * On desktop: opens Gmail web compose in a new tab.
 * On mobile devices: triggers native email / Gmail composer.
 */
export function openEmailInquiry(customSubject, customBody) {
  const subject = customSubject || DEFAULT_EMAIL_SUBJECT;
  const body = customBody || DEFAULT_EMAIL_BODY;
  const gmailUrl = getGmailComposeUrl(subject, body);
  const mailtoUrl = getMailtoUrl(subject, body);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = mailtoUrl;
  } else {
    // Open Gmail composer in a new tab
    const win = window.open(gmailUrl, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = mailtoUrl;
    }
  }
}
