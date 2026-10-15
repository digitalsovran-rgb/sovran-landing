import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

// Public URL folder holding the project images (public/media).
const URL_DIR = '/media';

const PROJECTS = [
  {
    title: 'New Build',
    location: 'Cobham, KT11',
    desc: 'A stone country house with an arched loggia, made for long summer evenings in the garden.',
    img: `${URL_DIR}/country1.webp`,
  },
  {
    title: 'Full Renovation',
    location: 'Beaconsfield, HP9',
    desc: 'A red brick Georgian house restored to full proportion, with a still pond along the approach.',
    img: `${URL_DIR}/country2.webp`,
  },
  {
    title: 'Townhouse Renovation',
    location: 'Chelsea, SW3',
    desc: 'A dark joinery kitchen with a marble island, opening onto the dining room and the light from the tall windows.',
    img: `${URL_DIR}/centralone.webp`,
  },
  {
    title: 'Basement Conversion',
    location: 'Holland Park, W11',
    desc: 'A pool and spa floor built below ground, with daylight reaching the water.',
    img: `${URL_DIR}/basement.webp`,
  },
  {
    title: 'New Build',
    location: 'Virginia Water, GU25',
    desc: 'A stone manor house that comes alive at dusk, with the pool and gardens framing the evening.',
    img: `${URL_DIR}/country3.webp`,
  },
];

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];
const EXIT_EASE: [number, number, number, number] = [0.4, 0, 0.9, 0.4];
const EXIT_MS = 650;
const DEAL_DONE_MS = 3300;
const AUTOPLAY_MS = 4500;
const LAST_DEPTH = PROJECTS.length - 1;

// How each card sits in the pile, by depth (0 is the top card).
const POSE_ROTATE = [0, -3.5, 3, -5.5, 4.5];
const POSE_X_MOBILE = [0, -8, 7, -12, 10];
const POSE_X_DESKTOP = [0, -16, 14, -24, 20];
const POSE_Y = [0, 5, 9, 13, 17];

// Cards are dealt deepest first (k = 0) so the pile ends with the first project on top.
const DEAL_DELAY = [0, 1.0, 1.6, 2.1, 2.5];
const DEAL_DURATION = [1.1, 0.9, 0.8, 0.7, 0.6];

const offscreen = () => (typeof window !== 'undefined' ? window.innerWidth * 1.1 : 1200);

// Width of the details panel that opens beside the pile on desktop.
const computePanelW = () => (typeof window !== 'undefined' ? Math.min(300, Math.max(240, window.innerWidth * 0.26)) : 280);

// Gap between the pile and the details panel when it is open.
const PANEL_GAP = 56;

// Space kept clear at the bottom of the viewport for the sticky offer bar on mobile:
// its 16px bottom offset + 56px mobile height + 20px breathing room.
const STICKY_RESERVE = 92;

