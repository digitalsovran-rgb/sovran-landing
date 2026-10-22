import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Featured projects, each with its own number of images, shown in turn on the stage.
const PROJECTS = [
  {
    title: 'New Build',
    location: 'Cobham, KT11',
    desc: 'A stone country house with an arched loggia, a spa below ground and living rooms opening onto the garden.',
    images: ['/media/pr1.webp', '/media/pr1-2.webp', '/media/pr1-3.webp', '/media/pr1-4.webp'],
  },
  {
    title: 'Townhouse Renovation',
    location: 'Kensington, W8',
    desc: 'A white stucco townhouse reworked inside, with a marble kitchen and a drawing room framed by tall windows.',
    images: ['/media/pr2.webp?v=2', '/media/pr2-1.webp', '/media/pr2-2.webp'],
  },
  {
    title: 'Full Renovation',
    location: 'Mayfair, W1',
    desc: 'A classical facade with a reimagined interior, from a curved sitting room to a marble staircase hall.',
    images: ['/media/pr3.webp?v=2', '/media/pr3-1.webp?v=2', '/media/pr3-2.webp?v=2', '/media/pr3-3.webp?v=2'],
  },
];

const SLIDE_MS = 3500;
const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

export default function Projects() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [p, setP] = useState(0);
  const [i, setI] = useState(0);
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { amount: 0.3 });
  const preloadedRef = useRef(false);
  const downRef = useRef<{ x: number; y: number } | null>(null);

  const project = PROJECTS[p];
  const n = project.images.length;

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Fetch every project image once, the first time the showcase comes into view.
  useEffect(() => {
    if (!inView || preloadedRef.current) return;
    preloadedRef.current = true;
    new Set(PROJECTS.flatMap((proj) => proj.images)).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [inView]);

  // Steps through the active project's images, then on to the next project.
  const next = () => {
    if (i < n - 1) {
      setI(i + 1);
    } else {
      setP((p + 1) % PROJECTS.length);
      setI(0);
    }
  };

  const prev = () => {
    if (i > 0) {
      setI(i - 1);
    } else {
      const before = (p + PROJECTS.length - 1) % PROJECTS.length;
      setP(before);
      setI(PROJECTS[before].images.length - 1);
    }
  };

  // Autoplay only while the showcase is on screen. The timer restarts on every image change.
  useEffect(() => {
    if (!inView || reduced) return;
    const timer = window.setTimeout(next, SLIDE_MS);
    return () => window.clearTimeout(timer);
    // next reads p and i, which are listed here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, i, inView, reduced]);

  const selectProject = (k: number) => {
    setP(k);
    setI(0);
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({
      event: 'project_select',
      project: PROJECTS[k].title,
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    downRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const down = downRef.current;
    downRef.current = null;
    if (!down) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  };

  const progressFrom = `${(i / n) * 100}%`;
  const progressTo = inView && !reduced ? `${((i + 1) / n) * 100}%` : progressFrom;

  return (
    <section
      id="projects"
      data-bg="dark"
      style={{ backgroundColor: '#0A0A0A', overflow: 'hidden', padding: isMobile ? '72px 0' : '100px 0' }}
    >
      <div className="inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p
            style={{
              textTransform: 'uppercase',
              fontSize: '12px',
              letterSpacing: '0.2em',
              fontWeight: 600,
              color: '#C2B2A0',
              textAlign: 'center',
              margin: '0 0 14px',
            }}
          >
            Showcased Work
          </p>
          <h2
            className="sov-h2-lg"
            style={{
              color: '#FFFFFF',
              textAlign: 'center',
              margin: 0,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Homes That Leave A Mark.
          </h2>
          <p
            className="sov-justify sov-justify-l sov-nohyph"
            lang="en-GB"
            style={{
              color: 'rgba(255,255,255,0.72)',
              fontSize: isMobile ? 14 : 16,
              lineHeight: 1.65,
              maxWidth: isMobile ? 340 : 600,
              margin: '16px auto 0',
            }}
          >
            Designed for families who seek a true sense of belonging in the space they envision. A private
            sanctuary that reflects who they are, where loved ones eagerly gather, guests stay longer and
            each passing year adds another chapter of memories. That quiet pride is the mark your home can
            leave.
          </p>
          <div
            style={{
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              marginTop: '24px',
              marginBottom: isMobile ? '32px' : '40px',
            }}
          />
        </motion.div>

        <div ref={wrapperRef} style={{ maxWidth: 1000, margin: '0 auto' }}>
          {/* Project selector */}
          <div
            role="tablist"
            aria-label="Featured projects"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${PROJECTS.length}, 1fr)`,
              gap: isMobile ? 8 : 16,
              marginBottom: isMobile ? 14 : 20,
            }}
          >
            {PROJECTS.map((proj, k) => {
              const active = k === p;
              return (
                <button
                  key={proj.title}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="project-stage"
                  onClick={() => selectProject(k)}
                  style={{
                    background: 'none',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: active ? '#C2B2A0' : 'rgba(255,255,255,0.14)',
                    borderRadius: 6,
                    padding: isMobile ? 6 : 8,
                    cursor: 'pointer',
                    textAlign: 'left',
                    opacity: active ? 1 : 0.55,
                    transition: 'opacity 0.3s ease, border-color 0.3s ease',
                    color: '#FFFFFF',
                    WebkitTapHighlightColor: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      aspectRatio: '4 / 3',
                      overflow: 'hidden',
                      borderRadius: 3,
                      background: '#141414',
                    }}
                  >
                    <img
                      src={proj.images[0]}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </span>
                  <span
                    style={{
                      fontSize: isMobile ? 11 : 13,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      lineHeight: 1.25,
                    }}
                  >
                    {proj.title}
                  </span>
                  <span
                    style={{
                      fontSize: isMobile ? 10 : 11,
                      color: 'rgba(255,255,255,0.6)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {proj.location}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      height: 2,
                      background: 'rgba(255,255,255,0.12)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    {active && (
                      <motion.span
                        key={`${p}-${i}`}
                        initial={{ width: progressFrom }}
                        animate={{ width: progressTo }}
                        transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                        style={{ display: 'block', height: '100%', background: '#C2B2A0' }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stage: the active project's current image, with swipe to step through */}
          <div
            id="project-stage"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 6,
              background: '#141414',
              aspectRatio: isMobile ? '4 / 3' : '16 / 9',
              touchAction: 'pan-y',
            }}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={`${p}-${i}`}
                src={project.images[i]}
                alt={`${project.title}, ${project.location}`}
                draggable={false}
                decoding="async"
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={
                  reduced
                    ? { duration: 0.3 }
                    : { opacity: { duration: 0.8 }, scale: { duration: 4, ease: 'easeOut' } }
                }
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </AnimatePresence>

            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: 12,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 6,
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {project.images.map((src, k) => (
                <span
                  key={`${src}-${k}`}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: k === i ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Caption for the active project */}
          <AnimatePresence mode="wait">
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: 'center', marginTop: isMobile ? 20 : 26 }}
            >
              <p
                style={{
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  fontWeight: 500,
                  color: '#C2B2A0',
                  margin: 0,
                }}
              >
                {project.location}
              </p>
              <div style={{ width: 32, height: 2, background: '#C2B2A0', margin: '12px auto' }} />
              <h3 style={{ color: '#FFFFFF', fontSize: isMobile ? 22 : 26, fontWeight: 700, margin: 0 }}>
                {project.title}
              </h3>
              <p
                style={{
                  fontSize: isMobile ? 15 : 16,
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.78)',
                  margin: '8px auto 0',
                  maxWidth: 560,
                }}
              >
                {project.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
