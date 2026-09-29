import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp/FloatingWhatsApp';

// Subpage Views
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const getPageFromHash = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('destination') || hash.includes('tour')) return 'destinations';
    if (hash.includes('about')) return 'about';
    if (hash.includes('blog') || hash.includes('review') || hash.includes('faq')) return 'blog';
    if (hash.includes('contact')) return 'contact';
    return 'home';
  };

  const [activePage, setActivePage] = useState(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(getPageFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (page) => {
    setActivePage(page);
    const hash = page === 'home' ? '#/' : `#/${page}`;
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookClick = () => {
    if (activePage === 'home') {
      const el = document.getElementById('bookingBar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigateToPage('destinations');
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
          />
        )}

        {activePage === 'destinations' && (
          <DestinationsPage 
            onNavigateHome={() => navigateToPage('home')}
            onNavigateContact={() => navigateToPage('contact')}
          />
        )}

        {activePage === 'about' && (
          <AboutPage 
            onNavigateHome={() => navigateToPage('home')}
            onNavigateDestinations={() => navigateToPage('destinations')}
            onNavigateContact={() => navigateToPage('contact')}
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
