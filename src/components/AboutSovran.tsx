import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      "We've worked with Sovran for over five years on multiple developments. Their consistency and reliability keep us coming back.",
    name: "Marcus O'Neill",
    image: '/media/marcus.png',
  },
  {
    quote:
      'Military-level precision on every project. Sovran understood our vision from day one and delivered on time.',
    name: 'Shiv Patel',
    image: '/media/shiv.png',
  },
  {
    quote:
      'They went beyond our expectations. The communication throughout, and the final result, exceeded what we thought was possible.',
    name: 'Nyla Idrissi',
    image: '/media/nyla.png',
  },
];

const ethosCards = [
  {
    label: 'One Team',
    desc: 'You speak to the same people from your first conversation to the day we hand over the keys.',
  },
  {
    label: 'Planning Expertise',
    desc: 'Our team includes former planning officers, so we know what a council needs to see before you even apply.',
  },
  {
    label: 'Protected Investment',
    desc: 'A fixed price, agreed upfront, so there are no surprises waiting for you halfway through your project.',
  },
];

const stats = [
  { target: 15, decimals: 0, suffix: '+', label: 'Years' },
  { target: 1000, decimals: 0, suffix: '+', label: 'Projects Delivered' },
  { target: 95, decimals: 0, suffix: '%', label: 'Planning Success' },
  { target: 4.9, decimals: 1, suffix: '', label: 'Google Rating' },
];

const COUNT_UP_MS = 1500;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

// Counts from 0 up to `target` once `active` becomes true, and stays latched (never restarts
// on later re-triggers). `done` flips true only once the animation finishes, so callers can
// hold off appending a suffix (e.g. "+", "%") until the final value is reached.
function useCountUp(target: number, decimals: number, active: boolean) {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    let rafId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / COUNT_UP_MS, 1);
      const eased = easeOutCubic(progress);
      setValue(target * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setValue(target);
        setDone(true);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, target]);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-US');
  return { display, done };
}

function StatValue({ stat, active }: { stat: (typeof stats)[0]; active: boolean }) {
  const { display, done } = useCountUp(stat.target, stat.decimals, active);
  return (
    <>
      {display}
      {done ? stat.suffix : ''}
    </>
  );
}

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '6px',
        padding: '20px 22px',
      }}
    >
      <img
        src={t.image}
        alt={t.name}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          objectFit: 'cover',
          objectPosition: 'center top',
          flexShrink: 0,
        }}
      />
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.01em',
            margin: '0 0 4px',
          }}
        >
          {t.name}
        </p>
        <div style={{ display: 'flex', gap: '2px', margin: '0 0 6px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} color="#c9a96e" fill="#c9a96e" />
          ))}
        </div>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.5,
            letterSpacing: 'normal',
            margin: 0,
          }}
        >
          {t.quote}
        </p>
      </div>
    </div>
  );
}

function TestimonialRow() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(id);
  }, [isMobile, activeIndex]);

  if (isMobile) {
    return (
      <div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={testimonials[activeIndex].name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <TestimonialCard t={testimonials[activeIndex]} />
          </motion.div>
        </AnimatePresence>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to ${t.name}`}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                backgroundColor: i === activeIndex ? '#c9a96e' : 'rgba(255,255,255,0.2)',
                transition: 'background-color 0.25s ease',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {testimonials.map((t) => (
        <TestimonialCard key={t.name} t={t} />
      ))}
    </div>
  );
}

export default function AboutSovran() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });

  // Separate from `isInView` above (which drives the entrance fade for the whole section) —
  // this fires once, specifically when the stats grid itself scrolls into view, and never
  // resets, so the count-up plays exactly one time regardless of later scrolling in and out.
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsTriggered, setStatsTriggered] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} data-bg="dark" style={{ backgroundColor: '#0a0a0a', padding: '100px 0' }}>
      <div className="inner" style={{ maxWidth: '900px' }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: '#c9a96e',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          About Sovran
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(30px, 3.5vw, 44px)',
            fontWeight: 900,
            color: '#f5f0eb',
            letterSpacing: '-0.005em',
            lineHeight: 1.1,
          }}
        >
          Design And Build Studio.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 400,
            color: '#f5f0eb',
            lineHeight: 1.7,
            letterSpacing: 'normal',
            maxWidth: '650px',
            margin: '20px auto 0',
          }}
        >
          Sovran is a design and build studio: architects, planners and construction specialists
          working as one team, under one roof. Founded in 2011, we&apos;ve delivered over 1,000
          projects across London and the Home Counties, spanning architecture, construction and
          interiors, each one carried by the same team from first drawing to completion.
        </motion.p>

        <div
          className="about-ethos-grid"
          style={{
            marginTop: '56px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: '32px',
            rowGap: '32px',
          }}
        >
          {ethosCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                padding: '4px 4px 0',
              }}
            >
              <div style={{ width: '40px', height: '2px', backgroundColor: '#c9a96e', marginBottom: '14px' }} />
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#f5f0eb',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}
              >
                {card.label}
              </h3>
              <p
                className="about-ethos-desc"
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'rgba(245,240,235,0.65)',
                  lineHeight: 1.6,
                  letterSpacing: 'normal',
                  textAlign: 'justify',
                }}
              >
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div
          ref={statsRef}
          className="about-stats-grid"
          style={{
            marginTop: '56px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
              style={{ textAlign: 'center' }}
            >
              <div
                style={{
                  fontSize: 'clamp(24px, 2.6vw, 28px)',
                  fontWeight: 900,
                  color: '#f5f0eb',
                  letterSpacing: '-0.005em',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                <StatValue stat={stat} active={statsTriggered} />
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'rgba(245,240,235,0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: '#c9a96e',
            textTransform: 'uppercase',
            marginTop: '56px',
            marginBottom: '16px',
          }}
        >
          Client Stories
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(22px, 2.6vw, 30px)',
            fontWeight: 900,
            color: '#f5f0eb',
            letterSpacing: '-0.005em',
            marginBottom: '40px',
          }}
        >
          What Our Clients Say About Us.
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        >
          <TestimonialRow />
        </motion.div>
      </div>
    </section>
  );
}
