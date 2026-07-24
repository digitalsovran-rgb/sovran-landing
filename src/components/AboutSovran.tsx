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
    <section ref={ref} style={{ backgroundColor: '#0a0a0a', padding: '100px 0' }}>
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
          One Team, From First Drawing To Finished Home.
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
          Sovran designs, plans and builds extensions across London and the Home Counties — one
          team accountable for every stage, with a dedicated project manager and payment
          protection built into every contract.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 500,
            color: 'rgba(245,240,235,0.6)',
            letterSpacing: '0.02em',
            marginTop: '24px',
          }}
        >
          15+ years experience · 1,000+ properties transformed · Rated 4.9 on Google
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          style={{ marginTop: '48px' }}
        >
          <TestimonialRow />
        </motion.div>
      </div>
    </section>
  );
}
