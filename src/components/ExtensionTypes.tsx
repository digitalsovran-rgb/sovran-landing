import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Project = {
  n: string;
  title: string;
  location: string;
  desc: string;
  longDesc: string;
  img: string;
};

const PROJECTS: Project[] = [
  {
    n: '01',
    title: 'Rear Extension',
    location: 'Richmond, TW9',
    desc: 'Open the back of your home to the garden.',
    longDesc:
      'This Georgian property gained a full-width glass extension across the rear, opening the kitchen, dining and living areas into a single uninterrupted space. Slim black-framed sliding doors run the entire width of the new structure, folding the garden into the room on warmer days. A paved terrace was laid directly outside the doors, with steps leading down to the lawn, keeping the new space and garden feeling like one continuous area. Inside, oak flooring carries through from the original house into the extension, with no visible step or threshold between old and new.',
    img: '/media/rearext.webp',
  },
  {
    n: '02',
    title: 'Loft Conversion',
    location: 'Wimbledon, SW19',
    desc: 'Turn unused space into the room you need.',
    longDesc:
      "The loft of this Victorian terrace was converted into a full bedroom suite, with a slate-grey dormer extending the roofline to create proper standing height across the new floor. Large dormer windows were positioned to catch the rooftop views over the surrounding terraces, a detail the homeowners specifically asked for during early design conversations. Downstairs, the original sash windows and brick façade were left completely untouched, so the addition reads as a natural extension of the roofline rather than an obvious addition. The result added a full extra floor of usable space without altering the character of the street-facing elevation.",
    img: '/media/loftconver.webp?v=3',
  },
  {
    n: '03',
    title: 'Side Return',
    location: 'Chiswick, W4',
    desc: 'Reclaim the narrow gap beside your property.',
    longDesc:
      "The narrow side return of this terraced house was reclaimed and turned into the heart of the home, with a glass roof lantern installed to flood the new kitchen and dining space with daylight throughout the day. The original exposed brick wall was kept and cleaned back, giving the new extension a warmth that plastered walls wouldn't have achieved. A long kitchen island anchors the space, with bi-fold doors at the far end opening directly onto the garden. Open shelving and a built-in bookcase were added along the brick wall, making use of a space that was previously just a dead-end passage beside the house.",
    img: '/media/sideret.webp',
  },
  {
    n: '04',
    title: 'Double Storey',
    location: 'Hampstead, NW3',
    desc: 'Two floors of new space. One build.',
    longDesc:
      'A red brick double-storey addition was built across the rear of this terraced home, matching the existing brickwork so closely the join is barely visible from the garden. The ground floor opens entirely through black-framed glazing into a new kitchen and dining space, while the bedroom above takes full advantage of the extra floor with a wall of glass overlooking the garden. Internally, the ceiling height was raised on both levels to avoid the boxed-in feeling many double-storey extensions create. The planting beneath the new windows was left untouched during construction, softening the new structure within weeks of completion.',
    img: '/media/doublstor.webp?v=3',
  },
  {
    n: '05',
    title: 'Wrap Around',
    location: 'Notting Hill, W11',
    desc: 'Change the entire feel of your home.',
    longDesc:
      "This period property's rear and side were both extended in a single wrap-around build, fully glazed at the corner to maximise light from two directions at once. The flat roof was finished in a dark anthracite frame, contrasting deliberately against the white render of the original façade. Inside, the kitchen, dining and living spaces flow continuously around the wrapped corner, with the garden visible from almost every point in the new structure. Lavender and hydrangea beds were planted along the new terrace edge, softening the glass line and giving the extension a settled, established feel from the moment it was finished.",
    img: '/media/wraparound.webp',
  },
];

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];
const VIEWPORT = { once: true, margin: '-80px' };
const CARD_GAP = 16;

// Desktop grid placement and image shape for each project, by index.
const DESKTOP_LAYOUT: { column: string; aspect: string; offset?: number }[] = [
  { column: '1 / -1', aspect: '21 / 9' },
  { column: '1 / 8', aspect: '4 / 3', offset: 80 },
  { column: '8 / -1', aspect: '4 / 5' },
  { column: '1 / 6', aspect: '4 / 5' },
  { column: '6 / -1', aspect: '4 / 3', offset: 80 },
];

