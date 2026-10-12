import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const desktopVideos = ['/media/vidher1.mp4', '/media/vidher2.mp4', '/media/vidher3.mp4'];
const desktopPosters = ['/media/vidher1-poster.webp', '/media/vidher2-poster.webp', '/media/vidher3-poster.webp'];
const mobileVideos = ['/media/vidher1mob.mp4', '/media/vidher2mob.mp4', '/media/vidher3mob.mp4'];
const mobilePosters = ['/media/vidher1mob-poster.webp', '/media/vidher2mob-poster.webp', '/media/vidher3mob-poster.webp'];

const FADE_MS = 400;
const REVEAL_FALLBACK_MS = 200;
const END_FALLBACK_MS = 3300;
const WARM_DELAY_MS = 1500;

// Reduced motion and data saver users get the first poster as a still image, no video at all.
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
  const [active, setActive] = useState(0);
  const [blackVisible, setBlackVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [skipVideo] = useState(shouldSkipVideo);

  const videos = isMobile ? mobileVideos : desktopVideos;
  const posters = isMobile ? mobilePosters : desktopPosters;
  const showStatic = skipVideo || failed;

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null]);
  const activeRef = useRef(0);
  const lockRef = useRef(false);
  const stoppedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const fallbackRef = useRef<number | null>(null);
  const pendingRevealRef = useRef<(() => void) | null>(null);

  // Crossing the breakpoint swaps the clip set, so the sequence restarts from clip 1.
  useEffect(() => {
    let wasMobile = window.innerWidth < 768;
    const handler = () => {
      const nowMobile = window.innerWidth < 768;
      if (nowMobile === wasMobile) return;
      wasMobile = nowMobile;
      setIsMobile(nowMobile);
      setActive(0);
      setBlackVisible(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  const clearFallback = () => {
    if (fallbackRef.current !== null) {
      window.clearTimeout(fallbackRef.current);
      fallbackRef.current = null;
    }
  };

  const clearAllTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    clearFallback();
  };

  // A rejected play() (autoplay blocked, low power mode) ends the rotation and leaves the
  // first poster on screen.
  const stopRotation = () => {
    stoppedRef.current = true;
    pendingRevealRef.current = null;
    clearAllTimers();
    setBlackVisible(false);
    setFailed(true);
  };

  const startTransition = (from: number) => {
    if (stoppedRef.current || lockRef.current || activeRef.current !== from) return;
    lockRef.current = true;
    clearFallback();
    setBlackVisible(true);

    later(() => {
      if (stoppedRef.current) return;
      videoRefs.current[from]?.pause();

      const to = (from + 1) % 3;
      const next = videoRefs.current[to];
      activeRef.current = to;
      setActive(to);

      let revealed = false;
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        pendingRevealRef.current = null;
        setBlackVisible(false);
        lockRef.current = false;
      };
      pendingRevealRef.current = reveal;
      later(reveal, REVEAL_FALLBACK_MS);

      if (next) {
        next.currentTime = 0;
        next.play()?.catch(stopRotation);
      }
    }, FADE_MS);
  };

  const handlePlaying = (index: number) => {
    if (index !== activeRef.current || stoppedRef.current) return;
    pendingRevealRef.current?.();
    clearFallback();
    fallbackRef.current = window.setTimeout(() => startTransition(index), END_FALLBACK_MS);
  };

  // (Re)start the sequence from clip 1 on mount and whenever the breakpoint flips.
  useEffect(() => {
    if (showStatic) return;
    activeRef.current = 0;
    lockRef.current = false;
    stoppedRef.current = false;
    pendingRevealRef.current = null;

    const first = videoRefs.current[0];
    if (first) {
      first.muted = true;
      first.play()?.catch(stopRotation);
    }
    return clearAllTimers;
    // stopRotation and clearAllTimers only touch refs and stable setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, showStatic]);

  // Clips 2 and 3 only load metadata until the page has finished loading, so they never
  // compete with the first poster and clip for bandwidth.
  useEffect(() => {
    if (showStatic) return;
    let timer: number | undefined;
    const warm = () => {
      timer = window.setTimeout(() => {
        [1, 2].forEach((i) => {
          const el = videoRefs.current[i];
          if (el) el.preload = 'auto';
        });
      }, WARM_DELAY_MS);
    };

    if (document.readyState === 'complete') {
      warm();
    } else {
      window.addEventListener('load', warm, { once: true });
    }
    return () => {
      window.removeEventListener('load', warm);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [isMobile, showStatic]);

  const scrollToForm = () => {
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        .hero-desc-mobile { display: none; }
        @media (min-width: 768px) {
          /* Reserved (not flex-computed) space between the fixed logo and the eyebrow, so
             the gap holds even at short desktop viewport heights (e.g. 1280x720 laptop
             windows) where the top flex spacer would otherwise collapse toward zero. */
          .hero-content { padding-top: 110px !important; padding-bottom: 110px !important; }
        }
        @media (max-width: 767px) {
          .hero-content { padding-bottom: 60px !important; }
          .hero-h1 { font-size: clamp(26px, 7.1vw, 35px) !important; font-weight: 900 !important; }
          .hero-label { font-size: 10px !important; margin-bottom: 24px !important; font-weight: 600 !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
          .hero-desc { font-size: 14.3px !important; font-weight: 500 !important; text-shadow: 0 2px 8px rgba(0,0,0,0.5) !important; }
          .hero-desc-desktop { display: none !important; }
          .hero-desc-mobile { display: block !important; }
          .hero-cta-wrap { width: calc(100% + 16px) !important; margin-left: -8px !important; margin-right: -8px !important; }
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
          minHeight: 'max(90vh, 600px)',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Background: three short clips stacked, one visible at a time. A black layer fades
            in between clips so the cut reads as a dip to black rather than a hard swap. */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {showStatic ? (
            <img
              src={posters[0]}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              loading="eager"
              style={coverStyle}
            />
          ) : (
            videos.map((src, i) => (
              <video
                key={`${isMobile ? 'm' : 'd'}-${i}`}
                ref={(el) => {
                  videoRefs.current[i] = el;
                  if (el) el.muted = true;
                }}
                src={src}
                poster={posters[i]}
                muted
                playsInline
                autoPlay={i === 0}
                preload={i === 0 ? 'auto' : 'metadata'}
                aria-hidden="true"
                tabIndex={-1}
                disablePictureInPicture
                onPlaying={() => handlePlaying(i)}
                onEnded={() => startTransition(i)}
                style={{ ...coverStyle, opacity: active === i ? 1 : 0 }}
              />
            ))
          )}
        </div>

        {/* Black layer used for the dip between clips */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000000',
            opacity: blackVisible ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease`,
            pointerEvents: 'none',
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

        {/* Bottom gradient fade: blends the hero into the dark section below */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '30%',
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
            top: '24px',
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
              width: isMobile ? '120px' : '150px',
              height: 'auto',
            }}
          />
        </div>

        {/* Content: the headline is the vertical anchor, not the group. The two flex:1
            spacers above and below it always claim equal leftover space, so the headline's
            own center lands at the section's true vertical center regardless of how tall the
            eyebrow or the subhead and button cluster are; each spacer's inner justifyContent
            keeps its content flush against the headline, preserving the existing margins.
            The bottom padding is a hard reservation (not space left over from flex-grow), so
            it guarantees the button-to-section-edge gap at any hero or viewport height. */}
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
                color: 'var(--sov-greige-light)',
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
          {/* Not Framer Motion-animated (unlike its siblings): this paragraph is the confirmed
              LCP element on mobile, and animating it delays the final paint LCP measures. */}
          <p
            className="hero-desc hero-desc-desktop"
            style={{
              fontSize: '17.6px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '560px',
              margin: '40px auto 0',
              lineHeight: 1.75,
              letterSpacing: 'normal',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            Sovran is offering a complimentary Home Transformation Blueprint for a limited period — floor plans, 3D visuals, moodboard, and a full project proposal, built around your home extension project.
          </p>

          {/* Not Framer Motion-animated (unlike its siblings): this paragraph is the confirmed
              LCP element on mobile, and animating it delays the final paint LCP measures. */}
          <p
            className="hero-desc hero-desc-mobile"
            style={{
              fontSize: '17.6px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '560px',
              margin: '40px auto 0',
              lineHeight: 1.75,
              letterSpacing: 'normal',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            Sovran is offering a complimentary Home Transformation Blueprint for a limited period — floor plans, 3D visuals, moodboard, and a full project proposal, built around your home extension project.
          </p>

          <motion.div
            className="hero-cta-wrap"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            style={{ marginTop: '40px' }}
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
                backgroundColor: ctaHovered ? 'var(--sov-black)' : 'var(--sov-greige-dark)',
                color: 'var(--sov-white)',
                border: '1px solid var(--sov-greige-light)',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                padding: '18px 56px',
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