export default function Projects() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [panelW, setPanelW] = useState(computePanelW);
  const [order, setOrder] = useState<number[]>(() => Array.from({ length: PROJECTS.length }, (_, i) => i));
  const [exitingId, setExitingId] = useState<number | null>(null);
  const [exitDir, setExitDir] = useState<-1 | 1>(1);
  const [dealt, setDealt] = useState(false);
  const [open, setOpen] = useState(false);

  const reduced = useReducedMotion();
  const stackRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  const dealInView = useInView(stackRef, { amount: 0.35, once: true });
  const liveInView = useInView(stackRef, { amount: 0.3 });
  const cycleRef = useRef(0);
  const exitTimerRef = useRef<number | null>(null);

  // Tap detection on the top card. A tap only counts if the pointer barely moved, was quick,
  // no drag started, and it is not the tail end of a drag that just finished.
  const downRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const movedRef = useRef(false);
  const suppressUntilRef = useRef(0);

  // With reduced motion there is no deal, so the pile counts as dealt from the start.
  const isDealt = Boolean(reduced) || dealt;

  useEffect(() => {
    const handler = () => {
      setIsMobile(window.innerWidth < 768);
      setPanelW(computePanelW());
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!dealInView || reduced) return;
    const timer = window.setTimeout(() => setDealt(true), DEAL_DONE_MS);
    return () => window.clearTimeout(timer);
  }, [dealInView, reduced]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  const advance = (dir: -1 | 1) => {
    setOpen(false);
    if (exitingId !== null || !isDealt) return;
    if (reduced) {
      setOrder((prev) => [...prev.slice(1), prev[0]]);
      return;
    }
    setExitingId(order[0]);
    setExitDir(dir);
    exitTimerRef.current = window.setTimeout(() => {
      setOrder((prev) => [...prev.slice(1), prev[0]]);
      setExitingId(null);
      exitTimerRef.current = null;
    }, EXIT_MS);
  };

  // Autoplay: the top card leaves every AUTOPLAY_MS while the pile is on screen and the
  // caption is closed. The timer restarts from zero whenever any of these inputs change.
  useEffect(() => {
    if (reduced || !isDealt || !liveInView || open || exitingId !== null) return;
    const timer = window.setTimeout(() => {
      advance(cycleRef.current++ % 2 === 0 ? -1 : 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
    // advance reads the same state that is listed here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, open, isDealt, liveInView, exitingId, reduced]);

  const toggleCaption = () => {
    if (!isDealt) return;
    setOpen(!open);
  };

  // Mobile: once the caption has finished opening, scroll just enough to bring its bottom above
  // the sticky offer bar, but never so far that the top of the pile leaves the screen.
  const ensureCaptionVisible = () => {
    const c = captionRef.current?.getBoundingClientRect();
    const s = stackRef.current?.getBoundingClientRect();
    if (!c || !s) return;
    const limit = window.innerHeight - STICKY_RESERVE;
    if (c.bottom <= limit) return;
    const need = c.bottom - limit;
    const room = Math.max(0, s.top - 24);
    const amount = Math.min(need, room);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (amount > 0) window.scrollBy({ top: amount, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    suppressUntilRef.current = performance.now() + 400;
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 600) {
      setOpen(false);
      advance(info.offset.x < 0 ? -1 : 1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    downRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    movedRef.current = false;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const d = downRef.current;
    downRef.current = null;
    if (d === null) return;
    const dx = Math.abs(e.clientX - d.x);
    const dy = Math.abs(e.clientY - d.y);
    const now = performance.now();
    const dt = now - d.t;
    if (!movedRef.current && dx < 8 && dy < 8 && dt < 400 && now > suppressUntilRef.current) {
      toggleCaption();
    }
  };

  const poseFor = (depth: number) => ({
    x: (isMobile ? POSE_X_MOBILE : POSE_X_DESKTOP)[depth],
    y: POSE_Y[depth],
    rotate: POSE_ROTATE[depth],
    opacity: 1,
    scale: 1,
  });

  const top = PROJECTS[order[0]];
  const stackWidth = isMobile ? 'min(88vw, 460px)' : '100%';

  const closeOnKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(false);
    }
  };

  // Caption text for the current top card, centred. Mobile shows it below the pile, desktop
  // beside it.
  const captionContent = (
    <>
      <p
        style={{
          textTransform: 'uppercase',
          fontSize: '12px',
          letterSpacing: '0.2em',
          fontWeight: 500,
          color: '#C2B2A0',
          textAlign: 'center',
        }}
      >
        {top.location}
      </p>
      <div style={{ width: '32px', height: '2px', backgroundColor: '#C2B2A0', margin: '14px auto' }} />
      <h3
        style={{
          color: '#FFFFFF',
          fontSize: isMobile ? '24px' : '30px',
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: 'normal',
          textAlign: 'center',
        }}
      >
        {top.title}
      </h3>
      <p
        style={{
          marginTop: '10px',
          fontSize: isMobile ? '15px' : '17px',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.82)',
          textAlign: 'center',
        }}
      >
        {top.desc}
      </p>
    </>
  );

  // One permanent line of instruction above the pile. It nudges in from the right each time the
  // top card changes.
  const hintLine = (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14, minHeight: 18 }}
    >
      <motion.p
        key={order[0]}
        initial={{ x: reduced ? 0 : 10 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        aria-hidden="true"
        style={{
          margin: 0,
          textAlign: 'right',
          color: '#C2B2A0',
          textTransform: 'uppercase',
          fontSize: isMobile ? 11 : 12,
          fontWeight: 600,
          letterSpacing: '0.14em',
          lineHeight: 1.4,
          pointerEvents: 'none',
        }}
      >
        {isMobile ? 'Swipe for more · Tap for details' : 'Drag for more · Click for details'}
      </motion.p>
    </motion.div>
  );

  const stack = (
    <div
      ref={stackRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our projects"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4 / 3',
        touchAction: 'pan-y',
      }}
    >
      {PROJECTS.map((project, idx) => {
        const depth = order.indexOf(idx);
        const isTop = depth === 0;
        const isExiting = exitingId === idx;
        const k = LAST_DEPTH - depth;
        const side = k % 2 === 0 ? -1 : 1;
        const start = { x: side * offscreen(), y: 0, rotate: side * 20, opacity: 1, scale: 1 };
        const pose = poseFor(depth);

        let target;
        let transition;
        if (isExiting) {
          target = { x: exitDir * offscreen(), y: 20, rotate: exitDir * 16, opacity: 1, scale: 1 };
          transition = { duration: EXIT_MS / 1000, ease: EXIT_EASE };
        } else if (reduced) {
          target = pose;
          transition = { duration: 0 };
        } else if (!dealInView) {
          target = start;
          transition = { duration: 0 };
        } else if (!dealt) {
          target = pose;
          transition = { delay: DEAL_DELAY[k], duration: DEAL_DURATION[k], ease: EASE };
        } else {
          target = pose;
          transition = { duration: 0.7, ease: EASE };
        }

        const canInteract = isTop && !isExiting && isDealt;

        return (
          <motion.div
            key={idx}
            initial={reduced ? pose : start}
            animate={target}
            transition={transition}
            drag={canInteract ? 'x' : false}
            dragSnapToOrigin
            dragElastic={0.4}
            dragMomentum={false}
            onDragStart={
              canInteract
                ? () => {
                    movedRef.current = true;
                  }
                : undefined
            }
            onDragEnd={canInteract ? handleDragEnd : undefined}
            onPointerDown={canInteract ? handlePointerDown : undefined}
            onPointerUp={canInteract ? handlePointerUp : undefined}
            onPointerCancel={
              canInteract
                ? () => {
                    downRef.current = null;
                  }
                : undefined
            }
            tabIndex={isTop ? 0 : undefined}
            role={isTop ? 'button' : undefined}
            aria-expanded={isTop ? open : undefined}
            aria-label={isTop ? `${project.title}, ${project.location}` : undefined}
            onKeyDown={
              isTop
                ? (e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCaption();
                    }
                  }
                : undefined
            }
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              aspectRatio: '4 / 3',
              padding: isMobile ? '8px' : '12px',
              backgroundColor: '#FFFFFF',
              borderRadius: '3px',
              boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
              boxSizing: 'border-box',
              cursor: isTop ? 'pointer' : 'default',
              userSelect: 'none',
              willChange: 'transform',
              zIndex: isExiting ? 20 : 10 - depth,
              pointerEvents: isTop && !isExiting ? 'auto' : 'none',
            }}
          >
            <img
              src={project.img}
              alt={`${project.title}, ${project.location}`}
              draggable={false}
              decoding="async"
              loading="eager"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <section
      id="projects"
      data-bg="dark"
      style={{ backgroundColor: '#0A0A0A', overflow: 'hidden', padding: isMobile ? '72px 0' : '100px 0' }}
    >
      <div className="inner">
        <motion.h2
          className="sov-h2-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            color: '#FFFFFF',
            textAlign: 'center',
            margin: '0 0 24px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Our Architectural Work.
        </motion.h2>
        <div
          style={{
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            marginBottom: isMobile ? '36px' : '48px',
          }}
        />

        {isMobile ? (
          <>
            <div style={{ width: stackWidth, margin: '0 auto 44px' }}>
              {hintLine}
              {stack}
            </div>

            <AnimatePresence>
              {open && (
                <motion.div
                  key="caption"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  onAnimationComplete={() => {
                    if (!isMobile || !openRef.current) return;
                    ensureCaptionVisible();
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Close details"
                  onClick={() => setOpen(false)}
                  onKeyDown={closeOnKey}
                  style={{
                    width: stackWidth,
                    margin: '0 auto',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div ref={captionRef} style={{ padding: '22px 4px 0' }}>
                    {captionContent}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginBottom: 44,
            }}
          >
            <div style={{ flex: '0 1 678px', minWidth: 0 }}>
              {hintLine}
              {stack}
            </div>

            <motion.div
              initial={false}
              animate={{ width: open ? panelW : 0, marginLeft: open ? PANEL_GAP : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              aria-hidden={!open}
              style={{
                overflow: 'hidden',
                flex: '0 0 auto',
                alignSelf: 'center',
                pointerEvents: open ? 'auto' : 'none',
              }}
            >
              <div
                role="button"
                tabIndex={open ? 0 : -1}
                aria-label="Close details"
                onClick={() => setOpen(false)}
                onKeyDown={closeOnKey}
                style={{
                  width: panelW,
                  minWidth: panelW,
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                {captionContent}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
