import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// Client review. Keep the quote word for word as supplied by the client.
const SHOW_REVIEW = true;
const REVIEW = {
  image: '/media/newreview.webp',
  alt: 'A Sovran home designed for the Harrington family',
  quote:
    'Working with Sovran was an exceptional experience. They created a space that feels both elegant and effortless, with every detail carefully considered. It truly feels like a home designed around our lifestyle.',
  name: 'Olivia Harrington',
};

// One statement under the heading.
const ABOUT_STATEMENT =
  'We believe in timeless design and prestigious homes that gain character with every year. Across architecture and construction, we pursue design excellence until each home carries the unmistakable signature of its owners.';

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

export default function AboutSovran() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const reviewImage = (
    <img
      src={REVIEW.image}
      alt={REVIEW.alt}
      loading="lazy"
      decoding="async"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  );

  return (
    <section ref={ref} data-bg="dark" style={{ backgroundColor: '#4A443C', padding: '100px 0' }}>
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
            color: 'var(--sov-greige-light)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          What We Stand For
        </motion.p>

        <motion.h2
          className="sov-h2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            color: 'var(--sov-white)',
            marginBottom: 0,
          }}
        >
          Homes Built To Endure.
        </motion.h2>

        <motion.p
          className="sov-justify sov-justify-l sov-nohyph"
          lang="en-GB"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            color: '#FFFFFF',
            fontSize: isMobile ? 16 : 20,
            fontWeight: 400,
            lineHeight: 1.65,
            maxWidth: isMobile ? 340 : 640,
            margin: isMobile ? '20px auto 0' : '24px auto 0',
          }}
        >
          {ABOUT_STATEMENT}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            marginTop: isMobile ? 36 : 48,
            maxWidth: 720,
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'left',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 4,
            padding: isMobile ? '22px 20px' : '28px 32px',
          }}
        >
          <div style={{ width: 36, height: 2, background: '#C2B2A0', margin: '0 0 16px' }} />
          <h3
            style={{
              margin: 0,
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Why Complimentary
          </h3>
          <p
            className="sov-justify sov-justify-l sov-nohyph"
            lang="en-GB"
            style={{
              margin: '10px 0 0',
              fontSize: isMobile ? 14 : 15,
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            We stand against homeowners spending thousands on a home they end up unhappy with, regretting a
            decision that should have been one of their best. The design pack exists so that never becomes
            your story.
          </p>
        </motion.div>

        {SHOW_REVIEW && (
          <motion.figure
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={
              isMobile
                ? { margin: '40px 0 0', maxWidth: 1000, position: 'relative', overflow: 'visible' }
                : {
                    margin: '56px auto 0',
                    maxWidth: 1000,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 6,
                    background: '#141414',
                    aspectRatio: '16 / 9',
                  }
            }
          >
            {/* Mobile: the photo stands on its own and the review sits below it as normal text.
                Desktop: the review sits over the photo, on a gradient. */}
            {isMobile ? (
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 6,
                  background: '#141414',
                  aspectRatio: '4 / 5',
                }}
              >
                {reviewImage}
              </div>
            ) : (
              <>
                {reviewImage}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background:
                      'linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.55) 35%, rgba(10,10,10,0) 65%)',
                  }}
                />
              </>
            )}
            <figcaption
              style={
                isMobile
                  ? { position: 'static', padding: '22px 4px 0', textAlign: 'left' }
                  : {
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: '0 44px 40px',
                      maxWidth: 700,
                      textAlign: 'left',
                    }
              }
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'block',
                  color: '#C2B2A0',
                  fontSize: isMobile ? 40 : 52,
                  lineHeight: 0.8,
                  fontFamily: 'Georgia, serif',
                }}
              >
                {'“'}
              </span>
              <blockquote
                style={{
                  margin: 0,
                  color: '#FFFFFF',
                  fontSize: isMobile ? 16 : 20,
                  lineHeight: isMobile ? 1.55 : 1.5,
                  fontWeight: 400,
                }}
              >
                {REVIEW.quote}
              </blockquote>
              <p
                style={{
                  margin: '14px 0 0',
                  color: '#C2B2A0',
                  fontSize: 12,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                {REVIEW.name}
              </p>
            </figcaption>
          </motion.figure>
        )}
      </div>
    </section>
  );
}
