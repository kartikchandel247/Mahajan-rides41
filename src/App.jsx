import { useState, useEffect, useRef } from 'react';
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

export default function App() {
  const getPageFromHash = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('book') || hash.includes('quote')) return 'booking';
    if (hash.includes('destination') || hash.includes('tour')) return 'destinations';
    if (hash.includes('about')) return 'about';
    if (hash.includes('blog') || hash.includes('review') || hash.includes('faq')) return 'blog';
    if (hash.includes('contact')) return 'contact';
    return 'home';
  };

  const [activePage, setActivePage] = useState(getPageFromHash);
  const [selectedBookingTour, setSelectedBookingTour] = useState('');
  const pendingScrollRef = useRef(null);

  // 1. Prevent browser from restoring scroll position to the middle on tab change
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // 2. Hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(getPageFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
    const hash = page === 'home' ? '#/' : `#/${page}`;
    window.location.hash = hash;
  };

  const handleBookClick = (tourTitle = null, sectionId = null) => {
    if (typeof tourTitle === 'string') {
      setSelectedBookingTour(tourTitle);
    }
    navigateToPage('booking', sectionId);
  };

  return (
    <div className="app-root">
      {/* 1. Header & Navigation with Subpage buttons */}
      <Navbar 
        activePage={activePage} 
        onNavigate={navigateToPage} 
        onBookClick={handleBookClick} 
      />

      {/* 2. Main Page Render */}
      <main className="main-content-area">
        {activePage === 'home' && (
          <HomePage 
            onNavigateDestinations={() => navigateToPage('destinations')}
            onNavigateAbout={() => navigateToPage('about')}
            onNavigateBlog={() => navigateToPage('blog')}
            onNavigateContact={() => navigateToPage('contact')}
            onNavigateBooking={handleBookClick}
            onNavigateSection={navigateToPage}
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

      {/* 3. Global Footer with Subpage links */}
      <Footer onNavigate={navigateToPage} />

      {/* 4. Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}
