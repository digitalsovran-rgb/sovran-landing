import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

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
      transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '48px 44px',
        minHeight: '420px',
      }}
    >
      {/* Sliding testimonial content */}
      <div style={{ flex: 1 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={(d: number) => ({ opacity: 0, x: d > 0 ? 30 : -30 })}
            animate={{ opacity: 1, x: 0 }}
            exit={(d: number) => ({ opacity: 0, x: d > 0 ? -30 : 30 })}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <img
                src={t.image}
                alt={t.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  border: '2px solid rgba(201,169,110,0.3)',
                  flexShrink: 0,
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.01em',
                  }}
                >
                  {t.name}
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: '3px',
                    letterSpacing: 'normal',
                  }}
                >
                  {t.title}
                </p>
              </div>
            </div>

            {/* Quote */}
            <p
              style={{
                fontSize: '18px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.65,
                fontStyle: 'italic',
                letterSpacing: 'normal',
                marginBottom: '28px',
              }}
            >
              {t.quote}
            </p>

            {/* Stars */}
            <div
              style={{
                fontSize: '18px',
                color: '#c9a96e',
                letterSpacing: '3px',
              }}
            >
              ★★★★★
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          margin: '28px 0 20px',
        }}
      />

      {/* Bottom row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Pagination label */}
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

        {/* Google rating */}
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.08em',
          }}
        >
          4.9 Google Reviews
        </span>

        {/* Dot navigation */}
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
        .social-proof-grid {
          display: flex;
          gap: 32px;
          align-items: stretch;
        }
        .social-proof-video {
          flex: 0 0 52%;
        }
        @media (max-width: 767px) {
          .social-proof-grid {
            flex-direction: column;
          }
          .social-proof-video {
            flex: none;
            width: 100%;
          }
        }
      `}</style>
      <section
        ref={ref}
        style={{ backgroundColor: '#0a0a0a', padding: '100px 0' }}
      >
        <div className="inner">
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

          <div className="social-proof-grid">
            {/* Left — YouTube embed */}
            <motion.div
              className="social-proof-video"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%', /* 16:9 */
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
            </motion.div>

            {/* Right — rotating carousel */}
            <TestimonialCarousel isInView={isInView} />
          </div>
        </div>
      </section>
    </>
  );
}
