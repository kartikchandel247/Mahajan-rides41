import { AGENCY_CONFIG } from '../../config/agencyConfig';
import './FloatingWhatsApp.scss';

export default function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=Hello%20${AGENCY_CONFIG.name}!%20I%20would%20like%20to%20inquire%20about%20a%20tour%20package.`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noreferrer" 
      className="floating-whatsapp"
      title="Chat with Owner on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp"></i>
    </a>
  );
}
