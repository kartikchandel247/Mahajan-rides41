import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import PageBanner from '../components/PageBanner/PageBanner';
import GalleryModal from '../components/Gallery/GalleryModal';
import { fetchGalleryItems } from '../lib/supabase';
import { openWhatsAppInquiry } from '../utils/whatsapp';
import './GalleryPage.scss';

export default function GalleryPage({ onNavigateHome, onNavigateBooking }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // 'all' | 'image' | 'video'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Load gallery media (only admin-uploaded items, or the 2 tempo images if none uploaded yet)
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await fetchGalleryItems();
        if (isMounted && res.success && Array.isArray(res.data)) {
          setItems(res.data);
        }
      } catch (err) {
        console.warn('[GalleryPage] Load error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Compute dynamic category pills based strictly on active media in the gallery
  const categories = useMemo(() => {
    const cats = new Set(items.map(it => it.circuit_category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [items]);

  // Counts for media types
  const photoCount = useMemo(() => items.filter(i => i.media_type !== 'video').length, [items]);
  const videoCount = useMemo(() => items.filter(i => i.media_type === 'video').length, [items]);

  // Filter items by category, type, and search
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Category filter
      const matchesCategory = activeCategory === 'All' || 
        (item.circuit_category && item.circuit_category.toLowerCase() === activeCategory.toLowerCase());

      // Media type filter
      const matchesType = mediaTypeFilter === 'all' || 
        (mediaTypeFilter === 'video' ? item.media_type === 'video' : item.media_type !== 'video');

      // Search query
      const matchesSearch = !searchQuery.trim() || 
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.circuit_category && item.circuit_category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesType && matchesSearch;
    });
  }, [items, activeCategory, mediaTypeFilter, searchQuery]);

  const openLightbox = (item, index) => {
    setSelectedItem(item);
    setSelectedIndex(index);
  };

  const handleNext = () => {
    if (filteredItems.length <= 1) return;
    const nextIdx = (selectedIndex + 1) % filteredItems.length;
    setSelectedIndex(nextIdx);
    setSelectedItem(filteredItems[nextIdx]);
  };

  const handlePrev = () => {
    if (filteredItems.length <= 1) return;
    const prevIdx = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedIndex(prevIdx);
    setSelectedItem(filteredItems[prevIdx]);
  };

  const handleBookTrip = () => {
    if (onNavigateBooking) {
      onNavigateBooking();
    } else {
      openWhatsAppInquiry({
        tourName: 'Custom Himachal Expedition',
        destination: activeCategory !== 'All' ? activeCategory : 'Himachal High Passes',
        vehicle: '17-Seater Force Tempo Traveller'
      });
    }
  };

  const isInitialFleetOnly = items.length <= 2 && items.every(i => i.circuit_category === 'Tempo Fleet' || i.id?.startsWith('tempo-'));

  return (
    <div className="gallery-page">
      {/* 1. Compact Scenic Header Banner */}
      <PageBanner
        title="Photo & Video Gallery"
        subtitle="Exclusive 17-Seater Force Fleet & Mountain Tour Memories"
        breadcrumb="Photo & Video Gallery"
        bgImage="/places/spiti_valley.jpg"
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Sleek, Compact Controls Toolbar */}
      <section className="gallery-toolbar-section">
        <div className="container">
          <div className="gallery-toolbar-card">
            <div className="toolbar-main-row">
              {/* Search Bar */}
              <div className="search-bar-wrap">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search uploaded photos & videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              {/* Media Type Toggles (All / Photos / Videos) */}
              <div className="media-type-pills">
                <button
                  type="button"
                  className={`pill-btn ${mediaTypeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setMediaTypeFilter('all')}
                >
                  <i className="fa-solid fa-layer-group"></i>
                  <span>All ({items.length})</span>
                </button>
                <button
                  type="button"
                  className={`pill-btn ${mediaTypeFilter === 'image' ? 'active' : ''}`}
                  onClick={() => setMediaTypeFilter('image')}
                >
                  <i className="fa-solid fa-camera"></i>
                  <span>Photos ({photoCount})</span>
                </button>
                <button
                  type="button"
                  className={`pill-btn ${mediaTypeFilter === 'video' ? 'active' : ''}`}
                  onClick={() => setMediaTypeFilter('video')}
                >
                  <i className="fa-solid fa-play"></i>
                  <span>Videos ({videoCount})</span>
                </button>
              </div>
            </div>

            {/* Dynamic Circuit Category Pills (Only shown when multiple categories exist) */}
            {categories.length > 2 && (
              <div className="category-chips-row">
                <span className="chips-label"><i className="fa-solid fa-filter"></i> Circuits:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat === 'All' && <i className="fa-solid fa-mountain"></i>}
                    {cat === 'Tempo Fleet' && <i className="fa-solid fa-van-shuttle"></i>}
                    {cat !== 'All' && cat !== 'Tempo Fleet' && <i className="fa-solid fa-location-dot"></i>}
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Toolbar Status Bar */}
            <div className="toolbar-status-bar">
              <div className="status-pill">
                <span className="live-dot"></span>
                {isInitialFleetOnly ? (
                  <span>Verified 17-Seater Force Fleet Showcase &bull; <strong>2 High-Res Photographs</strong> (Admin updates sync live)</span>
                ) : (
                  <span>Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> verified expedition memories</span>
                )}
              </div>
              {searchQuery && (
                <span className="search-active-tag">
                  Matching &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Media Gallery Grid */}
      <section className="gallery-content-section">
        <div className="container">
          {isLoading ? (
            <div className="gallery-status-card">
              <div className="spinner-glow"></div>
              <h3>Loading Gallery Assets...</h3>
              <p>Fetching admin verified media from database</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="gallery-status-card">
              <div className="empty-media-icon">
                <i className="fa-regular fa-image"></i>
              </div>
              <h3>No Media Found</h3>
              <p>No photos or video reels match your search or filter.</p>
              <button 
                type="button" 
                className="reset-filters-btn"
                onClick={() => {
                  setActiveCategory('All');
                  setMediaTypeFilter('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Media Gallery Grid */}
              <div className={`gallery-responsive-grid ${filteredItems.length <= 2 ? 'is-duo-layout' : ''}`}>
                {filteredItems.map((item, idx) => {
                  const isVideo = item.media_type === 'video';

                  return (
                    <motion.div
                      key={item.id || idx}
                      className={`gallery-media-item ${isVideo ? 'is-video-item' : 'is-photo-item'}`}
                      onClick={() => openLightbox(item, idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && openLightbox(item, idx)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    >
                      <div className="media-frame">
                        {isVideo ? (
                          <div className="video-thumb-wrap">
                            <video src={item.media_url} muted preload="metadata" className="media-visual" />
                            <div className="floating-play-pill">
                              <i className="fa-solid fa-play"></i>
                              <span>Watch Reel</span>
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={item.media_url} 
                            alt={item.title || "MahajanRide Tour"} 
                            className="media-visual"
                            loading="lazy"
                          />
                        )}

                        {/* Top Floating Badges */}
                        <div className="floating-badges">
                          <span className="media-tag">
                            <i className={isVideo ? "fa-solid fa-play" : "fa-solid fa-camera"}></i>
                            {isVideo ? 'Video' : 'Photo'}
                          </span>
                          {item.circuit_category && (
                            <span className="circuit-tag">
                              {item.circuit_category === 'Tempo Fleet' && <i className="fa-solid fa-van-shuttle" style={{ marginRight: '4px' }}></i>}
                              {item.circuit_category}
                            </span>
                          )}
                        </div>

                        {/* Clean Hover Scrim with Title & Expand Action */}
                        <div className="media-hover-scrim">
                          <div className="scrim-info">
                            <h4 className="scrim-title">{item.title || "Himachal Mountain Expedition"}</h4>
                            <div className="enlarge-action">
                              <i className={isVideo ? "fa-solid fa-circle-play" : "fa-solid fa-expand"}></i>
                              <span>{isVideo ? 'Play Video Reel' : 'Enlarge Full-Res'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. Bottom WhatsApp Booking Strip */}
      <section className="gallery-booking-cta-strip">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-left">
              <span className="banner-tag">Instant WhatsApp Quote</span>
              <h2>Ready to Travel in Our 17-Seater Luxury Fleet?</h2>
              <p>
                Experience Himachal's high mountain passes with pushback recliner seats, ample luggage space, ambient AC, and expert local mountain chauffeurs.
              </p>
            </div>
            <div className="cta-right">
              <button 
                type="button" 
                className="butn-whatsapp"
                onClick={handleBookTrip}
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>Get Instant Route Quote</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal View */}
      <GalleryModal
        isOpen={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onNext={handleNext}
        onPrev={handlePrev}
        currentIndex={selectedIndex}
        totalCount={filteredItems.length}
      />
    </div>
  );
}
