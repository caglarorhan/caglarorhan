import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './BlogSection.css'

gsap.registerPlugin(ScrollTrigger)

const BlogSection = () => {
  const sectionRef = useRef(null)

  const posts = [
    {
      id: 1,
      title: 'The Future of AI in Web Development',
      excerpt: 'Exploring how artificial intelligence is revolutionizing the way we build and interact with web applications.',
      date: 'Dec 5, 2025',
      category: 'AI',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
      featured: true
    },
    {
      id: 2,
      title: 'Building Scalable Microservices with Node.js',
      excerpt: 'A comprehensive guide to architecting microservices that can handle millions of requests.',
      date: 'Nov 28, 2025',
      category: 'Backend',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
      featured: false
    },
    {
      id: 3,
      title: 'Three.js: Creating Immersive 3D Experiences',
      excerpt: 'Dive into the world of WebGL and learn how to create stunning 3D visualizations.',
      date: 'Nov 15, 2025',
      category: '3D Graphics',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
      featured: false
    },
    {
      id: 4,
      title: 'The Psychology of Great UI Design',
      excerpt: 'Understanding how human psychology influences effective user interface design decisions.',
      date: 'Nov 8, 2025',
      category: 'Design',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
      featured: false
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax beams
      gsap.to('.neon-beam', {
        y: '50%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })

      // Cards animation
      gsap.from('.blog-card', {
        opacity: 0,
        y: 60,
        rotateX: 15,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blog-grid',
          start: 'top 80%',
        }
      })

      // Featured card special animation
      gsap.from('.featured-card', {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.featured-card',
          start: 'top 80%',
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const featuredPost = posts.find(p => p.featured)
  const regularPosts = posts.filter(p => !p.featured)

  return (
    <section id="blog" ref={sectionRef} className="blog-section section">
      {/* Neon Beams */}
      <div className="neon-beams">
        <div className="neon-beam beam-1"></div>
        <div className="neon-beam beam-2"></div>
        <div className="neon-beam beam-3"></div>
      </div>

      <div className="blog-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">[ NEURAL TRANSMISSIONS ]</span>
          <h2 className="section-title">
            <span className="title-icon">◆</span>
            Thought Stream
          </h2>
          <p className="section-subtitle">
            Insights, tutorials, and explorations from the digital frontier
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <article className="featured-card glass-panel hoverable">
            <div className="featured-image">
              <img src={featuredPost.image} alt={featuredPost.title} loading="lazy" />
              <div className="image-overlay"></div>
              <span className="featured-badge">
                <span className="badge-icon">★</span>
                Featured
              </span>
            </div>
            <div className="featured-content">
              <div className="post-meta">
                <span className="post-category">{featuredPost.category}</span>
                <span className="post-date">{featuredPost.date}</span>
                <span className="post-read-time">{featuredPost.readTime}</span>
              </div>
              <h3 className="post-title">{featuredPost.title}</h3>
              <p className="post-excerpt">{featuredPost.excerpt}</p>
              <a href="#" className="read-more hoverable">
                <span className="read-more-text">Read Full Article</span>
                <span className="read-more-icon">→</span>
              </a>
            </div>
            <div className="featured-glow"></div>
          </article>
        )}

        {/* Blog Grid */}
        <div className="blog-grid">
          {regularPosts.map((post) => (
            <article key={post.id} className="blog-card hoverable">
              <div className="card-image">
                <img src={post.image} alt={post.title} loading="lazy" />
                <div className="image-overlay"></div>
              </div>
              <div className="card-content">
                <div className="post-meta">
                  <span className="post-category">{post.category}</span>
                  <span className="post-date">{post.date}</span>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="card-footer">
                  <span className="post-read-time">{post.readTime}</span>
                  <a href="#" className="read-more hoverable">
                    <span className="read-more-text">Read</span>
                    <span className="read-more-icon">→</span>
                  </a>
                </div>
              </div>
              <div className="card-border"></div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="blog-footer">
          <a href="#" className="cyber-btn hoverable">
            <span className="btn-icon">◇</span>
            View All Posts
          </a>
        </div>
      </div>

      {/* HUD Elements */}
      <div className="hud-corner top-left"></div>
      <div className="hud-corner top-right"></div>
      <div className="hud-corner bottom-left"></div>
      <div className="hud-corner bottom-right"></div>
    </section>
  )
}

export default BlogSection
