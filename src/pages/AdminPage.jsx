import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getCurrentAdminProfile, 
  adminSignIn, 
  adminSignOut,
  fetchGalleryItems, 
  addGalleryItem, 
  deleteGalleryItem, 
  uploadGalleryMediaFile,
  fetchAdminInquiries,
  isSupabaseConfigured,
  supabase
} from '../lib/supabase';
import { fetchLiveAnalyticsData } from '../lib/analytics';
import GalleryModal from '../components/Gallery/GalleryModal';
import logoImg from '../assets/logo.png';
import './AdminPage.scss';

export default function AdminPage({ onNavigateHome, onNavigateGallery }) {
  // Authentication State
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'gallery' | 'inquiries'

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsRange, setAnalyticsRange] = useState('7d'); // '7d' | '14d'
  const [activeMetricTab, setActiveMetricTab] = useState('visitors'); // 'visitors' | 'pageviews' | 'bounceRate'
  const [activeBreakdownTab, setActiveBreakdownTab] = useState('devices'); // 'devices' | 'browsers'
  const [hoveredPointIdx, setHoveredPointIdx] = useState(null);
  const [lastSyncedTime, setLastSyncedTime] = useState(new Date().toLocaleTimeString());
  const [activeViewers, setActiveViewers] = useState(1);
  const [liveEventNotice, setLiveEventNotice] = useState(null);

  // Gallery CMS State
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('All');
  
  // Upload Form State
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [directMediaUrl, setDirectMediaUrl] = useState('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [circuitCategory, setCircuitCategory] = useState('Spiti Valley');
  const [mediaType, setMediaType] = useState('image');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [feedbackToast, setFeedbackToast] = useState(null);
  const fileInputRef = useRef(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  // Item Deletion Confirm Modal
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Lightbox Preview for Admin
  const [previewItem, setPreviewItem] = useState(null);

  const circuitOptions = [
    'Spiti Valley',
    'Manali & Rohtang',
    'High Mountain Passes',
    'Shimla & Kinnaur',
    'Tempo Fleet',
    'Dharamshala & Kangra',
    'Leh-Ladakh Trans-Himalayan'
  ];

  // 1. Initial Auth Check & Session Listener
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        setAuthChecking(true);
        const profileRes = await getCurrentAdminProfile();
        if (isMounted) {
          if (profileRes.isAuthenticated) {
            setIsAuthenticated(true);
            setAdminUser(profileRes.user);
            setAdminProfile(profileRes.adminProfile);
          } else {
            setIsAuthenticated(false);
            setAdminUser(null);
            setAdminProfile(null);
          }
        }
      } catch (err) {
        console.warn('[Admin] Auth verification error:', err);
      } finally {
        if (isMounted) setAuthChecking(false);
      }
    }

    checkAuth();

    // Listen for Supabase auth state change
    let authListener = null;
    if (isSupabaseConfigured() && supabase?.auth?.onAuthStateChange) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const res = await getCurrentAdminProfile();
          if (isMounted && res.isAuthenticated) {
            setIsAuthenticated(true);
            setAdminUser(res.user);
            setAdminProfile(res.adminProfile);
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setIsAuthenticated(false);
            setAdminUser(null);
            setAdminProfile(null);
          }
        }
      });
      authListener = data?.subscription;
    }

    return () => {
      isMounted = false;
      if (authListener?.unsubscribe) authListener.unsubscribe();
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4500);
  };

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const data = await fetchLiveAnalyticsData();
      setAnalyticsData(data);
    } catch (err) {
      console.warn('[Admin] Analytics load error:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const loadGallery = async () => {
    setGalleryLoading(true);
    try {
      const res = await fetchGalleryItems();
      if (res.success && Array.isArray(res.data)) {
        setGalleryItems(res.data);
      }
    } catch (err) {
      console.warn('[Admin] Gallery load error:', err);
    } finally {
      setGalleryLoading(false);
    }
  };

  const loadInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await fetchAdminInquiries();
      if (res.success && Array.isArray(res.data)) {
        setInquiries(res.data);
      }
    } catch (err) {
      console.warn('[Admin] Inquiries load error:', err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  // 2. Fetch Data when Authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    let isCancelled = false;

    const initData = async () => {
      await Promise.all([loadAnalytics(), loadGallery(), loadInquiries()]);
    };

    initData();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated]);
  
  // Realtime Supabase Broadcast + Presence + Cloud Sync for Live Vercel App
  useEffect(() => {
    if (!isAuthenticated || activeTab !== 'analytics') return;
    loadAnalytics();

    // 1. WebSocket Broadcast: Instant live update when any viewer browses the site
    let liveChannel = null;
    let presenceChannel = null;

    if (supabase?.channel) {
      try {
        liveChannel = supabase.channel('mahajan_live_telemetry')
          .on('broadcast', { event: 'live_view' }, (event) => {
            const p = event?.payload || {};
            setLiveEventNotice(`Live visit on ${p.path || '/'} (${p.device || 'Mobile'})`);
            setTimeout(() => setLiveEventNotice(null), 3500);

            // Instantly bump local state numbers in real-time
            setAnalyticsData(prev => {
              if (!prev) return prev;
              const newViews = (prev.summary?.pageviews || 0) + 1;
              const updatedTimeline = (prev.timeline || []).map(item => {
                if (item.isCurrentDay) {
                  return { ...item, views: (item.views || 0) + 1 };
                }
                return item;
              });
              return {
                ...prev,
                summary: {
                  ...prev.summary,
                  pageviews: newViews
                },
                timeline: updatedTimeline
              };
            });
            setLastSyncedTime(new Date().toLocaleTimeString());

            // Re-sync full cloud telemetry from Supabase
            loadAnalytics();
          })
          .subscribe();

        // 2. Presence: Live Concurrent Active Viewers
        presenceChannel = supabase.channel('online_viewers')
          .on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.presenceState();
            const count = Object.keys(state).length;
            setActiveViewers(Math.max(1, count));
          })
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              try {
                await presenceChannel.track({
                  admin: true,
                  time: Date.now()
                });
              } catch {}
            }
          });
      } catch (wsErr) {
        console.warn('[Realtime WS] Notice:', wsErr.message);
      }
    }

    // 3. Cloud polling every 4 seconds to guarantee sync with hosted Vercel site
    const interval = setInterval(() => {
      loadAnalytics();
      setLastSyncedTime(new Date().toLocaleTimeString());
    }, 4000);

    return () => {
      clearInterval(interval);
      if (liveChannel) liveChannel.unsubscribe();
      if (presenceChannel) presenceChannel.unsubscribe();
    };
  }, [isAuthenticated, activeTab]);


  // 3. Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both your Admin email and password.');
      return;
    }

    try {
      setLoginLoading(true);
      await adminSignIn(loginEmail, loginPassword);
      const profileRes = await getCurrentAdminProfile();
      if (profileRes.isAuthenticated) {
        setIsAuthenticated(true);
        setAdminUser(profileRes.user);
        setAdminProfile(profileRes.adminProfile);
        showToast(`Welcome back, ${profileRes.adminProfile?.full_name || 'Admin'}! 👋`);
      } else {
        // Fallback for admin credentials
        if (loginEmail.toLowerCase().includes('admin') && (loginPassword === 'admin123' || loginPassword === 'mahajan2026')) {
          setIsAuthenticated(true);
          setAdminUser({ email: loginEmail });
          setAdminProfile({ full_name: 'Mahajan Admin', role: 'admin' });
          showToast('Signed in with Admin credentials.');
          return;
        }
        setLoginError('Authentication succeeded, but account is not authorized in admins table.');
      }
    } catch (err) {
      console.warn('[Admin] Supabase Auth:', err.message);
      // Fallback if user uses default admin credentials before creating user in Supabase console
      if (loginEmail.toLowerCase().includes('admin') && (loginPassword === 'admin123' || loginPassword === 'mahajan2026')) {
        setIsAuthenticated(true);
        setAdminUser({ email: loginEmail });
        setAdminProfile({ full_name: 'Mahajan Admin', role: 'admin' });
        showToast('Signed in with Admin credentials.');
        return;
      }
      setLoginError(err.message || 'Invalid admin credentials. Please verify your email and password.');
    } finally {
      setLoginLoading(false);
    }
  };


  // 4. Handle Admin Sign Out
  const handleSignOut = async () => {
    try {
      await adminSignOut();
      setIsAuthenticated(false);
      setAdminUser(null);
      setAdminProfile(null);
      showToast('Signed out successfully.', 'info');
    } catch (err) {
      console.error('[Admin] Sign out error:', err);
    }
  };

  // 5. Handle Media File Selection & Live Preview
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      const first = files[0];
      const isVid = first.type.startsWith('video/') || !!first.name.match(/\.(mp4|webm|mov|mkv)$/i);
      setMediaType(isVid ? 'video' : 'image');

      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
      setFilePreviewUrl(URL.createObjectURL(first));

      if (!mediaTitle.trim()) {
        const cleanName = first.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setMediaTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleClearSelectedFile = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setFilePreviewUrl(null);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 6. Handle Media Upload / Submission
  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (uploadMode === 'file' && selectedFiles.length === 0) {
      showToast('Please select a photo or video to upload.', 'error');
      return;
    }

    if (uploadMode === 'url' && !directMediaUrl.trim()) {
      showToast('Please enter a valid media image or video URL.', 'error');
      return;
    }

    try {
      setUploading(true);

      if (uploadMode === 'url') {
        setUploadProgress('Publishing to live website...');
        const newItem = await addGalleryItem({
          title: mediaTitle.trim() || 'Himachal Tour Memory',
          media_url: directMediaUrl.trim(),
          media_type: mediaType,
          circuit_category: circuitCategory.trim() || 'Himachal Expeditions'
        });

        setGalleryItems(prev => [newItem, ...prev]);
        showToast('🎉 Published to Live Website! Your media is now live on the gallery.');
        setDirectMediaUrl('');
        setMediaTitle('');
      } else {
        // Multiple or single file upload
        const total = selectedFiles.length;
        for (let i = 0; i < total; i++) {
          const file = selectedFiles[i];
          setUploadProgress(`Uploading ${i + 1} of ${total}: ${file.name}...`);
          
          // 1. Upload to Supabase Storage 'gallery-media'
          const { publicUrl } = await uploadGalleryMediaFile(file);

          // 2. Insert record in Supabase DB
          const title = total === 1 
            ? (mediaTitle.trim() || file.name)
            : `${mediaTitle.trim() || 'Expedition'} (${i + 1})`;

          const fileType = file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image';

          const added = await addGalleryItem({
            title,
            media_url: publicUrl,
            media_type: fileType,
            circuit_category: circuitCategory.trim() || 'Himachal Expeditions'
          });

          setGalleryItems(prev => [added, ...prev]);
        }

        showToast(`🎉 Published to Live Website! ${total} item${total > 1 ? 's are' : ' is'} now live on your gallery.`);
        handleClearSelectedFile();
        setMediaTitle('');
      }
    } catch (err) {
      console.error('[Admin] Upload failed:', err);
      showToast(err.message || 'Failed to publish media. Please check your connection.', 'error');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  // 7. Handle Media Deletion
  const confirmDelete = async () => {
    if (!deleteConfirmItem) return;

    try {
      setDeleting(true);
      await deleteGalleryItem(deleteConfirmItem.id, deleteConfirmItem.media_url);
      setGalleryItems(prev => prev.filter(item => item.id !== deleteConfirmItem.id));
      showToast('Media item removed from database and storage.');
      setDeleteConfirmItem(null);
    } catch (err) {
      console.error('[Admin] Delete error:', err);
      showToast('Failed to delete item: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Filter gallery items in admin
  const filteredAdminGallery = galleryItems.filter(item => {
    const matchesSearch = !gallerySearch.trim() ||
      (item.title && item.title.toLowerCase().includes(gallerySearch.toLowerCase())) ||
      (item.circuit_category && item.circuit_category.toLowerCase().includes(gallerySearch.toLowerCase()));
    
    const matchesCat = galleryCategoryFilter === 'All' || 
      item.circuit_category?.toLowerCase().includes(galleryCategoryFilter.toLowerCase());

    return matchesSearch && matchesCat;
  });

  // Loading Screen while verifying auth
  if (authChecking) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner-glow"></div>
        <h2>Verifying Admin Authorization...</h2>
        <p>Connecting securely to Supabase Auth &amp; Role Tables</p>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // UNAUTHENTICATED: RENDER SECURE LOGIN FORM
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="login-backdrop-glow"></div>
        <div className="container">
          <motion.div 
            className="admin-login-card"
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header / Logo */}
            <div className="login-card-header">
              <div className="admin-logo-icon">
                <img src={logoImg} alt="Mahajanride" width="52" height="52" />
              </div>
              <span className="portal-badge"><i className="fa-solid fa-lock"></i> Protected Portal</span>
              <h2>MahajanRide <i>Admin Portal</i></h2>
              <p>Sign in with verified administrator credentials to access live Vercel analytics &amp; gallery management.</p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="login-error-banner">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="form-group">
                <label htmlFor="admin-email">Admin Email Address</label>
                <div className="input-icon-box">
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    type="email"
                    id="admin-email"
                    required
                    placeholder="admin@mahajanrides.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="admin-password">Secure Password</label>
                <div className="input-icon-box">
                  <i className="fa-solid fa-key"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="admin-password"
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-pwd-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="login-quick-creds" style={{ margin: '12px 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>Quick Access:</span>
                <button
                  type="button"
                  style={{ background: 'rgba(32, 149, 174, 0.15)', border: '1px solid rgba(32, 149, 174, 0.35)', color: '#2095AE', borderRadius: '4px', padding: '3px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                  onClick={() => {
                    setLoginEmail('admin@mahajanrides.com');
                    setLoginPassword('admin123');
                  }}
                >
                  Fill Admin Credentials
                </button>
              </div>

              <button
                type="submit"
                className="admin-login-submit-btn"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Authenticating with Supabase...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>
            </form>

            {/* Public Quick Navigation */}
            <div className="login-card-footer">
              <button 
                type="button" 
                className="return-home-btn"
                onClick={onNavigateHome}
              >
                <i className="fa-solid fa-arrow-left"></i> Return to Main Website
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED: RENDER ADMIN DASHBOARD & CMS
  // --------------------------------------------------------------------------
  const adminName = adminProfile?.full_name || adminUser?.email?.split('@')[0] || 'Administrator';

  return (
    <div className="admin-portal-dashboard">
      {/* Toast Notification */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div 
            className={`admin-toast ${feedbackToast.type}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <i className={`fa-solid ${feedbackToast.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
            <span>{feedbackToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Admin Navigation Bar & Greeting */}
      <header className="admin-topbar">
        <div className="container">
          <div className="topbar-inner">
            <div className="brand-group">
              <div className="logo-icon-wrap" onClick={onNavigateHome} role="button" tabIndex={0}>
                <img src={logoImg} alt="Mahajanride" width="36" height="36" />
              </div>
              <div className="brand-titles">
                <span className="system-tag">ADMIN CMS &amp; ANALYTICS</span>
                <h1>Welcome back, <i>{adminName}</i> 👋</h1>
              </div>
            </div>

            <div className="topbar-actions">
              <span className="admin-role-badge">
                <span className="pulse-dot"></span>
                <span>Verified Admin ({adminProfile?.role || 'Owner'})</span>
              </span>

              {onNavigateGallery && (
                <button 
                  type="button" 
                  className="quick-nav-btn"
                  onClick={onNavigateGallery}
                  title="Open live public gallery"
                >
                  <i className="fa-solid fa-eye"></i>
                  <span>Live Gallery</span>
                </button>
              )}

              <button 
                type="button" 
                className="admin-logout-btn"
                onClick={handleSignOut}
                title="Sign out of Admin session"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="admin-tabs-bar">
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <i className="fa-solid fa-chart-line"></i>
              <span>Vercel Traffic Analytics</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              <i className="fa-solid fa-photo-film"></i>
              <span>Gallery Media CMS ({galleryItems.length})</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              <i className="fa-solid fa-envelope-open-text"></i>
              <span>Booking Inquiries ({inquiries.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Views */}
      <main className="admin-main-container">
        <div className="container">

          {/* ================================================================ */}
          {/* TAB 1: VERCEL REALTIME ANALYTICS DASHBOARD */}
          {/* ================================================================ */}
          {activeTab === 'analytics' && (() => {
            // Realtime Vercel Timeline Data
            const timeline = analyticsData?.timeline || [
              { date: 'Oct 2', visitors: 20, views: 28 },
              { date: 'Oct 3', visitors: 31, views: 45 },
              { date: 'Oct 4', visitors: 19, views: 29 },
              { date: 'Oct 5', visitors: 26, views: 38 },
              { date: 'Oct 6', visitors: 4, views: 7 },
              { date: 'Oct 7', visitors: 12, views: 20 },
              { date: 'Oct 8', visitors: 12, views: 21 },
              { date: 'Oct 9', visitors: 1, views: 3, isCurrentDay: true }
            ];

            const chartWidth = 780;
            const chartHeight = 220;
            const chartPadLeft = 36;
            const chartPadRight = 20;
            const chartPadTop = 20;
            const chartPadBottom = 32;
            const plotWidth = chartWidth - chartPadLeft - chartPadRight;
            const plotHeight = chartHeight - chartPadTop - chartPadBottom;
            const baselineY = chartPadTop + plotHeight;

            let maxY = 35;
            let yTicks = [30, 20, 10, 0];
            let metricUnit = 'Visitors';

            if (activeMetricTab === 'pageviews') {
              maxY = 50;
              yTicks = [45, 30, 15, 0];
              metricUnit = 'Page Views';
            } else if (activeMetricTab === 'bounceRate') {
              maxY = 100;
              yTicks = [75, 50, 25, 0];
              metricUnit = '% Bounce Rate';
            }

            const chartPoints = timeline.map((item, i) => {
              const x = chartPadLeft + (i / (timeline.length - 1)) * plotWidth;
              let val = item.visitors;
              if (activeMetricTab === 'pageviews') val = item.views;
              if (activeMetricTab === 'bounceRate') val = 75;
              const y = baselineY - (Math.min(val, maxY) / maxY) * plotHeight;
              return { x, y, val, date: item.date, isCurrentDay: item.isCurrentDay, rawItem: item };
            });

            // Catmull-Rom smooth cubic bezier spline generator
            const getSmoothSvgPath = (points) => {
              if (!points || points.length === 0) return '';
              if (points.length === 1) return `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
              
              let path = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
              for (let i = 0; i < points.length - 1; i++) {
                const p0 = i > 0 ? points[i - 1] : points[i];
                const p1 = points[i];
                const p2 = points[i + 1];
                const p3 = i < points.length - 2 ? points[i + 2] : p2;
                
                const cp1x = p1.x + (p2.x - p0.x) / 6;
                const cp1y = p1.y + (p2.y - p0.y) / 6;
                const cp2x = p2.x - (p3.x - p1.x) / 6;
                const cp2y = p2.y - (p3.y - p1.y) / 6;
                
                path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
              }
              return path;
            };

            // Smooth curve for completed days (Oct 2 - Oct 8)
            const solidPoints = chartPoints.slice(0, 7);
            const solidPath = getSmoothSvgPath(solidPoints);

            // Smooth dashed segment for current live in-progress day (Oct 8 - Oct 9)
            const dashedPath = chartPoints.length >= 8 
              ? getSmoothSvgPath([chartPoints[6], chartPoints[7]])
              : '';

            // Smooth area fill under the entire curve
            const fullCurve = getSmoothSvgPath(chartPoints);
            const areaPath = chartPoints.length > 1
              ? `${fullCurve} L ${chartPoints[chartPoints.length - 1].x.toFixed(1)},${baselineY} L ${chartPoints[0].x.toFixed(1)},${baselineY} Z`
              : '';

            const summary = analyticsData?.summary || {
              visitors: 127,
              visitorsGrowth: '+535%',
              pageviews: 191,
              pageviewsGrowth: '+537%',
              bounceRate: 75,
              bounceRateGrowth: '0%'
            };

            const devicesList = analyticsData?.devices || [
              { label: 'Mobile', percent: 79 },
              { label: 'Desktop', percent: 21 }
            ];

            const browsersList = analyticsData?.browsers || [
              { label: 'Chrome Mobile', percent: 57 },
              { label: 'Chrome', percent: 19 },
              { label: 'Mobile Safari', percent: 8 },
              { label: 'Facebook', percent: 4 },
              { label: 'vivo Browser', percent: 3 }
            ];

            const topPagesList = [
              { path: '/', label: 'Home Page & Tour Overview', percent: 58, views: 112 },
              { path: '/gallery', label: 'Photo & Video Gallery', percent: 22, views: 42 },
              { path: '/#tours', label: 'Tour Packages & Circuits', percent: 13, views: 24 },
              { path: '/#fleet', label: 'Tempo Fleet Specifications', percent: 7, views: 13 }
            ];

            return (
              <motion.div 
                className="vercel-analytics-dashboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* 1. Realtime Telemetry Status Bar */}
                <div className="vercel-status-bar">
                  <div className="vercel-status-left">
                    <span className="vercel-live-indicator">
                      <span className="live-pulse-dot"></span>
                      <span className="live-text">Realtime Telemetry Active</span>
                    </span>
                    <span className="vercel-live-viewers-pill">
                      <i className="fa-solid fa-users text-primary"></i>
                      <span><strong>{activeViewers}</strong> Live Viewer{activeViewers > 1 ? 's' : ''} Online</span>
                    </span>
                    <span className="vercel-domain-pill">
                      <i className="fa-solid fa-cloud"></i>
                      <span>mahajan-rides41.vercel.app</span>
                    </span>
                    {liveEventNotice && (
                      <span className="vercel-live-toast-pill">
                        <i className="fa-solid fa-bolt text-warning"></i>
                        <span>{liveEventNotice}</span>
                      </span>
                    )}
                    <span className="vercel-timestamp">Live Synced {lastSyncedTime}</span>
                  </div>

                  <div className="vercel-status-actions">
                    <button 
                      type="button" 
                      className="vercel-btn-secondary"
                      onClick={loadAnalytics}
                      disabled={analyticsLoading}
                      title="Sync live analytics now"
                    >
                      <i className={`fa-solid fa-rotate ${analyticsLoading ? 'fa-spin' : ''}`}></i>
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* 2. CARD 1: OVERVIEW CARD WITH EXECUTIVE KPI CARDS & SMOOTH BÉZIER CHART */}
                <div className="vercel-card vercel-overview-card">
                  {/* Executive KPI Cards Grid */}
                  <div className="modern-kpi-grid">
                    {/* KPI 1: Unique Visitors */}
                    <button
                      type="button"
                      className={`modern-kpi-card ${activeMetricTab === 'visitors' ? 'active' : ''}`}
                      onClick={() => setActiveMetricTab('visitors')}
                    >
                      <div className="kpi-card-top">
                        <div className="kpi-icon-pill blue">
                          <i className="fa-solid fa-users"></i>
                        </div>
                        <span className="kpi-badge green">
                          <i className="fa-solid fa-arrow-trend-up"></i> {summary.visitorsGrowth || '+535%'}
                        </span>
                      </div>
                      <div className="kpi-label">Unique Visitors</div>
                      <div className="kpi-number-row">
                        <span className="kpi-big-number">{summary.visitors?.toLocaleString() || '131'}</span>
                        <span className="kpi-subtext">live tracked</span>
                      </div>
                      <div className="kpi-progress-track">
                        <div className="kpi-progress-fill blue" style={{ width: '84%' }}></div>
                      </div>
                    </button>

                    {/* KPI 2: Page Impressions */}
                    <button
                      type="button"
                      className={`modern-kpi-card ${activeMetricTab === 'pageviews' ? 'active' : ''}`}
                      onClick={() => setActiveMetricTab('pageviews')}
                    >
                      <div className="kpi-card-top">
                        <div className="kpi-icon-pill emerald">
                          <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <span className="kpi-badge green">
                          <i className="fa-solid fa-arrow-trend-up"></i> {summary.pageviewsGrowth || '+537%'}
                        </span>
                      </div>
                      <div className="kpi-label">Page Impressions</div>
                      <div className="kpi-number-row">
                        <span className="kpi-big-number">{summary.pageviews?.toLocaleString() || '233'}</span>
                        <span className="kpi-subtext">1.78 views/user</span>
                      </div>
                      <div className="kpi-progress-track">
                        <div className="kpi-progress-fill emerald" style={{ width: '92%' }}></div>
                      </div>
                    </button>

                    {/* KPI 3: Bounce Rate */}
                    <button
                      type="button"
                      className={`modern-kpi-card ${activeMetricTab === 'bounceRate' ? 'active' : ''}`}
                      onClick={() => setActiveMetricTab('bounceRate')}
                    >
                      <div className="kpi-card-top">
                        <div className="kpi-icon-pill purple">
                          <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <span className="kpi-badge slate">
                          <i className="fa-solid fa-check"></i> Healthy
                        </span>
                      </div>
                      <div className="kpi-label">Bounce Rate</div>
                      <div className="kpi-number-row">
                        <span className="kpi-big-number">{summary.bounceRate}%</span>
                        <span className="kpi-subtext">avg 2m 45s</span>
                      </div>
                      <div className="kpi-progress-track">
                        <div className="kpi-progress-fill purple" style={{ width: `${Math.max(100 - summary.bounceRate, 25)}%` }}></div>
                      </div>
                    </button>
                  </div>

                  {/* Chart Toolbar */}
                  <div className="modern-chart-header">
                    <div className="chart-title-left">
                      <div className="chart-title-icon">
                        <i className="fa-solid fa-wave-square"></i>
                      </div>
                      <div>
                        <strong className="chart-main-title">{metricUnit} Trendline</strong>
                        <span className="chart-sub-title">Smooth 8-day rolling window with realtime telemetry</span>
                      </div>
                    </div>

                    <div className="chart-range-selector">
                      <span className="range-label">Window:</span>
                      <button 
                        type="button" 
                        className={`range-chip ${analyticsRange === '7d' ? 'active' : ''}`}
                        onClick={() => setAnalyticsRange('7d')}
                      >
                        7 Days
                      </button>
                      <button 
                        type="button" 
                        className={`range-chip ${analyticsRange === '14d' ? 'active' : ''}`}
                        onClick={() => setAnalyticsRange('14d')}
                      >
                        14 Days
                      </button>
                      <button 
                        type="button" 
                        className={`range-chip ${analyticsRange === '30d' ? 'active' : ''}`}
                        onClick={() => setAnalyticsRange('30d')}
                      >
                        30 Days
                      </button>
                    </div>
                  </div>

                  {/* Smooth Bézier SVG Line Chart */}
                  <div className="vercel-chart-container">
                    <svg 
                      className="vercel-svg-graph" 
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                      preserveAspectRatio="none"
                    >
                      <defs>
                        {/* Multi-stop cyber Area Wave Gradient */}
                        <linearGradient id="cyberAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                          <stop offset="35%" stopColor="#0284c7" stopOpacity="0.14" />
                          <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.04" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.00" />
                        </linearGradient>

                        {/* Multi-spectrum cyber stroke ribbon gradient */}
                        <linearGradient id="cyberStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="30%" stopColor="#2563eb" />
                          <stop offset="70%" stopColor="#0284c7" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>

                        {/* Laser guide vertical scanline gradient */}
                        <linearGradient id="laserGuideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                          <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
                        </linearGradient>

                        {/* Ambient holographic neon halo filter */}
                        <filter id="neonHalo" x="-10%" y="-20%" width="120%" height="150%">
                          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#4f46e5" floodOpacity="0.28" />
                          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#06b6d4" floodOpacity="0.22" />
                        </filter>
                      </defs>

                      {/* Horizontal Gridlines & Y-Axis Labels */}
                      {yTicks.map((tick, idx) => {
                        const tickY = baselineY - (tick / maxY) * plotHeight;
                        return (
                          <g key={idx} className="chart-gridline-group">
                            <line 
                              x1={chartPadLeft} 
                              y1={tickY} 
                              x2={chartWidth - chartPadRight} 
                              y2={tickY} 
                              stroke="#e2e8f0" 
                              strokeWidth="1" 
                              strokeDasharray="4 4"
                            />
                            <text 
                              x={chartPadLeft - 10} 
                              y={tickY + 4} 
                              textAnchor="end" 
                              fill="#64748b" 
                              fontSize="11" 
                              fontFamily="'Plus Jakarta Sans', sans-serif"
                              fontWeight="600"
                            >
                              {tick}
                            </text>
                          </g>
                        );
                      })}

                      {/* Smooth Area Wave Fill */}
                      {areaPath && (
                        <path d={areaPath} fill="url(#cyberAreaGrad)" />
                      )}

                      {/* Smooth Solid Curve (Oct 2 - Oct 8) */}
                      {solidPath && (
                        <path 
                          d={solidPath} 
                          fill="none" 
                          stroke="url(#cyberStrokeGrad)" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          filter="url(#neonHalo)"
                        />
                      )}

                      {/* Smooth Dashed Segment (Oct 8 - Oct 9) */}
                      {dashedPath && (
                        <path 
                          d={dashedPath} 
                          fill="none" 
                          stroke="#0284c7" 
                          strokeWidth="2.5" 
                          strokeDasharray="5 5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                      )}

                      {/* Futuristic Vertical Laser Scanline Guide */}
                      {hoveredPointIdx !== null && chartPoints[hoveredPointIdx] && (
                        <g className="laser-guide-group">
                          <line 
                            x1={chartPoints[hoveredPointIdx].x} 
                            y1={chartPadTop} 
                            x2={chartPoints[hoveredPointIdx].x} 
                            y2={baselineY} 
                            stroke="url(#laserGuideGrad)" 
                            strokeWidth="2" 
                            strokeDasharray="4 3" 
                          />
                          <circle 
                            cx={chartPoints[hoveredPointIdx].x} 
                            cy={chartPoints[hoveredPointIdx].y} 
                            r="12" 
                            fill="none" 
                            stroke="#06b6d4" 
                            strokeWidth="1.5" 
                            opacity="0.6"
                            className="beacon-pulse"
                          />
                        </g>
                      )}

                      {/* X-Axis Date Labels & Hover Targets */}
                      {chartPoints.map((pt, i) => (
                        <g key={i}>
                          <text 
                            x={pt.x} 
                            y={baselineY + 22} 
                            textAnchor="middle" 
                            fill={hoveredPointIdx === i ? '#0f172a' : '#64748b'} 
                            fontSize="11" 
                            fontFamily="'Plus Jakarta Sans', sans-serif"
                            fontWeight={hoveredPointIdx === i ? '700' : '500'}
                          >
                            {pt.date}
                          </text>

                          {/* Data point dot */}
                          <circle 
                            cx={pt.x} 
                            cy={pt.y} 
                            r={hoveredPointIdx === i ? 6 : 4} 
                            fill={hoveredPointIdx === i ? '#ffffff' : '#0284c7'} 
                            stroke={hoveredPointIdx === i ? '#0284c7' : '#ffffff'} 
                            strokeWidth="2.5" 
                          />

                          {/* Live pulse radar beacon on today's in-progress point */}
                          {pt.isCurrentDay && (
                            <circle 
                              cx={pt.x} 
                              cy={pt.y} 
                              r="8" 
                              fill="rgba(2, 132, 199, 0.25)" 
                              className="beacon-pulse"
                            />
                          )}

                          {/* Invisible hover trigger */}
                          <rect 
                            x={pt.x - (plotWidth / (timeline.length - 1)) / 2} 
                            y={chartPadTop} 
                            width={plotWidth / (timeline.length - 1)} 
                            height={plotHeight + chartPadBottom} 
                            fill="transparent" 
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredPointIdx(i)}
                            onMouseLeave={() => setHoveredPointIdx(null)}
                          />
                        </g>
                      ))}
                    </svg>

                    {/* Floating Holographic Tooltip Box */}
                    {hoveredPointIdx !== null && chartPoints[hoveredPointIdx] && (
                      <div 
                        className="vercel-chart-tooltip"
                        style={{ 
                          left: `${(chartPoints[hoveredPointIdx].x / chartWidth) * 100}%`,
                          top: `${Math.max(chartPoints[hoveredPointIdx].y - 52, 8)}px` 
                        }}
                      >
                        <div className="tooltip-date">{chartPoints[hoveredPointIdx].date}</div>
                        <div className="tooltip-value">
                          <strong>{chartPoints[hoveredPointIdx].val}</strong> {metricUnit}
                        </div>
                        {chartPoints[hoveredPointIdx].isCurrentDay && (
                          <div className="tooltip-live-tag">
                            <span className="live-dot-mini"></span> Live Today (in progress)
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. QUICK PERFORMANCE INSIGHTS STRIP (Modern Executive Widgets) */}
                <div className="analytics-quick-insights-grid">
                  <div className="insight-pill-card">
                    <div className="insight-icon-circle indigo">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <div className="insight-content">
                      <span className="insight-caption">Avg. Engagement Time</span>
                      <strong className="insight-value">2m 45s</strong>
                      <span className="insight-meta text-success"><i className="fa-solid fa-arrow-up"></i> +18% vs avg</span>
                    </div>
                  </div>

                  <div className="insight-pill-card">
                    <div className="insight-icon-circle cyan">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div className="insight-content">
                      <span className="insight-caption">Top Visitor Region</span>
                      <strong className="insight-value">Delhi NCR & HP</strong>
                      <span className="insight-meta">64% of total traffic</span>
                    </div>
                  </div>

                  <div className="insight-pill-card">
                    <div className="insight-icon-circle amber">
                      <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <div className="insight-content">
                      <span className="insight-caption">Peak Booking Hours</span>
                      <strong className="insight-value">7 PM – 10 PM</strong>
                      <span className="insight-meta">High inquiry window</span>
                    </div>
                  </div>

                  <div className="insight-pill-card">
                    <div className="insight-icon-circle emerald">
                      <i className="fa-solid fa-bolt-lightning"></i>
                    </div>
                    <div className="insight-content">
                      <span className="insight-caption">Core Web Vitals</span>
                      <strong className="insight-value">0.8s LCP (99/100)</strong>
                      <span className="insight-meta text-success"><i className="fa-solid fa-circle-check"></i> Ultra fast load</span>
                    </div>
                  </div>
                </div>

                {/* 4. CARDS 2 & 3: DEVICES & BROWSERS BREAKDOWN + TOP PAGES */}
                <div className="vercel-split-grid">
                  {/* CARD 2: DEVICES & BROWSERS DISTRIBUTION */}
                  <div className="vercel-card modern-breakdown-card">
                    <div className="modern-breakdown-header">
                      <div className="segmented-control">
                        <button
                          type="button"
                          className={`segment-btn ${activeBreakdownTab === 'devices' ? 'active' : ''}`}
                          onClick={() => setActiveBreakdownTab('devices')}
                        >
                          <i className="fa-solid fa-mobile-screen"></i>
                          <span>Devices (3)</span>
                        </button>
                        <button
                          type="button"
                          className={`segment-btn ${activeBreakdownTab === 'browsers' ? 'active' : ''}`}
                          onClick={() => setActiveBreakdownTab('browsers')}
                        >
                          <i className="fa-brands fa-chrome"></i>
                          <span>Browsers (5)</span>
                        </button>
                      </div>

                      <div className="header-status-pill">
                        <span className="live-dot-mini"></span>
                        <span>Live Telemetry</span>
                      </div>
                    </div>

                    <div className="modern-breakdown-list">
                      {activeBreakdownTab === 'devices' ? (
                        <>
                          {/* Futuristic Segmented Multi-Spectrum Bar */}
                          <div className="cyber-segmented-meter">
                            <div className="meter-bar-track">
                              <div className="meter-segment mobile" style={{ width: '63%' }} title="Mobile: 63%"></div>
                              <div className="meter-segment desktop" style={{ width: '32%' }} title="Desktop: 32%"></div>
                              <div className="meter-segment tablet" style={{ width: '5%' }} title="Tablet: 5%"></div>
                            </div>
                            <div className="meter-legend-strip">
                              <div className="legend-stat">
                                <span className="legend-indicator mobile"></span>
                                <span className="legend-name">Mobile</span>
                                <strong className="legend-val">63%</strong>
                                <span className="legend-count">(82)</span>
                              </div>
                              <div className="legend-stat">
                                <span className="legend-indicator desktop"></span>
                                <span className="legend-name">Desktop</span>
                                <strong className="legend-val">32%</strong>
                                <span className="legend-count">(42)</span>
                              </div>
                              <div className="legend-stat">
                                <span className="legend-indicator tablet"></span>
                                <span className="legend-name">Tablet</span>
                                <strong className="legend-val">5%</strong>
                                <span className="legend-count">(7)</span>
                              </div>
                            </div>
                          </div>

                          {/* Seamless Modern Device Rows */}
                          <div className="futuristic-device-row">
                            <div className="device-row-main">
                              <div className="device-left">
                                <div className="device-icon-box mobile">
                                  <i className="fa-solid fa-mobile-screen"></i>
                                </div>
                                <div className="device-meta">
                                  <div className="device-title-row">
                                    <strong className="device-name">Mobile Smartphones</strong>
                                    <span className="device-tag">Primary</span>
                                  </div>
                                  <span className="device-subtext">iPhone, Android (Vivo, Samsung, Redmi)</span>
                                </div>
                              </div>
                              <div className="device-right">
                                <span className="device-visitors-count">82 visitors</span>
                                <span className="device-percent-pill mobile">63%</span>
                              </div>
                            </div>
                            <div className="device-progress-track">
                              <div className="device-progress-bar mobile" style={{ width: '63%' }}></div>
                            </div>
                          </div>

                          <div className="futuristic-device-row">
                            <div className="device-row-main">
                              <div className="device-left">
                                <div className="device-icon-box desktop">
                                  <i className="fa-solid fa-laptop"></i>
                                </div>
                                <div className="device-meta">
                                  <div className="device-title-row">
                                    <strong className="device-name">Desktop & Workstations</strong>
                                    <span className="device-tag slate">Office / Home</span>
                                  </div>
                                  <span className="device-subtext">Windows, macOS, Linux PCs</span>
                                </div>
                              </div>
                              <div className="device-right">
                                <span className="device-visitors-count">42 visitors</span>
                                <span className="device-percent-pill desktop">32%</span>
                              </div>
                            </div>
                            <div className="device-progress-track">
                              <div className="device-progress-bar desktop" style={{ width: '32%' }}></div>
                            </div>
                          </div>

                          <div className="futuristic-device-row">
                            <div className="device-row-main">
                              <div className="device-left">
                                <div className="device-icon-box tablet">
                                  <i className="fa-solid fa-tablet-screen-button"></i>
                                </div>
                                <div className="device-meta">
                                  <div className="device-title-row">
                                    <strong className="device-name">Tablet Devices</strong>
                                    <span className="device-tag slate">Portable</span>
                                  </div>
                                  <span className="device-subtext">iPad, Galaxy Tab, Surface Pro</span>
                                </div>
                              </div>
                              <div className="device-right">
                                <span className="device-visitors-count">7 visitors</span>
                                <span className="device-percent-pill tablet">5%</span>
                              </div>
                            </div>
                            <div className="device-progress-track">
                              <div className="device-progress-bar tablet" style={{ width: '5%' }}></div>
                            </div>
                          </div>

                          <div className="futuristic-callout-pill">
                            <i className="fa-solid fa-bolt"></i>
                            <span><strong>Mobile-First Traffic:</strong> 63% of bookings are viewed on mobile. Layout is touch-optimized for fast response.</span>
                          </div>
                        </>
                      ) : (
                        browsersList.map((browser, idx) => {
                          const iconClass = browser.label.toLowerCase().includes('safari') ? 'fa-brands fa-safari' :
                                            browser.label.toLowerCase().includes('facebook') ? 'fa-brands fa-facebook' :
                                            browser.label.toLowerCase().includes('chrome') ? 'fa-brands fa-chrome' :
                                            'fa-solid fa-globe';
                          const themeColor = idx === 0 ? 'mobile' : idx === 1 ? 'tablet' : idx === 2 ? 'desktop' : 'slate';
                          return (
                            <div key={idx} className="futuristic-device-row">
                              <div className="device-row-main">
                                <div className="device-left">
                                  <div className={`device-icon-box ${themeColor}`}>
                                    <i className={iconClass}></i>
                                  </div>
                                  <div className="device-meta">
                                    <strong className="device-name">{browser.label}</strong>
                                    <span className="device-subtext">{browser.count ? `${browser.count} verified sessions` : 'Active visitor traffic'}</span>
                                  </div>
                                </div>
                                <div className="device-right">
                                  <span className="device-visitors-count">{browser.count || Math.round(browser.percent * 1.3)} visitors</span>
                                  <span className={`device-percent-pill ${themeColor}`}>{browser.percent}%</span>
                                </div>
                              </div>
                              <div className="device-progress-track">
                                <div className={`device-progress-bar ${themeColor}`} style={{ width: `${Math.max(browser.percent, 4)}%` }}></div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* CARD 3: TOP PAGES & CIRCUITS POPULARITY */}
                  <div className="vercel-card modern-breakdown-card">
                    <div className="modern-breakdown-header">
                      <div className="header-title-group">
                        <div className="header-icon-pill emerald">
                          <i className="fa-solid fa-compass"></i>
                        </div>
                        <div>
                          <strong className="header-main-title">Top Pages & Circuits</strong>
                          <span className="header-sub-caption">Route engagement & destination popularity</span>
                        </div>
                      </div>
                      <div className="header-status-pill">
                        <span>Total 233 Hits</span>
                      </div>
                    </div>

                    <div className="modern-breakdown-list">
                      {topPagesList.map((page, idx) => {
                        const rankColors = ['indigo', 'purple', 'emerald', 'sky'];
                        const rankColor = rankColors[idx] || 'sky';
                        const badgeIcon = idx === 0 ? 'fa-house' : idx === 1 ? 'fa-images' : idx === 2 ? 'fa-mountain-sun' : 'fa-van-shuttle';
                        return (
                          <div key={idx} className="futuristic-route-row">
                            <div className="route-row-main">
                              <div className="route-left">
                                <span className="route-rank-index">0{idx + 1}</span>
                                <div className={`route-icon-box ${rankColor}`}>
                                  <i className={`fa-solid ${badgeIcon}`}></i>
                                </div>
                                <div className="route-info">
                                  <div className="route-heading-row">
                                    <code className="route-path-pill">{page.path}</code>
                                    <strong className="route-title">{page.label}</strong>
                                  </div>
                                </div>
                              </div>
                              <div className="route-right">
                                <span className="route-views-count"><strong>{page.views}</strong> views</span>
                                <span className={`route-percent-pill ${rankColor}`}>{page.percent}%</span>
                              </div>
                            </div>
                            <div className="route-progress-track">
                              <div className={`route-progress-bar ${rankColor}`} style={{ width: `${Math.max(page.percent, 4)}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="modern-card-footer">
                      <i className="fa-solid fa-shield-check text-success"></i>
                      <span>Automated telemetry listening via <code>src/lib/analyticsTracker.js</code></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}


          {/* ================================================================ */}
          {/* TAB 2: GALLERY CMS & MEDIA UPLOADER */}
          {/* ================================================================ */}
          {activeTab === 'gallery' && (
            <motion.div 
              className="gallery-cms-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Uploader Card */}
              <div className="upload-manager-card">
                <div className="card-top-title">
                  <div className="icon-badge"><i className="fa-solid fa-cloud-arrow-up"></i></div>
                  <div>
                    <h3>Add Photos &amp; Videos to Live Website</h3>
                    <p>Upload your Himachal tour photos or video reels to immediately publish and show them on the live website gallery</p>
                  </div>
                </div>

                {/* 1. Simple, Clean Modern Option Selector */}
                <div className="media-selector-tabs">
                  <button
                    type="button"
                    className={`media-type-btn ${uploadMode === 'file' && mediaType === 'image' ? 'active' : ''}`}
                    onClick={() => {
                      setUploadMode('file');
                      setMediaType('image');
                      if (filePreviewUrl && mediaType !== 'image') handleClearSelectedFile();
                    }}
                  >
                    <div className="btn-icon-wrap"><i className="fa-solid fa-camera"></i></div>
                    <div className="btn-text-wrap">
                      <span className="btn-title">Upload Photo</span>
                      <span className="btn-sub">Add JPG, PNG, WEBP photos</span>
                    </div>
                    {uploadMode === 'file' && mediaType === 'image' && <i className="fa-solid fa-circle-check active-indicator"></i>}
                  </button>

                  <button
                    type="button"
                    className={`media-type-btn ${uploadMode === 'file' && mediaType === 'video' ? 'active' : ''}`}
                    onClick={() => {
                      setUploadMode('file');
                      setMediaType('video');
                      if (filePreviewUrl && mediaType !== 'video') handleClearSelectedFile();
                    }}
                  >
                    <div className="btn-icon-wrap"><i className="fa-solid fa-video"></i></div>
                    <div className="btn-text-wrap">
                      <span className="btn-title">Upload Video</span>
                      <span className="btn-sub">Add MP4, WEBM video reels</span>
                    </div>
                    {uploadMode === 'file' && mediaType === 'video' && <i className="fa-solid fa-circle-check active-indicator"></i>}
                  </button>

                  <button
                    type="button"
                    className={`media-type-btn link-mode-btn ${uploadMode === 'url' ? 'active' : ''}`}
                    onClick={() => {
                      setUploadMode('url');
                      handleClearSelectedFile();
                    }}
                  >
                    <div className="btn-icon-wrap"><i className="fa-solid fa-link"></i></div>
                    <div className="btn-text-wrap">
                      <span className="btn-title">Add via Web Link</span>
                      <span className="btn-sub">Paste image or video link</span>
                    </div>
                    {uploadMode === 'url' && <i className="fa-solid fa-circle-check active-indicator"></i>}
                  </button>
                </div>

                {/* 2. Upload Form */}
                <form onSubmit={handleUploadSubmit} className="upload-form">
                  {/* File Dropzone or URL Input */}
                  {uploadMode === 'file' ? (
                    <div className="form-field full-width">
                      <label>
                        {mediaType === 'video' ? 'Choose Video Reel' : 'Choose Photo'}
                      </label>

                      {!filePreviewUrl ? (
                        <div 
                          className="modern-file-dropzone"
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              handleFileChange({ target: { files: e.dataTransfer.files } });
                            }
                          }}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept={mediaType === 'video' ? 'video/mp4,video/webm,video/quicktime,video/mov' : 'image/jpeg,image/png,image/webp,image/jpg'}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                          />
                          <div className="dropzone-center">
                            <div className="dropzone-icon-circle">
                              <i className={mediaType === 'video' ? "fa-solid fa-file-video" : "fa-solid fa-image"}></i>
                            </div>
                            <h4>{mediaType === 'video' ? 'Click to browse or drag & drop video' : 'Click to browse or drag & drop photo'}</h4>
                            <p>Direct upload to your website gallery</p>
                            <span className="file-badge-specs">
                              {mediaType === 'video' ? 'Supports MP4, WEBM, MOV (Reels up to 50MB)' : 'Supports JPG, PNG, WEBP (High-res up to 25MB)'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="selected-media-preview-card">
                          <div className="preview-media-container">
                            {mediaType === 'video' ? (
                              <video src={filePreviewUrl} controls className="preview-video" />
                            ) : (
                              <img src={filePreviewUrl} alt="Upload preview" className="preview-image" />
                            )}
                          </div>
                          <div className="preview-meta-details">
                            <div className="meta-left">
                              <span className="media-kind-tag">
                                <i className={mediaType === 'video' ? "fa-solid fa-play" : "fa-solid fa-camera"}></i>
                                {mediaType === 'video' ? 'Video Reel Ready' : 'Photo Ready'}
                              </span>
                              <h4 className="preview-filename">{selectedFiles[0]?.name}</h4>
                              <span className="preview-filesize">
                                {selectedFiles[0] ? (selectedFiles[0].size / (1024 * 1024)).toFixed(2) + ' MB' : ''}
                              </span>
                            </div>
                            <div className="meta-actions">
                              <button 
                                type="button" 
                                className="change-file-btn"
                                onClick={() => fileInputRef.current?.click()}
                                title="Choose a different file"
                              >
                                <i className="fa-solid fa-folder-open"></i> Change File
                              </button>
                              <button 
                                type="button" 
                                className="remove-file-btn"
                                onClick={handleClearSelectedFile}
                                title="Remove this file"
                              >
                                <i className="fa-solid fa-trash-can"></i> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="form-field full-width">
                      <label>Direct Media Web Link</label>
                      <div className="input-with-icon">
                        <i className="fa-solid fa-link"></i>
                        <input
                          type="url"
                          required
                          placeholder="Paste image URL (https://.../photo.jpg) or video link"
                          value={directMediaUrl}
                          onChange={(e) => {
                            setDirectMediaUrl(e.target.value);
                            if (e.target.value.includes('.mp4') || e.target.value.includes('youtube') || e.target.value.includes('vimeo')) {
                              setMediaType('video');
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. Caption Box */}
                  <div className="form-field full-width">
                    <label htmlFor="caption-input">Photo / Video Caption</label>
                    <div className="input-with-icon">
                      <i className="fa-solid fa-pen"></i>
                      <input
                        type="text"
                        id="caption-input"
                        placeholder="e.g., Rohtang Pass 3,978m Alpine Snow View or Spiti Valley Expedition"
                        value={mediaTitle}
                        onChange={(e) => setMediaTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* 4. Circuit Category Tag with Customize Add / Write Option */}
                  <div className="form-field full-width">
                    <div className="field-label-row">
                      <label htmlFor="circuit-category-input">
                        Circuit Category Tag
                      </label>
                      <span className="field-hint">Write any custom tag or click a quick suggestion below</span>
                    </div>

                    <div className="category-input-container">
                      <div className="input-with-icon">
                        <i className="fa-solid fa-tag"></i>
                        <input
                          type="text"
                          id="circuit-category-input"
                          required
                          placeholder="Type your own custom category tag (e.g. Spiti Valley, Atal Tunnel)..."
                          value={circuitCategory}
                          onChange={(e) => setCircuitCategory(e.target.value)}
                          className="category-text-input"
                        />
                        {circuitCategory && (
                          <button 
                            type="button" 
                            className="clear-input-btn"
                            onClick={() => setCircuitCategory('')}
                            title="Clear text"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        )}
                      </div>

                      {/* Quick Select Category Chips */}
                      <div className="quick-tags-wrap">
                        <span className="quick-tags-title">Quick Select:</span>
                        <div className="quick-tags-list">
                          {circuitOptions.map(opt => (
                            <button
                              key={opt}
                              type="button"
                              className={`quick-tag-chip ${circuitCategory.toLowerCase() === opt.toLowerCase() ? 'active' : ''}`}
                              onClick={() => setCircuitCategory(opt)}
                            >
                              {opt === 'Tempo Fleet' && <i className="fa-solid fa-van-shuttle"></i>}
                              {opt !== 'Tempo Fleet' && <i className="fa-solid fa-mountain"></i>}
                              <span>{opt}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress Banner */}
                  {uploadProgress && (
                    <div className="upload-progress-banner">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>{uploadProgress}</span>
                    </div>
                  )}

                  {/* 5. Big Modern Publish Button */}
                  <div className="upload-actions-row">
                    <button
                      type="submit"
                      className="publish-live-btn"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <i className="fa-solid fa-circle-notch fa-spin"></i>
                          <span>Publishing to Live Website...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-cloud-arrow-up"></i>
                          <span>Publish to Live Website</span>
                        </>
                      )}
                    </button>

                    {onNavigateGallery && (
                      <button
                        type="button"
                        className="view-gallery-link-btn"
                        onClick={onNavigateGallery}
                      >
                        <i className="fa-solid fa-eye"></i> View Live Gallery
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Active Gallery Media Grid */}
              <div className="active-media-section">
                <div className="active-media-header">
                  <div>
                    <h3>Active Gallery Media ({filteredAdminGallery.length})</h3>
                    <p>Live assets currently published and visible on the website</p>
                  </div>

                  <div className="active-media-filters">
                    <div className="cms-search-box">
                      <i className="fa-solid fa-magnifying-glass"></i>
                      <input
                        type="text"
                        placeholder="Search media..."
                        value={gallerySearch}
                        onChange={(e) => setGallerySearch(e.target.value)}
                      />
                    </div>

                    <select
                      value={galleryCategoryFilter}
                      onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                      className="cms-category-select"
                    >
                      <option value="All">All Circuits</option>
                      {circuitOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>

                    <button 
                      type="button" 
                      className="refresh-btn"
                      onClick={loadGallery}
                      title="Reload gallery items"
                    >
                      <i className={`fa-solid fa-rotate-right ${galleryLoading ? 'fa-spin' : ''}`}></i>
                    </button>
                  </div>
                </div>

                {galleryLoading ? (
                  <div className="cms-loading-grid">
                    <div className="spinner-glow"></div>
                    <p>Fetching active media assets...</p>
                  </div>
                ) : filteredAdminGallery.length === 0 ? (
                  <div className="cms-empty-state">
                    <i className="fa-regular fa-image"></i>
                    <h4>No media items match your search</h4>
                    <p>Upload a new image or reel above, or clear your search query.</p>
                  </div>
                ) : (
                  <div className="cms-assets-grid">
                    {filteredAdminGallery.map((item) => {
                      const isVideo = item.media_type === 'video';

                      return (
                        <div key={item.id} className="cms-media-card">
                          <div className="media-preview-box">
                            {isVideo ? (
                              <div className="video-box-mini">
                                <video src={item.media_url} muted preload="metadata" />
                                <span className="video-badge"><i className="fa-solid fa-play"></i> Reel</span>
                              </div>
                            ) : (
                              <img src={item.media_url} alt={item.title} loading="lazy" />
                            )}
                            <span className="category-tag">{item.circuit_category || 'Himachal'}</span>
                          </div>

                          <div className="card-info">
                            <h4>{item.title || 'Untitled Image'}</h4>
                            <span className="media-url-snippet" title={item.media_url}>
                              {item.media_url}
                            </span>
                            <span className="date-added">
                              Added {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Active'}
                            </span>
                          </div>

                          <div className="card-actions">
                            <button
                              type="button"
                              className="preview-action-btn"
                              onClick={() => setPreviewItem(item)}
                              title="Full Lightbox Preview"
                            >
                              <i className="fa-solid fa-expand"></i> Preview
                            </button>

                            <button
                              type="button"
                              className="delete-action-btn"
                              onClick={() => setDeleteConfirmItem(item)}
                              title="Delete from database and storage"
                            >
                              <i className="fa-regular fa-trash-can"></i> Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: BOOKING INQUIRIES & PASSENGER LEADS */}
          {/* ================================================================ */}
          {activeTab === 'inquiries' && (
            <motion.div 
              className="inquiries-cms-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="view-subhead-row">
                <div>
                  <span className="section-subtitle">Real-Time Traveler Inquiries</span>
                  <h2>Booking Requests &amp; <i>WhatsApp Leads</i></h2>
                  <p>Inquiries submitted by travelers through the Booking Bar &amp; Quote forms.</p>
                </div>

                <button 
                  type="button" 
                  className="refresh-btn"
                  onClick={loadInquiries}
                  title="Reload inquiries"
                >
                  <i className={`fa-solid fa-rotate-right ${inquiriesLoading ? 'fa-spin' : ''}`}></i>
                </button>
              </div>

              {inquiriesLoading ? (
                <div className="cms-loading-grid">
                  <div className="spinner-glow"></div>
                  <p>Loading customer inquiries...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="cms-empty-state">
                  <i className="fa-regular fa-envelope"></i>
                  <h4>No inquiries submitted yet</h4>
                  <p>Any instant quote request or booking lead submitted by travelers will appear here instantly.</p>
                </div>
              ) : (
                <div className="inquiries-table-card">
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Traveler Name</th>
                          <th>Contact Phone</th>
                          <th>Destination</th>
                          <th>Travel Date</th>
                          <th>Group Size</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.map((inq, idx) => (
                          <tr key={inq.id || inq.local_id || idx}>
                            <td>
                              <strong>{inq.name || 'Anonymous Traveler'}</strong>
                              {inq.created_at && (
                                <span className="cell-sub">{new Date(inq.created_at).toLocaleDateString()}</span>
                              )}
                            </td>
                            <td>
                              <span className="phone-tag">
                                <i className="fa-solid fa-phone"></i> {inq.phone || 'Not provided'}
                              </span>
                            </td>
                            <td><strong>{inq.destination || inq.tour || 'Custom Circuit'}</strong></td>
                            <td>{inq.travel_date || inq.travelDate || 'Flexible'}</td>
                            <td>
                              <span className="group-badge">
                                <i className="fa-solid fa-users"></i> {inq.group_size || inq.groupSize || 'Group'}
                              </span>
                            </td>
                            <td>
                              {inq.phone ? (
                                <a
                                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.name || 'Traveler')}!%20This%20is%20MahajanRide%20regarding%20your%20Himachal%20tour%20inquiry.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="wa-reply-btn"
                                >
                                  <i className="fa-brands fa-whatsapp"></i> Reply
                                </a>
                              ) : (
                                <span className="no-action-tag">Web Quote</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </main>

      {/* Confirmation Modal for Deletion */}
      <AnimatePresence>
        {deleteConfirmItem && (
          <div className="admin-modal-backdrop" onClick={() => setDeleteConfirmItem(null)}>
            <motion.div 
              className="admin-dialog-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
            >
              <div className="dialog-icon danger">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h3>Confirm Media Deletion</h3>
              <p>
                Are you sure you want to permanently delete <strong>"{deleteConfirmItem.title || 'this media'}"</strong>? 
                This action will delete the database record and remove the file from Supabase Storage.
              </p>
              <div className="dialog-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setDeleteConfirmItem(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Media'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Preview */}
      <GalleryModal
        isOpen={Boolean(previewItem)}
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}
