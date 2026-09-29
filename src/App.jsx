import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import BookingBar from './components/BookingBar/BookingBar';
import AboutSnippet from './components/AboutSnippet/AboutSnippet';
import FeaturedTours from './components/FeaturedTours/FeaturedTours';
import Services from './components/Services/Services';
import Ticker from './components/Ticker/Ticker';
import Testimonials from './components/Testimonials/Testimonials';
import Faq from './components/Faq/Faq';
import BlogPreview from './components/BlogPreview/BlogPreview';
import Footer from './components/Footer/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp/FloatingWhatsApp';

export default function App() {
  const scrollToBooking = () => {
    const el = document.getElementById('bookingBar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTours = () => {
    const el = document.getElementById('tours');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">
      {/* 1. Header & Navigation */}
      <Navbar onBookClick={scrollToBooking} />

      {/* 2. Hero Section (TourVex Layout 1) */}
      <Hero onExploreTours={scrollToTours} />

      {/* 3. Interactive WhatsApp Tour Booking Bar */}
      <BookingBar />

      {/* 4. About Snippet & Pillars */}
      <AboutSnippet onLearnMore={scrollToTours} />

      {/* 5. Featured Tours with Sticky Sidebar */}
      <FeaturedTours />

      {/* 6. Services & Rotating Circular SVG Badge */}
      <Services />

      {/* 7. Infinite Scrolling Marquee Ticker */}
      <Ticker />

      {/* 8. Testimonials & Traveler Stories */}
      <Testimonials />

      {/* 9. FAQs with Motion Accordion */}
      <Faq />

      {/* 10. Blog & Travel Insights Preview */}
      <BlogPreview />

      {/* 11. Footer with Instagram Grid & Watermark */}
      <Footer />

      {/* 12. Floating WhatsApp Quick Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}
