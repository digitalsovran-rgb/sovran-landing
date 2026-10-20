import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// What the design pack contains, shown as a checklist under the headline.
const HERO_CHECKLIST = ['Floor plans', '3D visuals', 'A mood board', 'A full project proposal'];

// Fixed logo geometry. The image is 800 by 222, so its rendered height follows from its width.
const LOGO_TOP = 24;
const LOGO_RATIO = 222 / 800;
// The hero content must start at least this far below the logo's bottom edge.
const LOGO_CLEARANCE = 48;

const desktopVideos = ['/media/vidher1.mp4', '/media/vidher2.mp4', '/media/vidher3.mp4'];
const desktopPosters = ['/media/vidher1-poster.webp', '/media/vidher2-poster.webp', '/media/vidher3-poster.webp'];
const mobileVideos = ['/media/vidher1mob.mp4', '/media/vidher2mob.mp4', '/media/vidher3mob.mp4'];
const mobilePosters = ['/media/vidher1mob-poster.webp', '/media/vidher2mob-poster.webp', '/media/vidher3mob-poster.webp'];

const CLIP_COUNT = 3;
const TRIGGER_S = 2.5;
const FADE_MS = 500;
const CLEANUP_MS = 600;

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
  const [failed, setFailed] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [skipVideo] = useState(shouldSkipVideo);

  const logoWidth = isMobile ? 120 : 150;
  const logoBottom = LOGO_TOP + logoWidth * LOGO_RATIO;
  const heroPaddingTop = Math.max(Math.ceil(logoBottom + LOGO_CLEARANCE), isMobile ? 96 : 140);

  const videos = isMobile ? mobileVideos : desktopVideos;
  const posters = isMobile ? mobilePosters : desktopPosters;
  const showStatic = skipVideo || failed;

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null]);
  const activeRef = useRef(0);
  const stoppedRef = useRef(false);
  const warmedRef = useRef(false);
  // One flag per clip so its crossfade can only start once per play-through.
  const guardRef = useRef<boolean[]>([false, false, false]);
  const timersRef = useRef<number[]>([]);
  const cleanupsRef = useRef<(() => void)[]>([]);

  // Crossing the breakpoint swaps the clip set, so the sequence restarts from clip 1.
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

  const later = (fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };

  // One-shot listener that is also removed if the component unmounts or restarts first.
  const listenOnce = (el: HTMLVideoElement, type: string, fn: () => void) => {
    const handler = () => {
      el.removeEventListener(type, handler);
      fn();
    };
    el.addEventListener(type, handler);
    cleanupsRef.current.push(() => el.removeEventListener(type, handler));
  };

  const clearAll = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    cleanupsRef.current.forEach((fn) => fn());
    cleanupsRef.current = [];
  };

  // The first clip could not start (autoplay blocked, low power mode): fall back to the poster.
  const stopRotation = () => {
    stoppedRef.current = true;
    clearAll();
    setFailed(true);
  };

  // A later clip could not start: freeze the rotation and leave the current clip on screen.
  const haltRotation = () => {
    stoppedRef.current = true;
    clearAll();
  };

  // Clips 2 and 3 stay at metadata only until clip 1 is actually playing, so they never
  // compete with the first poster and clip for bandwidth.
  const warmOtherClips = () => {
    if (warmedRef.current) return;
    warmedRef.current = true;
    for (let i = 1; i < CLIP_COUNT; i++) {
      const el = videoRefs.current[i];
      if (!el) continue;
      el.preload = 'auto';
      el.load();
    }
  };

  const crossfade = (from: number) => {
    if (stoppedRef.current || activeRef.current !== from || guardRef.current[from]) return;
    guardRef.current[from] = true;

    const to = (from + 1) % CLIP_COUNT;
    const current = videoRefs.current[from];
    const next = videoRefs.current[to];
    if (!current || !next) return;

    const startFade = () => {
      if (stoppedRef.current) return;
      activeRef.current = to;
      const transition = `opacity ${FADE_MS}ms ease`;
      current.style.transition = transition;
      next.style.transition = transition;
      next.style.zIndex = '2';
      current.style.zIndex = '1';
      next.style.opacity = '1';
      current.style.opacity = '0';

      later(() => {
        current.pause();
        current.currentTime = 0;
        current.style.transition = 'none';
        current.style.opacity = '0';
        current.style.zIndex = '0';
        guardRef.current[from] = false;
      }, CLEANUP_MS);
    };

    const begin = () => {
      if (stoppedRef.current) return;
      next.currentTime = 0;
      const started = next.play();
      if (!started) return;
      started
        .then(() => {
          if (stoppedRef.current) return;
          if ('requestVideoFrameCallback' in next) {
            const handle = next.requestVideoFrameCallback(() => startFade());
            cleanupsRef.current.push(() => next.cancelVideoFrameCallback(handle));
          } else {
            listenOnce(next, 'playing', startFade);
          }
        })
        .catch(haltRotation);
    };

    // The incoming clip must be able to play through before the fade starts. Until then the
    // current clip stays on screen, holding its last frame if it has already finished.
    if (next.readyState < 3) {
      listenOnce(next, 'canplay', begin);
    } else {
      begin();
    }
  };

  const handleTimeUpdate = (index: number) => {
    if (index !== activeRef.current) return;
    const el = videoRefs.current[index];
    if (el && el.currentTime >= TRIGGER_S) crossfade(index);
  };

  const handlePlaying = (index: number) => {
    if (index === 0) warmOtherClips();
  };

  // (Re)start the sequence from clip 1 on mount and whenever the breakpoint flips.
  useEffect(() => {
    if (showStatic) return;
    activeRef.current = 0;
    stoppedRef.current = false;
    warmedRef.current = false;
    guardRef.current = [false, false, false];

    const first = videoRefs.current[0];
    if (first) {
      first.muted = true;
      first.play()?.catch(stopRotation);
    }
    return clearAll;
    // stopRotation and clearAll only touch refs and stable setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, showStatic]);

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
        {/* Background: three short clips stacked, one visible at a time. The next clip fades in
            over the current one, so there is no dip between clips. */}
        {/* isolation keeps the clips' own z-index values inside this wrapper, so the overlay and
            scrim below always paint on top of whichever clip is showing. */}
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', isolation: 'isolate' }}>
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
                onTimeUpdate={() => handleTimeUpdate(i)}
                onEnded={() => crossfade(i)}
                style={{
                  ...coverStyle,
                  opacity: i === 0 ? 1 : 0,
                  zIndex: i === 0 ? 1 : 0,
                  willChange: 'opacity',
                  transform: 'translateZ(0)',
                }}
              />
            ))
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
            padding (24px on mobile), and the block itself is centred horizontally. */}
        <div className="inner" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div
          className="hero-content"
          style={{
            textAlign: 'center',
            width: '100%',
            maxWidth: isMobile ? '100%' : 760,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          {/* Not Framer Motion-animated (unlike its siblings): this checklist is the likely LCP
              element on mobile, and animating it would delay the final paint LCP measures.
              The group is centred while the ticks inside stay left-aligned under each other. */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: isMobile ? 22 : 28 }}>
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
              textAlign: 'center',
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
            style={{ marginTop: isMobile ? 24 : 28, alignSelf: 'center' }}
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
