import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { openWhatsAppInquiry } from '../../utils/whatsapp';
import './GalleryModal.scss';

export default function GalleryModal({ 
  isOpen, 
  item, 
  onClose, 
  onNext, 
  onPrev, 
  currentIndex = 0, 
  totalCount = 0 
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    // Lock body scroll while modal is active
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !item) return null;

  const isVideo = item.media_type === 'video' || 
    (item.media_url && (item.media_url.endsWith('.mp4') || item.media_url.endsWith('.webm') || item.media_url.includes('youtube') || item.media_url.includes('youtu.be') || item.media_url.includes('vimeo')));

  const isEmbedVideo = item.media_url && (item.media_url.includes('youtube.com') || item.media_url.includes('youtu.be') || item.media_url.includes('vimeo.com'));

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtube.com/watch')) {
      const id = new URLSearchParams(url.split('?')[1]).get('v');
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  const handleInquire = () => {
    openWhatsAppInquiry({
      tourName: `Gallery Inquiry: ${item.title || item.circuit_category || 'Himachal Tour'}`,
      destination: item.circuit_category || 'Himachal Circuit',
      vehicle: '17-Seater Force Tempo Traveller'
    });
  };

  return (
    <AnimatePresence>
      <div className="gallery-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        {/* Navigation Arrows */}
        {totalCount > 1 && onPrev && (
          <button 
            type="button" 
            className="gallery-nav-arrow prev-arrow" 
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous Media"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        {totalCount > 1 && onNext && (
          <button 
            type="button" 
            className="gallery-nav-arrow next-arrow" 
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next Media"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        )}

        <motion.div 
          className="gallery-modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Close button */}
          <button 
            type="button" 
            className="gallery-modal-close" 
            onClick={onClose}
            aria-label="Close Lightbox"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* Media Viewport */}
          <div className="gallery-media-frame">
            {isVideo ? (
              isEmbedVideo ? (
                <iframe 
                  src={getEmbedUrl(item.media_url)} 
                  title={item.title || "Gallery Video"}
                  className="gallery-video-player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video 
                  src={item.media_url} 
                  controls 
                  autoPlay 
                  playsInline
                  className="gallery-video-player"
                />
              )
            ) : (
              <img 
                src={item.media_url} 
                alt={item.title || "Himachal Landscape"} 
                className="gallery-image-full"
              />
            )}
          </div>

          {/* Media Caption & Quick WhatsApp Booking Action */}
          <div className="gallery-media-details">
            <div className="details-text-group">
              <div className="circuit-tag-badge">
                <i className={isVideo ? "fa-solid fa-video" : "fa-solid fa-camera"}></i>
                <span>{item.circuit_category || "Himachal Pradesh"}</span>
              </div>
              <h3 className="media-item-title">{item.title || "Scenic Mountain Tour Memory"}</h3>
              {totalCount > 1 && (
                <span className="media-counter">
                  Item {currentIndex + 1} of {totalCount}
                </span>
              )}
            </div>

            <div className="details-action-group">
              <button 
                type="button" 
                className="modal-wa-book-btn"
                onClick={handleInquire}
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>Plan This Route</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