function ProjectImage({ project, aspect, hoverable }: { project: Project; aspect: string; hoverable: boolean }) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={VIEWPORT}
      transition={{ duration: 1, ease: EASE }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        aspectRatio: aspect,
        backgroundColor: '#141414',
      }}
    >
      <motion.img
        src={project.img}
        alt={project.title}
        loading="lazy"
        decoding="async"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        whileHover={hoverable ? { scale: 1.03, transition: { duration: 1.2, ease: 'easeOut' } } : undefined}
        viewport={VIEWPORT}
        transition={{ duration: 1.4, ease: EASE }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </motion.div>
  );
}

function Caption({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, delay: 0.3 }}
      style={{ marginTop: '18px' }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
        <span
          style={{
            color: 'var(--sov-greige-light)',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.2em',
          }}
        >
          {project.n}
        </span>
        <span style={{ color: 'var(--sov-white)', fontSize: '22px', fontWeight: 600 }}>{project.title}</span>
      </div>
      <p
        style={{
          marginTop: '8px',
          textTransform: 'uppercase',
          fontSize: '12px',
          letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        {project.location}
      </p>
      <p
        style={{
          marginTop: '10px',
          fontSize: '14px',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'left',
        }}
      >
        {project.desc}
      </p>
    </motion.div>
  );
}

export default function ExtensionTypes() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [current, setCurrent] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    const firstCard = scroller?.firstElementChild as HTMLElement | null;
    if (!scroller || !firstCard) return;
    const index = Math.round(scroller.scrollLeft / (firstCard.offsetWidth + CARD_GAP));
    setCurrent(Math.max(0, Math.min(index, PROJECTS.length - 1)));
  };

  const counter = `${String(current + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}`;

  return (
    <section
      id="projects"
      data-bg="dark"
      style={{ backgroundColor: '#0A0A0A', padding: isMobile ? '60px 0' : '100px 0' }}
    >
      <style>{`.ow-scroller::-webkit-scrollbar { display: none; }`}</style>

      <div className="inner">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            marginBottom: '56px',
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(32px, 3.85vw, 46px)',
              fontWeight: 900,
              color: 'var(--sov-white)',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Our Work
          </motion.h2>
          {isMobile && (
            <span
              style={{
                fontSize: '12px',
                letterSpacing: '0.2em',
                color: 'var(--sov-greige-light)',
              }}
            >
              {counter}
            </span>
          )}
        </div>

        {!isMobile && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              columnGap: '24px',
              rowGap: '72px',
              alignItems: 'start',
            }}
          >
            {PROJECTS.map((project, i) => {
              const layout = DESKTOP_LAYOUT[i];
              return (
                <article
                  key={project.n}
                  style={{ gridColumn: layout.column, marginTop: layout.offset ? `${layout.offset}px` : undefined }}
                >
                  <ProjectImage project={project} aspect={layout.aspect} hoverable />
                  <Caption project={project} />
                </article>
              );
            })}
          </div>
        )}
      </div>

      {isMobile && (
        <>
          <div
            ref={scrollerRef}
            className="ow-scroller"
            onScroll={handleScroll}
            style={{
              display: 'flex',
              gap: `${CARD_GAP}px`,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '0 24px',
              scrollPaddingLeft: '24px',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {PROJECTS.map((project) => (
              <article
                key={project.n}
                style={{ flex: '0 0 82vw', maxWidth: '380px', scrollSnapAlign: 'start' }}
              >
                <ProjectImage project={project} aspect="4 / 5" hoverable={false} />
                <Caption project={project} />
              </article>
            ))}
          </div>

          <div style={{ marginTop: '28px', padding: '0 24px' }}>
            <div style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <div
                style={{
                  height: '100%',
                  width: `${((current + 1) / PROJECTS.length) * 100}%`,
                  backgroundColor: 'var(--sov-greige-light)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
