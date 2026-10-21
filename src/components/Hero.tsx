import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// What the design pack contains, shown as a checklist under the headline.
const HERO_CHECKLIST = ['Floor plans', '3D visuals', 'A mood board', 'A full project proposal'];

// Fixed logo geometry. The image is 800 by 222, so its rendered height follows from its width.
const LOGO_TOP = 24;
const LOGO_RATIO = 222 / 800;
// The hero content must start at least this far below the logo's bottom edge.
const LOGO_CLEARANCE = 48;

// Reduced motion and data saver users get the poster as a still image, no video at all.
function shouldSkipVideo(): boolean {
  if (typeof window === 'undefined') return false;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return reduced || Boolean(connection?.saveData);
}

const coverStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
};

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [skipVideo] = useState(shouldSkipVideo);

  const logoWidth = isMobile ? 120 : 150;
  const logoBottom = LOGO_TOP + logoWidth * LOGO_RATIO;
  const heroPaddingTop = Math.max(Math.ceil(logoBottom + LOGO_CLEARANCE), isMobile ? 96 : 140);

  const videoSrc = isMobile ? '/media/hero-mob.mp4' : '/media/hero-pc.mp4';
  const posterSrc = isMobile ? '/media/hero-mob-poster.webp' : '/media/hero-pc-poster.webp';

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Crossing the breakpoint swaps the video, which then loads from the start.
  useEffect(() => {
    let wasMobile = window.innerWidth < 768;
    const handler = () => {
      const nowMobile = window.innerWidth < 768;
      if (nowMobile === wasMobile) return;
      wasMobile = nowMobile;
      setIsMobile(nowMobile);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // iOS only autoplays a video that is muted as both a property and an attribute, and plays
  // inline. React does not render the muted attribute, so all of this is set here, before
  // the source is assigned.
  const setVideoRef = useCallback(
    (el: HTMLVideoElement | null) => {
      videoRef.current = el;
      if (!el) return;
      el.muted = true;
      el.defaultMuted = true;
      el.setAttribute('muted', '');
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', '');
      if (el.getAttribute('src') !== videoSrc) el.src = videoSrc;
    },
    [videoSrc]
  );

  // Backs up autoPlay: tries again once data arrives, when the tab becomes visible, and on the
  // first touch, pointer or scroll (some iPhones, for example in Low Power Mode, only allow
  // playback after an interaction). If playback is refused, the poster stays on screen.
  // The key on the video remounts it at the breakpoint, so this reruns for the new element.
  useEffect(() => {
    if (skipVideo) return;
    const el = videoRef.current;
    if (!el) return;

    const gestureEvents = ['touchstart', 'pointerdown', 'scroll'] as const;

    function removeGestureListeners() {
      gestureEvents.forEach((type) => window.removeEventListener(type, tryPlay));
    }

    function tryPlay() {
      if (!el || !el.paused) return;
      el.play()?.then(removeGestureListeners).catch(() => {});
    }

    function handleVisibility() {
      if (document.visibilityState === 'visible') tryPlay();
    }

    el.addEventListener('loadeddata', tryPlay);
    el.addEventListener('canplay', tryPlay);
    el.addEventListener('playing', removeGestureListeners);
    document.addEventListener('visibilitychange', handleVisibility);
    gestureEvents.forEach((type) => window.addEventListener(type, tryPlay, { passive: true }));
    tryPlay();

    return () => {
      el.removeEventListener('loadeddata', tryPlay);
      el.removeEventListener('canplay', tryPlay);
      el.removeEventListener('playing', removeGestureListeners);
      document.removeEventListener('visibilitychange', handleVisibility);
      removeGestureListeners();
    };
  }, [isMobile, skipVideo]);

  const scrollToForm = () => {
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        /* Full-screen hero. There is deliberately no fixed height: tall content grows the section
           instead of overflowing upward over the logo. The !important on min-height beats the
           older mobile rule in index.css (#hero min-height: max(78vh, 480px) !important), which
           this style block follows in the cascade. */
        #hero {
          min-height: 100vh;
          min-height: 100svh !important;
        }
        @media (max-width: 767px) {
          .hero-h1 { font-size: clamp(30px, 8.4vw, 41px) !important; font-weight: 900 !important; }
          .hero-cta-wrap { width: 100% !important; }
          .hero-cta-btn {
            width: 100% !important;
            min-height: 48px !important;
            padding: 12px 32px !important;
            font-size: 13px !important;
            letter-spacing: 0.12em !important;
          }
        }
      `}</style>
      <section
        id="hero"
        data-bg="dark"
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: `${heroPaddingTop}px`,
          paddingBottom: isMobile ? '56px' : '72px',
          boxSizing: 'border-box',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Background: one looping video per breakpoint. The key remounts it when the
            breakpoint flips, so the matching file loads. */}
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', isolation: 'isolate' }}>
          {skipVideo ? (
            <img
              src={posterSrc}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              loading="eager"
              style={coverStyle}
            />
          ) : (
            <video
              key={isMobile ? 'mob' : 'pc'}
              ref={setVideoRef}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              disablePictureInPicture
              style={coverStyle}
            />
          )}
        </div>

        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.40)',
          }}
        />

        {/* Text scrim: a soft dark ellipse behind the headline block for legibility over bright
            frames. Same stacking level as the overlay, below the content block. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: isMobile
              ? 'radial-gradient(ellipse 120% 40% at 50% 50%, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.38) 40%, rgba(0,0,0,0) 100%)'
              : 'radial-gradient(ellipse 70% 45% at 50% 50%, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.38) 35%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* Bottom gradient fade: blends the hero into the dark section below */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: isMobile ? '12%' : '30%',
            background: 'linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.28) 55%, #0A0A0A 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Logo: sits where a navbar would, confined to the hero.
            Positioning lives on a plain (non-motion) wrapper because framer-motion writes its
            own `transform` for animated values, which would clobber a static translateX(-50%). */}
        <div
          style={{
            position: 'absolute',
            top: `${LOGO_TOP}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
          }}
        >
          <motion.img
            src="/media/logo-sovran-white.webp"
            alt="Sovran"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'block',
              width: `${logoWidth}px`,
              height: 'auto',
            }}
          />
        </div>

        {/* Content: the section is a centred flex column with its own top and bottom padding
            (room for the logo above, breathing space below), so this block sits in the
            vertical middle of the full-height hero. The .inner wrapper keeps the page's side
            padding (24px on mobile). The block sits in the middle of the page, the headline is
            centred within it, and everything below the headline is left-aligned. */}
        <div className="inner" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div
          className="hero-content"
          style={{
            textAlign: 'left',
            width: '100%',
            maxWidth: isMobile ? '100%' : 760,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <motion.h1
            className="hero-h1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{
              fontSize: 'clamp(36px, 4.6vw, 62px)',
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              width: '100%',
              textAlign: 'center',
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
              wordSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            A Complimentary Design Pack For Your Home.
          </motion.h1>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' }}>
          {/* Not Framer Motion-animated (unlike its siblings): this checklist is the likely LCP
              element on mobile, and animating it would delay the final paint LCP measures. */}
          <div style={{ marginTop: isMobile ? 22 : 28 }}>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'grid',
                gap: isMobile ? 10 : 12,
                textAlign: 'left',
              }}
            >
              {HERO_CHECKLIST.map((item) => (
                <li
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: '#FFFFFF',
                    fontSize: isMobile ? 16 : 17,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  }}
                >
                  <Check
                    size={isMobile ? 17 : 18}
                    strokeWidth={2.2}
                    color="#C2B2A0"
                    aria-hidden="true"
                    style={{ flex: '0 0 auto', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p
            style={{
              textAlign: 'left',
              margin: '20px 0 0',
              fontSize: isMobile ? 12 : 12.5,
              letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.72)',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}
          >
            Included with every construction project over £100K.
          </p>

          <motion.div
            className="hero-cta-wrap"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            style={{ marginTop: isMobile ? 24 : 28, alignSelf: 'flex-start' }}
          >
            <button
              type="button"
              className="hero-cta-btn"
              onClick={scrollToForm}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60px',
                backgroundColor: 'var(--sov-greige-light)',
                color: '#FFFFFF',
                textShadow: '0 1px 2px rgba(74,68,60,0.85), 0 0 10px rgba(74,68,60,0.55)',
                border: 'none',
                borderRadius: '12px',
                transform: ctaHovered ? 'translateY(-1px)' : 'none',
                boxShadow: ctaHovered ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                padding: '18px 56px',
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease',
              }}
            >
              Get My Design Pack
            </button>
          </motion.div>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
