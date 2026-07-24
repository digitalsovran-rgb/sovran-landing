import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

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
    desc: 'Architects, planners and builders working as one, so nothing gets lost between drawing and delivery.',
  },
  {
    label: 'Planning Expertise',
    desc: 'Led by former planning officers, with a 95% planning success rate across London boroughs.',
  },
  {
    label: 'Protected Investment',
    desc: 'Fixed-price contracts and milestone-based payments, so your budget is protected from start to finish.',
  },
];

const stats = [
  { value: '15+', label: 'Years' },
  { value: '1,000+', label: 'Projects Delivered' },
  { value: '95%', label: 'Planning Success' },
  { value: '4.9', label: 'Google Rating' },
];

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
          Behind every project is a family, a vision, and a home worth building properly. Founded
          in 2011, Sovran brings architects, planners and construction specialists together as one
          team, delivering extensions and renovations across London and UK.
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
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'rgba(245,240,235,0.65)',
                  lineHeight: 1.6,
                  letterSpacing: 'normal',
                }}
              >
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div
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
                {stat.value}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          style={{ marginTop: '56px' }}
        >
          <TestimonialRow />
        </motion.div>
      </div>
    </section>
  );
}
