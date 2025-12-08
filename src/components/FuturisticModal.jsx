import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './FuturisticModal.css';

function FuturisticModal({ isOpen, onClose, title, content, color = '#00f5ff' }) {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!modalRef.current || !backdropRef.current) return;

    const modalPanel = modalRef.current.querySelector('.modal-panel');
    const scanLines = modalRef.current.querySelectorAll('.scan-line');

    if (isOpen) {
      // Opening animation
      gsap.set(modalRef.current, { display: 'flex' });
      
      const tl = gsap.timeline();
      
      tl.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      
      if (modalPanel) {
        tl.fromTo(modalPanel,
          { scale: 0, rotationY: -90, opacity: 0 },
          { scale: 1, rotationY: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' },
          '-=0.1'
        );
      }
      
      if (scanLines.length > 0) {
        tl.fromTo(scanLines,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.3, stagger: 0.05 },
          '-=0.3'
        );
      }
      
      if (contentRef.current) {
        tl.fromTo(contentRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.2'
        );
      }
    } else {
      // Closing animation
      const tl = gsap.timeline();
      
      if (contentRef.current) {
        tl.to(contentRef.current, { opacity: 0, y: -20, duration: 0.2 });
      }
      
      if (modalPanel) {
        tl.to(modalPanel,
          { scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in' },
          '-=0.1'
        );
      }
      
      tl.to(backdropRef.current, { opacity: 0, duration: 0.2 }, '-=0.2')
        .set(modalRef.current, { display: 'none' });
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <div 
      className="modal-container" 
      ref={modalRef}
      style={{ '--modal-color': color }}
    >
      <div 
        className="modal-backdrop" 
        ref={backdropRef}
        onClick={onClose}
      />
      
      <div className="modal-panel">
        {/* Corner decorations */}
        <div className="panel-corner top-left"></div>
        <div className="panel-corner top-right"></div>
        <div className="panel-corner bottom-left"></div>
        <div className="panel-corner bottom-right"></div>
        
        {/* Scan lines */}
        <div className="scan-line top"></div>
        <div className="scan-line bottom"></div>
        
        {/* Header */}
        <div className="modal-header">
          <div className="header-decoration left">
            <span className="deco-bracket">[</span>
            <span className="deco-dots">•••</span>
          </div>
          
          <h2 className="modal-title">{title}</h2>
          
          <div className="header-decoration right">
            <span className="deco-dots">•••</span>
            <span className="deco-bracket">]</span>
          </div>
          
          <button className="close-btn" onClick={onClose}>
            <span className="close-icon">×</span>
            <span className="close-text">ESC</span>
          </button>
        </div>
        
        {/* Content */}
        <div className="modal-content" ref={contentRef}>
          {content.subtitle && (
            <p className="content-subtitle">{content.subtitle}</p>
          )}
          
          {content.text && (
            <p className="content-text">{content.text}</p>
          )}
          
          {content.stats && (
            <div className="content-stats">
              {content.stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
          
          {content.list && (
            <ul className="content-list">
              {content.list.map((item, index) => (
                <li key={index}>
                  <span className="list-marker">▹</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
          
          {content.links && (
            <div className="content-links">
              {content.links.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="modal-link"
                >
                  <span className="link-icon">{link.icon || '→'}</span>
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-line"></div>
          <span className="footer-text">CLICK OUTSIDE OR PRESS ESC TO CLOSE</span>
          <div className="footer-line"></div>
        </div>
        
        {/* Animated border */}
        <div className="animated-border">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect 
              x="0.5" 
              y="0.5" 
              width="99" 
              height="99"
              fill="none"
              stroke="url(#borderGradient)"
              strokeWidth="0.5"
              className="border-path"
            />
            <defs>
              <linearGradient id="borderGradient" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor="var(--modal-color)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--modal-color)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--modal-color)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default FuturisticModal;
