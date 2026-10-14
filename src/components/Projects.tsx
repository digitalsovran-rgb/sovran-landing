import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
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

const SLIDE_COUNT = PROJECTS.length;
const HOLD_MS = 4000;
const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

// Every enter and exit state is spread over NEUTRAL so no property is ever undefined.
const NEUTRAL = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' };

type Overrides = Partial<{
  x: number | string;
  y: number | string;
  scale: number;
  rotate: number;
  opacity: number;
  clipPath: string;
}>;

const TYPES = {
  slideLeft: { enter: { x: '100%' }, exit: { x: '-25%', opacity: 0.5 } },
  slideRight: { enter: { x: '-100%' }, exit: { x: '25%', opacity: 0.5 } },
  slideUp: { enter: { y: '100%' }, exit: { y: '-20%', opacity: 0.5 } },
  slideDown: { enter: { y: '-100%' }, exit: { y: '20%', opacity: 0.5 } },
  zoom: { enter: { opacity: 0, scale: 1.18 }, exit: { opacity: 0, scale: 0.95 } },
  rotate: { enter: { opacity: 0, rotate: 5, scale: 1.15 }, exit: { opacity: 0, rotate: -3, scale: 0.95 } },
  // The new slide is revealed by a wipe while the old one stays fully visible underneath.
  wipe: { enter: { clipPath: 'inset(0% 0% 100% 0%)' }, exit: {} },
} satisfies Record<string, { enter: Overrides; exit: Overrides }>;

type TransitionType = keyof typeof TYPES;
const TYPE_NAMES = Object.keys(TYPES) as TransitionType[];

const slideVariants: Variants = {
  enter: (type: TransitionType) => ({ ...NEUTRAL, ...TYPES[type].enter, zIndex: 2 }),
  center: { ...NEUTRAL, zIndex: 2 },
  exit: (type: TransitionType) => ({ ...NEUTRAL, ...TYPES[type].exit, zIndex: 1 }),
};

const reducedVariants: Variants = {
  enter: { opacity: 0, zIndex: 2 },
  center: { opacity: 1, zIndex: 2 },
  exit: { opacity: 0, zIndex: 1 },
};

function pickRandomType(exclude: TransitionType | null): TransitionType {
  const pool = TYPE_NAMES.filter((name) => name !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Projects() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [index, setIndex] = useState(0);
  const [transitionType, setTransitionType] = useState<TransitionType>('slideLeft');
  const [captionOpen, setCaptionOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const stageInView = useInView(stageRef, { amount: 0.3 });
  const lastTypeRef = useRef<TransitionType | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Warm the cache for the slide that comes next.
  useEffect(() => {
    const preload = new Image();
    preload.src = PROJECTS[(index + 1) % SLIDE_COUNT].img;
  }, [index]);

  // Each slide is held for HOLD_MS. The timer restarts from zero whenever the slide changes,
  // the caption closes, or the stage scrolls back into view.
  useEffect(() => {
    if (reduced || !stageInView || captionOpen) return;
    const timer = window.setTimeout(() => {
      const next = pickRandomType(lastTypeRef.current);
      lastTypeRef.current = next;
      setTransitionType(next);
      setIndex((i) => (i + 1) % SLIDE_COUNT);
    }, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [index, stageInView, captionOpen, reduced]);

  const toggleCaption = () => {
    if (!captionOpen) setHasOpened(true);
    setCaptionOpen(!captionOpen);
  };

  const swipe = (toNext: boolean) => {
    const type: TransitionType = toNext ? 'slideLeft' : 'slideRight';
    lastTypeRef.current = type;
    setTransitionType(type);
    setIndex((i) => (toNext ? (i + 1) % SLIDE_COUNT : (i - 1 + SLIDE_COUNT) % SLIDE_COUNT));
    setCaptionOpen(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      swipe(dx < 0);
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      toggleCaption();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCaption();
    }
  };

  const project = PROJECTS[index];
  const variants = reduced ? reducedVariants : slideVariants;
  const slideTransition = reduced ? { duration: 0.3 } : { duration: 0.9, ease: EASE };

  const stage = (
    <div
      ref={stageRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our projects"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        backgroundColor: '#141414',
        touchAction: 'pan-y',
        cursor: 'pointer',
        userSelect: 'none',
        ...(isMobile
          ? { height: 'min(80svh, 680px)' }
          : { aspectRatio: '16 / 9', maxHeight: '80vh' }),
      }}
    >
      <AnimatePresence initial={false} custom={transitionType}>
        <motion.div
          key={index}
          custom={transitionType}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          style={{ position: 'absolute', inset: 0 }}
        >
          <img
            src={project.img}
            alt={project.title}
            draggable={false}
            decoding="async"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {index === 0 && !hasOpened && !captionOpen && (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6, delay: 1.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 4, pointerEvents: 'none' }}
          >
            <PulseRing size={52} tone="dark" pulse delay={0}>
              <Info size={22} color="#FFFFFF" />
            </PulseRing>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {captionOpen && (
          <motion.div
            key="caption"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 5,
              padding: isMobile ? '28px 24px 32px' : '36px 40px 40px',
              backgroundColor: 'rgba(10,10,10,0.86)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(194,178,160,0.35)',
              cursor: 'default',
              textAlign: 'left',
            }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setCaptionOpen(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
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
              <X size={20} color="#FFFFFF" />
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
              {project.location}
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
              {project.title}
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
              {project.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <section
      id="projects"
      data-bg="dark"
      style={{ backgroundColor: '#0A0A0A', padding: isMobile ? 0 : '80px 0' }}
    >
      {isMobile ? stage : <div className="inner">{stage}</div>}
    </section>
  );
}
