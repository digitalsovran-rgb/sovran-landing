import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Clock } from 'lucide-react';

function GoogleGIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );
}

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

          {/* Social proof strip — sits just above the gradient fade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              margin: `${isMobile ? '24px' : '32px'} auto 0`,
              maxWidth: '900px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: isMobile ? '8px' : '24px',
              padding: isMobile ? '0 12px' : '0',
              marginLeft: isMobile ? '-24px' : 'auto',
              marginRight: isMobile ? '-24px' : 'auto',
              width: isMobile ? 'calc(100% + 48px)' : undefined,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: '1 1 0', minWidth: 0 }}>
              <GoogleGIcon size={22} />
              <span
                style={{
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: 700,
                  color: '#f5f0eb',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                4.9 <span style={{ color: '#c9a96e' }}>★★★★★</span>
              </span>
              <span
                style={{
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: 700,
                  color: '#f5f0eb',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  textShadow: '0 1px 3px rgba(0,0,0,0.85)',
                }}
              >
                Rated Excellent
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: '1 1 0', minWidth: 0 }}>
              <Home size={22} color="#f5f0eb" strokeWidth={1.75} />
              <span
                style={{
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: 700,
                  color: '#f5f0eb',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                1,000+ Properties
              </span>
              <span
                style={{
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: 700,
                  color: '#f5f0eb',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  textShadow: '0 1px 3px rgba(0,0,0,0.85)',
                }}
              >
                Transformed
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: '1 1 0', minWidth: 0 }}>
              <Clock size={22} color="#f5f0eb" strokeWidth={1.75} />
              <span
                style={{
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: 700,
                  color: '#f5f0eb',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                15+ Years
              </span>
              <span
                style={{
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: 700,
                  color: '#f5f0eb',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  textShadow: '0 1px 3px rgba(0,0,0,0.85)',
                }}
              >
                Experience
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
