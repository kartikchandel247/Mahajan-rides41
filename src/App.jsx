import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp/FloatingWhatsApp';

// Subpage Views
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import BookingPage from './pages/BookingPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import AdminPage from './pages/AdminPage';
import { trackPageview } from './lib/analyticsTracker';

export default function App() {
  const getPageFromRoute = () => {
    if (typeof window === 'undefined') return 'home';

    // Clean normalized path and hash (handles double slashes //admin, trailing slashes, and hash variants)
    const rawPath = window.location.pathname.toLowerCase();
    const cleanPath = rawPath.replace(/\/+/g, '/');
    const rawHash = window.location.hash.toLowerCase();
    // Normalize hash: removes leading '#', '#/' or '/#' and multiple slashes
    const hashRoute = rawHash.replace(/^#\/?/, '').replace(/\/+/g, '/');

    // Helper to sanitize URL if pathname contains stale /gallery or /admin while hash specifies another page
    const sanitizeStalePath = (cleanTargetHash) => {
      if (cleanPath.startsWith('/gallery') || cleanPath.startsWith('/admin')) {
        try {
          window.history.replaceState(null, '', cleanTargetHash ? `/#/${cleanTargetHash}` : '/');
        } catch {}
      }
    };

    // 1. Explicit Hash Subpages take primary precedence
    if (hashRoute.startsWith('admin')) {
      return 'admin';
    }
    if (hashRoute.startsWith('gallery')) {
      return 'gallery';
    }
    if (hashRoute.startsWith('book') || hashRoute.startsWith('quote')) {
      sanitizeStalePath('booking');
      return 'booking';
    }
    if (hashRoute.startsWith('destination') || hashRoute.startsWith('tour') || hashRoute.startsWith('circuit')) {
      sanitizeStalePath('destinations');
      return 'destinations';
    }
    if (hashRoute.startsWith('about') || hashRoute.startsWith('fleet')) {
      sanitizeStalePath('about');
      return 'about';
    }
    if (hashRoute.startsWith('blog') || hashRoute.startsWith('guide') || hashRoute.startsWith('review') || hashRoute.startsWith('faq')) {
      sanitizeStalePath('blog');
      return 'blog';
    }
    if (hashRoute.startsWith('contact')) {
      sanitizeStalePath('contact');
      return 'contact';
    }
    if (hashRoute === 'home' || rawHash === '#/' || (rawHash === '#' && (cleanPath.startsWith('/gallery') || cleanPath.startsWith('/admin')))) {
      sanitizeStalePath('');
      return 'home';
    }

    // 2. Direct Pathname Routes (when no overriding hash route is provided)
    if (cleanPath.startsWith('/admin')) return 'admin';
    if (cleanPath.startsWith('/gallery')) return 'gallery';
    if (cleanPath.startsWith('/book')) return 'booking';
    if (cleanPath.startsWith('/destination') || cleanPath.startsWith('/tour')) return 'destinations';
    if (cleanPath.startsWith('/about')) return 'about';
    if (cleanPath.startsWith('/blog')) return 'blog';
    if (cleanPath.startsWith('/contact')) return 'contact';

    return 'home';
  };

  const [activePage, setActivePage] = useState(getPageFromRoute);
  const [selectedBookingTour, setSelectedBookingTour] = useState('');
  const pendingScrollRef = useRef(null);

  // 1. Prevent browser from restoring scroll position to the middle on tab change
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Track real pageview for active page
  useEffect(() => {
    trackPageview(activePage);
  }, [activePage]);

  // 2. Route change listener (handles both hashchange and browser popstate / back button)
  useEffect(() => {
    const handleRouteChange = () => {
      setActivePage(getPageFromRoute());
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // 3. Scroll to target section or absolute top on page navigation
  useEffect(() => {
    if (pendingScrollRef.current) {
      const targetId = pendingScrollRef.current;
      pendingScrollRef.current = null;
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const rafId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    return () => cancelAnimationFrame(rafId);
  }, [activePage]);

  const navigateToPage = (page, sectionId = null) => {
    if (sectionId) {
      pendingScrollRef.current = sectionId;
    }

    if (activePage === page) {
      if (sectionId) {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
      return;
    }

    setActivePage(page);

    // Update browser URL and history cleanly, resetting pathname to prevent sticking to /gallery or /admin
    let targetUrl = '/';
    if (page === 'admin') {
      targetUrl = '/admin';
    } else if (page === 'gallery') {
      targetUrl = '/gallery';
    } else if (page === 'home') {
      targetUrl = sectionId ? `/#${sectionId}` : '/';
    } else {
      targetUrl = sectionId ? `/#/${page}#${sectionId}` : `/#/${page}`;
    }

    try {
      window.history.pushState(null, '', targetUrl);
    } catch {
      window.location.hash = page === 'home' ? (sectionId ? `#${sectionId}` : '#/') : `#/${page}`;
    }
  };

  const handleBookClick = (tourTitle = null, sectionId = null) => {
    if (typeof tourTitle === 'string') {
      setSelectedBookingTour(tourTitle);
    }
    navigateToPage('booking', sectionId);
  };

  const isAdminView = activePage === 'admin';

  return (
    <div className={`app-root ${isAdminView ? 'is-admin-mode' : ''}`}>
      {/* 1. Header & Navigation (Hidden on Admin Portal for focused CMS experience) */}
      {!isAdminView && (
        <Navbar 
          activePage={activePage} 
          onNavigate={navigateToPage} 
          onBookClick={handleBookClick} 
        />
      )}

      {/* 2. Main Page Render */}
      <main className="main-content-area">
        {activePage === 'home' && (
          <HomePage 
            onNavigateDestinations={() => navigateToPage('destinations')}
            onNavigateAbout={() => navigateToPage('about')}
            onNavigateBlog={() => navigateToPage('blog')}
            onNavigateGallery={() => navigateToPage('gallery')}
            onNavigateContact={() => navigateToPage('contact')}
            onNavigateBooking={handleBookClick}
            onNavigateSection={navigateToPage}
          />
        )}

        {activePage === 'gallery' && (
          <GalleryPage 
            onNavigateHome={() => navigateToPage('home')}
            onNavigateBooking={handleBookClick}
          />
        )}

        {activePage === 'admin' && (
          <AdminPage 
            onNavigateHome={() => navigateToPage('home')}
            onNavigateGallery={() => navigateToPage('gallery')}
          />
        )}

        {activePage === 'booking' && (
          <BookingPage 
            selectedTour={selectedBookingTour}
            onNavigateHome={() => navigateToPage('home')}
            onNavigateDestinations={() => navigateToPage('destinations')}
            onNavigateContact={() => navigateToPage('contact')}
          />
        )}

        {activePage === 'destinations' && (
          <DestinationsPage 
            onNavigateHome={() => navigateToPage('home')}
            onNavigateContact={() => navigateToPage('contact')}
            onNavigateBooking={handleBookClick}
          />
        )}

        {activePage === 'about' && (
          <AboutPage 
            onNavigateHome={() => navigateToPage('home')}
            onNavigateDestinations={() => navigateToPage('destinations')}
            onNavigateContact={() => navigateToPage('contact')}
            onNavigateBooking={handleBookClick}
            onNavigateSection={navigateToPage}
          />
        )}

        {activePage === 'blog' && (
          <BlogPage 
            onNavigateHome={() => navigateToPage('home')}
            onNavigateDestinations={() => navigateToPage('destinations')}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage 
            onNavigateHome={() => navigateToPage('home')}
          />
        )}
      </main>

      {/* 3. Global Footer with Subpage links (Hidden in Admin Portal) */}
      {!isAdminView && <Footer onNavigate={navigateToPage} />}

      {/* 4. Floating WhatsApp Action Button */}
      {!isAdminView && <FloatingWhatsApp />}

      {/* 5. Vercel Web Analytics & Real-Time Speed Insights */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

