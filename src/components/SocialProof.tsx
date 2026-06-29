import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

const slideVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 30 : -30 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -30 : 30 }),
};

const testimonials = [
  {
    quote:
      "We've worked with Sovran for over five years on multiple developments. Their consistency, attention to detail, and reliability keep us coming back — they deliver exactly what high-value projects demand.",
    name: "Marcus O'Neill",
    title: 'Residential Property Developer, London',
    image: '/media/marcus.png',
  },
  {
    quote:
      'Military-level precision on every project. Sovran understood our vision from day one and delivered without a single compromise on quality or timeline.',
    name: 'Shiv Patel',
    title: 'Property Investor, London',
    image: '/media/shiv.png',
  },
  {
    quote:
      'They went beyond our expectations. The attention to detail, the communication throughout, and the final result — everything exceeded what we thought was possible.',
    name: 'Nyla Idrissi',
    title: 'Homeowner, West London',
    image: '/media/nyla.png',
  },
];

const pad = (n: number) => String(n + 1).padStart(2, '0');

function TestimonialCarousel({ isInView }: { isInView: boolean }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<number | null>(null);

  const startTimer = () => {
    if (timerRef.current !== null) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5500);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, []);

  const goTo = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
    startTimer();
  };

  const t = testimonials[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        maxWidth: '860px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Horizontal content body — min-height anchors card across all 3 testimonials */}
      <div
        className="sp-carousel-body"
        style={{ display: 'flex', minHeight: '170px', overflow: 'hidden' }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ display: 'flex', flex: 1 }}
          >
            {/* Left — profile, name, title, stars */}
            <div
              className="sp-carousel-left"
              style={{
                flex: '0 0 38%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '32px 28px',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <img
                src={t.image}
                alt={t.name}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  border: '2px solid rgba(201,169,110,0.3)',
                  flexShrink: 0,
                  marginBottom: '2px',
                }}
              />
              <p
                style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.01em',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                {t.name}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: 'normal',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                {t.title}
              </p>
              <div
                style={{
                  fontSize: '17px',
                  color: '#c9a96e',
                  letterSpacing: '3px',
                  marginTop: '2px',
                }}
              >
                ★★★★★
              </div>
            </div>

            {/* Right — quote */}
            <div
              className="sp-carousel-right"
              style={{
                flex: '0 0 62%',
                display: 'flex',
                alignItems: 'center',
                padding: '32px 36px',
              }}
            >
              <p
                style={{
                  fontSize: '21px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.82)',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  letterSpacing: 'normal',
                  margin: 0,
                }}
              >
                {t.quote}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

      {/* Footer row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '13px 36px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.12em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {pad(index)} / {pad(testimonials.length - 1)}
        </span>

        <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.08em',
            }}
          >
            4.9 Rated Excellent
          </span>
        </span>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              style={{
                width: i === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: i === index ? '#c9a96e' : 'rgba(255,255,255,0.25)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function SocialProof() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .sp-carousel-body {
            flex-direction: column;
            min-height: auto !important;
          }
          .sp-carousel-left {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            flex: none !important;
            width: 100%;
            padding: 32px 24px !important;
          }
          .sp-carousel-right {
            flex: none !important;
            width: 100%;
            padding: 28px 24px !important;
          }
        }
      `}</style>
      <section ref={ref} style={{ backgroundColor: '#0a0a0a', padding: '100px 0' }}>
        <div className="inner">

          {/* Section heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(30px, 3.5vw, 48px)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto 64px',
              lineHeight: 1.1,
            }}
          >
            Success Stories
          </motion.h2>

          {/* Row 1 — full-width video */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ marginBottom: '72px' }}
          >
            <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/_TxXLSWW57Q"
                title="Sovran project showcase"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
            </div>
          </motion.div>

          {/* Row 2 — label */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#c9a96e',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: '0 0 32px',
            }}
          >
            More Client Stories
          </motion.p>

          {/* Row 2 — wide horizontal carousel */}
          <TestimonialCarousel isInView={isInView} />

        </div>
      </section>
    </>
  );
}
