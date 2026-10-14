import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Info, X } from 'lucide-react';
import PulseRing from './PulseRing';

const PROJECTS = [
  {
    title: 'Rear Extension',
    location: 'Richmond, TW9',
    desc: 'Open the back of your home to the garden.',
    img: '/media/rearext.webp',
  },
  {
    title: 'Loft Conversion',
    location: 'Wimbledon, SW19',
    desc: 'Turn unused space into the room you need.',
    img: '/media/loftconver.webp?v=3',
  },
  {
    title: 'Side Return',
    location: 'Chiswick, W4',
    desc: 'Reclaim the narrow gap beside your property.',
    img: '/media/sideret.webp',
  },
  {
    title: 'Double Storey',
    location: 'Hampstead, NW3',
    desc: 'Two floors of new space. One build.',
    img: '/media/doublstor.webp?v=3',
  },
  {
    title: 'Wrap Around',
    location: 'Notting Hill, W11',
    desc: 'Change the entire feel of your home.',
    img: '/media/wraparound.webp',
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

export default function Projects() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [order, setOrder] = useState<number[]>(() => PROJECTS.map((_, i) => i));
  const [exitingId, setExitingId] = useState<number | null>(null);
  const [exitDir, setExitDir] = useState<-1 | 1>(1);
  const [dealt, setDealt] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const reduced = useReducedMotion();
  const stackRef = useRef<HTMLDivElement>(null);
  const dealInView = useInView(stackRef, { amount: 0.35, once: true });
  const liveInView = useInView(stackRef, { amount: 0.3 });
  const cycleRef = useRef(0);
  const exitTimerRef = useRef<number | null>(null);

  // With reduced motion there is no deal, so the pile counts as dealt from the start.
  const isDealt = Boolean(reduced) || dealt;

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

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
    if (!open) setHasOpened(true);
    setOpen(!open);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 600) {
      setOpen(false);
      advance(info.offset.x < 0 ? -1 : 1);
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
  const stackWidth = isMobile ? 'min(88vw, 460px)' : 'min(820px, 100%)';
  const showHint = isDealt && !hasOpened && !open && exitingId === null;

  return (
    <section
      id="projects"
      data-bg="dark"
      style={{ backgroundColor: '#0A0A0A', overflow: 'hidden', padding: isMobile ? '72px 0' : '100px 0' }}
    >
      <div className="inner">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            color: 'var(--sov-white)',
            textTransform: 'uppercase',
            fontSize: 'clamp(30px, 3.85vw, 50px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: '0 0 24px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Our Work
        </motion.h2>
        <div
          style={{
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            marginBottom: isMobile ? '36px' : '48px',
          }}
        />

        <div
          ref={stackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Our projects"
          style={{
            position: 'relative',
            width: stackWidth,
            aspectRatio: '4 / 3',
            margin: '0 auto 44px',
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
                onDragEnd={canInteract ? handleDragEnd : undefined}
                onTap={canInteract ? toggleCaption : undefined}
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
                  alt={project.title}
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
                {isTop && (
                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.8 } }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        style={{
                          position: 'absolute',
                          bottom: '18px',
                          right: '18px',
                          zIndex: 4,
                          pointerEvents: 'none',
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(10,10,10,0.55)',
                        }}
                      >
                        <PulseRing size={52} tone="dark" pulse delay={0}>
                          <Info size={22} color="#FFFFFF" />
                        </PulseRing>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              key="caption"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{
                width: stackWidth,
                margin: '0 auto',
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(194,178,160,0.3)',
                position: 'relative',
              }}
            >
              <div style={{ padding: isMobile ? '22px 22px 24px' : '28px 32px 30px' }}>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '40px',
                    height: '40px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={18} color="#FFFFFF" />
                </button>
                <p
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    fontWeight: 500,
                    color: '#C2B2A0',
                  }}
                >
                  {top.location}
                </p>
                <div style={{ width: '32px', height: '2px', backgroundColor: '#C2B2A0', margin: '14px 0' }} />
                <h3
                  style={{
                    color: '#FFFFFF',
                    fontSize: isMobile ? '24px' : '30px',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: 'normal',
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
                    textAlign: 'left',
                  }}
                >
                  {top.desc}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
