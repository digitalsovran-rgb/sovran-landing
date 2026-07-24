import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <>
      <style>{`
        .hero-desc-mobile { display: none; }
        @media (max-width: 767px) {
          .hero-h1 { font-size: clamp(24px, 6.5vw, 32px) !important; font-weight: 800 !important; }
          .hero-label { font-size: 10px !important; margin-bottom: 24px !important; font-weight: 600 !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
          .hero-desc { font-size: 13px !important; font-weight: 500 !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
          .hero-desc-desktop { display: none !important; }
          .hero-desc-mobile { display: block !important; }
        }
      `}</style>
      <section
        id="hero"
        style={{
          position: 'relative',
          height: '90vh',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Background */}
        <motion.div
          className="hero-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/media/heroepic.png?v=3)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.35)',
          }}
        />

        {/* Bottom gradient fade — blends the hero image into the dark section below */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.28) 55%, #0a0a0a 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Logo — sits where a navbar would, confined to the hero.
            Positioning lives on a plain (non-motion) wrapper: framer-motion writes its own
            `transform` for animated values, which would clobber a static translateX(-50%). */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
          }}
        >
          <motion.img
            src="/media/logo-sovran-white.png"
            alt="Sovran"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'block',
              width: isMobile ? '120px' : '150px',
              height: 'auto',
            }}
          />
        </div>

        {/* Content */}
        <div
          className="hero-content"
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '120px 24px 0',
            width: '100%',
            maxWidth: '1000px',
          }}
        >
          <motion.p
            className="hero-label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              color: '#c9a96e',
              textTransform: 'uppercase',
              marginBottom: '40px',
            }}
          >
            Complimentary Concept Design Package
          </motion.p>

          <motion.h1
            className="hero-h1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{
              fontSize: 'clamp(36px, 5.8vw, 73px)',
              fontWeight: 900,
              color: '#ffffff',
              margin: '0 auto',
              lineHeight: 1.05,
              letterSpacing: '-0.005em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            A Complete Design Package To Support Your Extension.
          </motion.h1>

          <motion.p
            className="hero-desc hero-desc-desktop"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '560px',
              margin: '40px auto 0',
              lineHeight: 1.75,
              letterSpacing: 'normal',
            }}
          >
            Sovran is offering a complimentary Home Transformation Blueprint — floor plans, 3D visuals, moodboard, and a full project proposal, built around your home.
          </motion.p>

          <motion.p
            className="hero-desc hero-desc-mobile"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '560px',
              margin: '40px auto 0',
              lineHeight: 1.75,
              letterSpacing: 'normal',
            }}
          >
            Sovran is offering a complimentary Home Transformation Blueprint — floor plans, 3D visuals, moodboard, and a full project proposal, built around your home.
          </motion.p>
        </div>
      </section>
    </>
  );
}
