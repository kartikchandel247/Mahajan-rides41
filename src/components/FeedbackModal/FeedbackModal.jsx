import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveCustomerReview } from '../../lib/supabase';
import { AGENCY_CONFIG } from '../../config/agencyConfig';
import './FeedbackModal.scss';

const TOUR_OPTIONS = [
  'Manali, Solang Valley & Atal Tunnel',
  'Kullu, Kasol & Manikaran Sahib',
  'Shimla, Kufri & Narkanda Hills',
  'Dharamshala, McLeod Ganj & Dalhousie',
  'Spiti Valley & Lahaul Circuit',
  'Bir Billing & Palampur Tea Gardens',
  'Chamba & Khajjiar Sightseeing',
  'Chandigarh to Himachal Tempo Traveller',
  'Custom Himachal Family Package'
];

const RATING_EMOTIONS = {
  5: { emoji: '🤩', label: 'Outstanding & Memorable!', sub: '5/5 — Best Mountain Trip' },
  4: { emoji: '😊', label: 'Really Great Experience!', sub: '4/5 — Smooth & Comfortable' },
  3: { emoji: '🙂', label: 'Good Mountain Ride', sub: '3/5 — Satisfactory' },
  2: { emoji: '😐', label: 'Average Experience', sub: '2/5 — Room for Improvement' },
  1: { emoji: '🙁', label: 'Needs Improvement', sub: '1/5 — Not as expected' }
};

const QUICK_TAGS = [
  '✨ Punctual Chauffeur',
  '🏔️ Smooth Mountain Drive',
  '🚐 Clean 17-Seater Traveller',
  '🛡️ Safe Hairpin Bends',
  '📸 Great Photo Stops',
  '🎵 Scenic Vibe & Music',
  '👨‍👩‍👧 Family Friendly'
];

/**
 * Resizes and compresses image client-side to ensure lightweight storage
 */
