import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { fetchGalleryItems } from '../../lib/supabase';
import GalleryModal from './GalleryModal';
import './GallerySection.scss';

export default function GallerySection({ onNavigateFullGallery }) {
  const [items, setItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load gallery assets from Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadMedia() {
      try {
        setIsLoading(true);
        const res = await fetchGalleryItems();
        if (isMounted && res.success && Array.isArray(res.data)) {
          setItems(res.data);
        }
      } catch (err) {
        console.warn('[GallerySection] Could not load media:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadMedia();
    return () => { isMounted = false; };
  }, []);

  // Compute categories dynamically based only on uploaded media items
  const categories = useMemo(() => {
    const cats = new Set(items.map(it => it.circuit_category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [items]);

  const filteredItems = activeFilter === 'All'
    ? items
    : items.filter(it => it.circuit_category?.toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter.toLowerCase().includes(it.circuit_category?.toLowerCase() || ''));

  // Limit home preview to top 8 items for optimal performance and neat layout
  const previewItems = filteredItems.slice(0, 8);

  const openLightbox = (item, index) => {
    setSelectedItem(item);
    setSelectedIndex(index);
  };

  const handleNext = () => {
    if (previewItems.length <= 1) return;
    const nextIdx = (selectedIndex + 1) % previewItems.length;
    setSelectedIndex(nextIdx);
    setSelectedItem(previewItems[nextIdx]);
  };

  const handlePrev = () => {
    if (previewItems.length <= 1) return;
    const prevIdx = (selectedIndex - 1 + previewItems.length) % previewItems.length;
    setSelectedIndex(prevIdx);
    setSelectedItem(previewItems[prevIdx]);
  };

  return (
    <section className="gallery-section section-padding" id="gallery">
      <div className="container">
        {/* Section Heading Row */}
        <div className="gallery-header-row">
          <div>
            <span className="section-subtitle">Visual Journey &amp; Fleet Proof</span>
            <h2 className="section-title">Himachal Moments &amp; <i>Expedition Gallery</i></h2>
            <p className="gallery-header-desc">
              Authentic high-resolution photographs &amp; video reels captured across high mountain passes, valleys, and villages from our 17-seater Force Tempo Traveller tours.
            </p>
          </div>

          {onNavigateFullGallery && (
            <button 
              type="button" 
              className="butn-arrow"
              onClick={onNavigateFullGallery}
            >
              <span className="btn-text">Explore Full Gallery</span>
              <span className="arrow-wrap">
                <span className="arrow-inner">
                  <i className="fa-solid fa-arrow-right"></i>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </span>
            </button>
          )}
        </div>

        {/* Circuit Filter Bar (only if more than 1 specific category exists) */}
        {categories.length > 2 && (
          <div className="gallery-filter-bar">
            <div className="filter-pills-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat === 'All' && <i className="fa-solid fa-layer-group"></i>}
                  {cat === 'Tempo Fleet' && <i className="fa-solid fa-van-shuttle"></i>}
                  {cat !== 'All' && cat !== 'Tempo Fleet' && <i className="fa-solid fa-location-dot"></i>}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Media Grid */}
        {isLoading ? (
          <div className="gallery-loading-state">
            <div className="spinner-glow"></div>
            <p>Loading high-altitude media reels...</p>
          </div>
        ) : previewItems.length === 0 ? (
          <div className="gallery-empty-state">
            <i className="fa-regular fa-images"></i>
            <p>No media found for the selected circuit filter.</p>
            <button type="button" onClick={() => setActiveFilter('All')}>View All Media</button>
          </div>
        ) : (
          <div className={`gallery-masonry-grid ${previewItems.length <= 2 ? 'is-duo-grid' : ''}`}>
            {previewItems.map((item, idx) => {
              const isVideo = item.media_type === 'video';
              // Staggered layout variant for visual rhythm
              const isLarge = idx === 0 || idx === 7;

              return (
                <motion.div
                  key={item.id || idx}
                  className={`gallery-card ${isLarge ? 'card-featured' : ''} ${isVideo ? 'is-video-card' : ''}`}
                  onClick={() => openLightbox(item, idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openLightbox(item, idx)}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: (idx % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <div className="gallery-card-thumb">
                    {isVideo ? (
                      <div className="video-thumb-container">
                        {item.media_url?.endsWith('.mp4') || item.media_url?.endsWith('.webm') ? (
                          <video src={item.media_url} muted preload="metadata" className="card-thumb-video" />
                        ) : (
                          <img src="/places/spiti_valley.jpg" alt={item.title || "Video preview"} className="card-thumb-img" />
                        )}
                        <div className="video-play-indicator">
                          <i className="fa-solid fa-play"></i>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={item.media_url} 
                        alt={item.title || "Himachal tour scenic photo"} 
                        className="card-thumb-img"
                        loading="lazy" 
                      />
                    )}

                    {/* Badge */}
                    <div className="card-top-badges">
                      <span className="media-type-pill">
                        <i className={isVideo ? "fa-solid fa-play" : "fa-solid fa-camera"}></i>
                        {isVideo ? 'Video' : 'Photo'}
                      </span>
                      {item.circuit_category && (
                        <span className="circuit-name-pill">{item.circuit_category}</span>
                      )}
                    </div>

                    {/* Gradient Overlay & Title */}
                    <div className="card-hover-overlay">
                      <div className="overlay-bottom-content">
                        <h4>{item.title || "Himachal Tour View"}</h4>
                        <div className="view-media-action">
                          <span>{isVideo ? 'Play Video' : 'Enlarge Photo'}</span>
                          <i className="fa-solid fa-expand"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All In Full Gallery Strip */}
        {filteredItems.length > 8 && onNavigateFullGallery && (
          <div className="gallery-view-more-wrap">
            <button 
              type="button" 
              className="butn-arrow2"
              onClick={onNavigateFullGallery}
            >
              <span className="btn-text">View All {filteredItems.length} Photos &amp; Reels</span>
              <span className="arrow-wrap">
                <span className="arrow-inner">
                  <i className="fa-solid fa-arrow-right"></i>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <GalleryModal
        isOpen={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onNext={handleNext}
        onPrev={handlePrev}
        currentIndex={selectedIndex}
        totalCount={previewItems.length}
      />
    </section>
  );
}
