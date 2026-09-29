import { motion } from 'framer-motion';
import { BLOG_PREVIEW_DATA } from '../../data/toursData';
import { openWhatsAppInquiry } from '../../utils/whatsapp';
import './BlogPreview.scss';

export default function BlogPreview() {
  const handleInquireArticle = (title) => {
    openWhatsAppInquiry({
      tourName: `Route Query: ${title}`,
      destination: "Tour Guide Route",
      days: 5
    });
  };

  return (
    <section className="blog-section section-padding">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <div className="section-subtitle">Road Trip Insights</div>
          <h2 className="section-title">Stories that inspire your <i>next ride</i></h2>
        </div>

        <div className="blog-cards-grid">
          {BLOG_PREVIEW_DATA.map((post, idx) => (
            <motion.div 
              key={post.id}
              className="blog-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="blog-card-media">
                <img src={post.image} alt={post.title} loading="lazy" />
                <span className="blog-card-date"><i className="fa-regular fa-clock"></i> {post.date}</span>
              </div>
              <div className="blog-card-body">
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <button 
                  className="blog-link-btn"
                  onClick={() => handleInquireArticle(post.title)}
                >
                  Plan This Road Trip <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