function compressImage(file, maxDimension = 900, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function FeedbackModal({ isOpen, onClose, onFeedbackAdded, defaultRoute }) {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    route: defaultRoute || TOUR_OPTIONS[0],
    rating: 5,
    comment: ''
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedReview, setSubmittedReview] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset form states after animation exits
      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        setSelectedTags([]);
        setPhoto(null);
        setPhotoName('');
        setPhotoLoading(false);
      }, 300);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
      if (!formData.comment.includes(tag.replace(/^[^\s]+\s/, ''))) {
        const cleanTag = tag.replace(/^[^\s]+\s/, '');
        setFormData(prev => ({
          ...prev,
          comment: prev.comment 
            ? `${prev.comment} • ${cleanTag}` 
            : `Enjoyed: ${cleanTag}`
        }));
      }
    }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, or WebP).');
      return;
    }

    try {
      setPhotoLoading(true);
      const compressedDataUrl = await compressImage(file, 900, 0.8);
      setPhoto(compressedDataUrl);
      setPhotoName(file.name);
    } catch (err) {
      console.error('Image compression error:', err);
      alert('Could not process this image. Please try a different photo.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) return;

    setIsSubmitting(true);

    const newFeedback = {
      id: Date.now(),
      name: formData.name.trim(),
      city: formData.city.trim() || 'Valued Passenger',
      route: formData.route,
      rating: Number(formData.rating),
      date: 'Just now',
      comment: formData.comment.trim(),
      photo: photo,
      tags: selectedTags
    };

    try {
      // Save permanently to Supabase reviews table (including photo)
      await saveCustomerReview({
        name: newFeedback.name,
        city: newFeedback.city,
        tour: newFeedback.route,
        rating: newFeedback.rating,
        comment: newFeedback.comment,
        photo: newFeedback.photo
      });
    } catch (err) {
      console.warn('Supabase review save error:', err);
    }

    if (onFeedbackAdded) {
      onFeedbackAdded(newFeedback);
    }

    setSubmittedReview(newFeedback);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleWhatsAppShare = () => {
    if (!submittedReview) return;
    const ratingStars = '⭐'.repeat(submittedReview.rating);
    const photoNote = submittedReview.photo ? '\n📸 [Trip Photo Uploaded on Website]' : '';
    const msg = `*New Traveler Review for Mahajan Ride*\n\n` +
      `*Name:* ${submittedReview.name}\n` +
      `*Origin:* ${submittedReview.city}\n` +
      `*Route:* ${submittedReview.route}\n` +
      `*Rating:* ${ratingStars} (${submittedReview.rating}/5)${photoNote}\n\n` +
      `*Feedback:*\n"${submittedReview.comment}"\n\n` +
      `_Sent from Mahajan Ride official website_`;

    window.open(`https://wa.me/${AGENCY_CONFIG.ownerPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const activeEmotion = RATING_EMOTIONS[hoverRating || formData.rating] || RATING_EMOTIONS[5];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="feedback-modal-backdrop" 
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
        >
          <motion.div 
            className="feedback-modal-card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close Button */}
            <button 
              type="button" 
              className="feedback-modal-close-btn"
              onClick={onClose}
              aria-label="Close feedback modal"
              title="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {isSuccess ? (
              /* Success Celebration State */
              <div className="feedback-success-container">
                <div className="success-pulse-ring">
                  <div className="success-icon-wrap">
                    <i className="fa-solid fa-check"></i>
                  </div>
                </div>

                <span className="success-badge">Review Published</span>
                <h3 className="success-title">Thank You, {submittedReview?.name}! 🎉</h3>
                <p className="success-desc">
                  Your travel feedback {submittedReview?.photo ? 'and trip photo have' : 'has'} been published to our community traveler stories!
                </p>

                {/* Render Review Card with Uploaded Photo if present */}
                <div className={`success-rating-card ${submittedReview?.photo ? 'has-uploaded-photo' : ''}`}>
                  {submittedReview?.photo && (
                    <div className="success-photo-wrap">
                      <img src={submittedReview.photo} alt="Uploaded trip memory" className="success-photo-img" />
                      <div className="success-photo-overlay">
                        <div className="overlay-stars">
                          {[...Array(submittedReview?.rating || 5)].map((_, i) => (
                            <i key={i} className="fa-solid fa-star"></i>
                          ))}
                        </div>
                        <span className="overlay-badge">
                          <i className="fa-solid fa-camera"></i> Trip Memory
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="success-card-body">
                    {!submittedReview?.photo && (
                      <div className="success-stars">
                        {[...Array(submittedReview?.rating || 5)].map((_, i) => (
                          <i key={i} className="fa-solid fa-star"></i>
                        ))}
                      </div>
                    )}
                    <span className="success-route">
                      <i className="fa-solid fa-route"></i> {submittedReview?.route}
                    </span>
                    <p className="success-quote">"{submittedReview?.comment}"</p>
                    <div className="success-author-meta">
                      <strong>{submittedReview?.name}</strong> • <span>{submittedReview?.city}</span>
                    </div>
                  </div>
                </div>

                <div className="success-actions">
                  <button 
                    type="button" 
                    className="btn-whatsapp-share"
                    onClick={handleWhatsAppShare}
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>Share on WhatsApp with Owner</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-modal-done"
                    onClick={onClose}
                  >
                    Done &amp; Return to Page
                  </button>
                </div>
              </div>
            ) : (
              /* Feedback Submission Form */
              <div className="feedback-form-container">
                {/* Header */}
                <div className="feedback-header">
                  <div className="feedback-tag-pill">
                    <i className="fa-solid fa-mountain-sun"></i>
                    <span>Mahajan Ride • Traveler Voice</span>
                  </div>
                  <h2 id="feedback-modal-title" className="feedback-title">
                    Share Your Mountain <span>Experience</span>
                  </h2>
                  <p className="feedback-subtitle">
                    Traveled in our 17-seater Force Tempo Traveller? Share your feedback and trip photos to inspire future mountain travelers!
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="feedback-modal-form">
                  {/* Rating Selector with Smile Emotion Indicator */}
                  <div className="rating-selector-card">
                    <div className="rating-label-row">
                      <span className="rating-prompt">
                        <i className="fa-solid fa-star"></i> How was your overall journey? *
                      </span>
                      <div className="rating-emotion-pill">
                        <span className="emotion-emoji">{activeEmotion.emoji}</span>
                        <span className="emotion-text">{activeEmotion.label}</span>
                      </div>
                    </div>

                    <div className="stars-interactive-row">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isLit = (hoverRating || formData.rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            className={`star-tap-btn ${isLit ? 'lit' : ''}`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setFormData({ ...formData, rating: star })}
                            aria-label={`Rate ${star} star`}
                          >
                            <i className="fa-solid fa-star"></i>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick-Pick Tags for Instant Smiling Review */}
                  <div className="quick-tags-section">
                    <span className="tags-label">
                      <i className="fa-solid fa-wand-magic-sparkles"></i> Quick Highlights (Tap to add):
                    </span>
                    <div className="tags-pill-wrap">
                      {QUICK_TAGS.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            className={`tag-chip-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleTagToggle(tag)}
                          >
                            <span>{tag}</span>
                            {isSelected && <i className="fa-solid fa-check"></i>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Trip Photo Upload Section */}
                  <div className="photo-upload-section">
                    <div className="photo-header-row">
                      <span className="photo-field-label">
                        <i className="fa-solid fa-camera"></i> Add Trip Photo <small>(Optional)</small>
                      </span>
                      {photo && (
                        <button 
                          type="button" 
                          className="photo-clear-btn"
                          onClick={handleRemovePhoto}
                        >
                          <i className="fa-solid fa-trash-can"></i> Remove Photo
                        </button>
                      )}
                    </div>

                    {photo ? (
                      <div className="photo-preview-box">
                        <div className="preview-image-wrap">
                          <img src={photo} alt="Trip Memory Preview" className="preview-thumb" />
                          <span className="photo-attached-tag">
                            <i className="fa-solid fa-circle-check"></i> Photo Attached
                          </span>
                        </div>
                        <div className="preview-info-wrap">
                          <strong>{photoName || 'My Himachal Trip Photo'}</strong>
                          <p>Your photo will be showcased directly on your verified review card with your rating!</p>
                          <label className="btn-change-photo" htmlFor="modal-photo-file-input">
                            <i className="fa-solid fa-arrows-rotate"></i> Change Photo
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className={`photo-upload-dropzone ${photoLoading ? 'loading' : ''}`} htmlFor="modal-photo-file-input">
                        <input
                          id="modal-photo-file-input"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          style={{ display: 'none' }}
                        />
                        <div className="dropzone-inner">
                          <div className="dropzone-icon-circle">
                            {photoLoading ? (
                              <i className="fa-solid fa-circle-notch fa-spin"></i>
                            ) : (
                              <i className="fa-solid fa-cloud-arrow-up"></i>
                            )}
                          </div>
                          <div className="dropzone-text">
                            <strong>{photoLoading ? 'Optimizing Trip Photo...' : 'Click to Upload Your Trip Photo'}</strong>
                            <span>Selfies, group memories, mountain passes, or Tempo Traveller views</span>
                          </div>
                          <span className="dropzone-badge">JPG, PNG, WEBP</span>
                        </div>
                      </label>
                    )}
                  </div>

                  {/* Input Fields Grid */}
                  <div className="form-fields-grid">
                    {/* Full Name */}
                    <div className="input-group">
                      <label htmlFor="fb-name">
                        <i className="fa-regular fa-user"></i> Your Full Name *
                      </label>
                      <input
                        id="fb-name"
                        type="text"
                        placeholder="e.g. Rohit &amp; Ananya Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        autoComplete="name"
                      />
                    </div>

                    {/* City / State */}
                    <div className="input-group">
                      <label htmlFor="fb-city">
                        <i className="fa-solid fa-location-dot"></i> City / Origin
                      </label>
                      <input
                        id="fb-city"
                        type="text"
                        placeholder="e.g. Delhi NCR / Chandigarh / Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        autoComplete="address-level2"
                      />
                    </div>

                    {/* Tour Route Dropdown */}
                    <div className="input-group full-width">
                      <label htmlFor="fb-route">
                        <i className="fa-solid fa-route"></i> Tour / Route Explored
                      </label>
                      <div className="select-wrapper">
                        <select
                          id="fb-route"
                          value={formData.route}
                          onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                        >
                          {TOUR_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <i className="fa-solid fa-chevron-down select-arrow"></i>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="input-group full-width">
                      <div className="review-label-flex">
                        <label htmlFor="fb-comment">
                          <i className="fa-regular fa-comment-dots"></i> Your Trip Experience / Review *
                        </label>
                        <span className="required-hint">Required</span>
                      </div>
                      <textarea
                        id="fb-comment"
                        rows="4"
                        placeholder="Tell future travelers about chauffeur driving skills, 17-seater pushback seat comfort, cleanliness, punctuality, and scenic Himalayan memories..."
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>

                  {/* Modal Footer / Submit Action */}
                  <div className="feedback-modal-footer">
                    <div className="trust-security-note">
                      <i className="fa-solid fa-shield-halved"></i>
                      <span>100% Genuine Review • Directly saved to Mahajan Ride</span>
                    </div>

                    <button
                      type="submit"
                      className="submit-feedback-btn"
                      disabled={isSubmitting || photoLoading}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-circle-notch fa-spin"></i>
                          <span>Publishing Review...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit My Review</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
