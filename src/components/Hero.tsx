import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const desktopImages = ['/media/heroepic.png', '/media/heroepic1.png', '/media/heroepic2.png'];
const mobileImages = ['/media/heroepicel.png', '/media/heroepicel1.png', '/media/heroepicel2.png'];

const HOLD_MS = 6000;
const CROSSFADE_S = 1.5;

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [index, setIndex] = useState(0);
  const [ctaHovered, setCtaHovered] = useState(false);
  const images = isMobile ? mobileImages : desktopImages;

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Preload every frame for the current viewport up front, so the browser already has each
  // image cached by the time its turn in the rotation arrives — no flash or load delay.
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    setIndex(0);
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [images]);

  const scrollToForm = () => {
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        .hero-desc-mobile { display: none; }
        @media (max-width: 767px) {
          .hero-content { padding-bottom: 60px !important; }
          .hero-h1 { font-size: clamp(26px, 7.1vw, 35px) !important; font-weight: 900 !important; }
          .hero-label { font-size: 10px !important; margin-bottom: 24px !important; font-weight: 600 !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
          .hero-desc { font-size: 13px !important; font-weight: 500 !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
          .hero-desc-desktop { display: none !important; }
          .hero-desc-mobile { display: block !important; }
        }
      `}</style>
      <section
        id="hero"
        data-bg="dark"
        style={{
          position: 'relative',
          height: '90vh',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Background — rotating 3-image sequence, each held with a slow Ken Burns zoom and
            crossfaded into the next so the hero reads as continuous motion, not a slideshow. */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <AnimatePresence>
            <motion.div
              key={images[index]}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.04 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: CROSSFADE_S, ease: 'easeInOut' },
                scale: { duration: (HOLD_MS + CROSSFADE_S * 1000) / 1000, ease: 'linear' },
              }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${images[index]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </AnimatePresence>
        </div>

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

        {/* Content — the headline is the vertical anchor, not the group. The two flex:1
            spacers above/below it always claim equal leftover space, so the headline's own
            center lands at the section's true vertical center regardless of how tall the
            eyebrow or the subhead+button cluster are; each spacer's inner justifyContent
            keeps its content flush against the headline, preserving the existing margins.
            The bottom padding is a hard reservation (not space left over from flex-grow), so
            it guarantees the button-to-section-edge gap at any hero/viewport height — a fixed
            translateY nudge would only have held at the one height it was tuned against. */}
        <div
          className="hero-content"
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '0 24px',
            paddingBottom: '80px',
            width: '100%',
            maxWidth: '1000px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
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
          </div>

          <motion.h1
            className="hero-h1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{
              fontSize: 'clamp(39px, 6.3vw, 80px)',
              fontWeight: 900,
              color: '#ffffff',
              margin: '0 auto',
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            A Complete Design Package To Support Your Extension.
          </motion.h1>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            style={{ marginTop: '40px' }}
          >
            <button
              type="button"
              onClick={scrollToForm}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              style={{
                backgroundColor: ctaHovered ? '#f5f0eb' : '#ffffff',
                color: '#0a0a0a',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                padding: '16px 40px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
            >
              Claim Offer
            </button>
          </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
