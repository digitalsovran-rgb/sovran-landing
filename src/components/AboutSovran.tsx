import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

// Client review. Keep the quote word for word as supplied by the client. It is split in two
// for the Read more control; joined with a single space, the halves are the full quote.
const SHOW_REVIEW = true;
const QUOTE_1 =
  'Ever since I was a child, I dreamed of living in a home filled with natural light, open space, and beautiful views. After years in a typical three-bedroom house, walking into this home felt life-changing.';
const QUOTE_2 =
  "The soaring ceilings, floor-to-ceiling windows, and incredible sense of space make every day feel special. More than anything, I'm excited for the memories our family will create here for years to come.";
const REVIEW = {
  image: '/media/newreview.webp',
  alt: 'A Sovran home designed for the Harrington family',
  name: 'Olivia Harrington',
};

// One statement under the heading.
const ABOUT_STATEMENT =
  'We believe in a tailored design process, with each space built for a family who will spend the years ahead there, growing and dreaming through the moments that define them. Committed to transcending any single style, we make the final handover a unique experience, one most people only imagine.';

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

export default function AboutSovran() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [moreOpen, setMoreOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Body text inside the Why Complimentary card.
  const cardTextStyle: React.CSSProperties = {
    fontSize: isMobile ? 14 : 15,
    lineHeight: 1.65,
    color: 'rgba(255,255,255,0.72)',
  };

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
          <p
            style={{
              margin: '0 0 10px',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: '#C2B2A0',
            }}
          >
            Why Complimentary
          </p>
          <h3
            style={{
              margin: 0,
              color: '#FFFFFF',
              fontSize: isMobile ? 18 : 22,
              fontWeight: 800,
              lineHeight: 1.3,
              letterSpacing: '-0.005em',
            }}
          >
            Nearly 1 In 3 UK Homeowners Regret Their Renovation Choices.
          </h3>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
            Direct Line research, November 2025 ·{' '}
            <a
              href="https://www.directlinegroup.co.uk/en/news/brand-news/2025/06112025.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#C2B2A0', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Read the article ↗
            </a>
          </p>
          <p
            className="sov-justify sov-justify-l sov-nohyph"
            lang="en-GB"
            style={{ ...cardTextStyle, margin: '14px 0 0' }}
          >
            We stand against homeowners spending hundreds of thousands of pounds on a project they regret,
            misinformed, misadvised or misguided along the way.
          </p>
          <AnimatePresence initial={false}>
            {moreOpen && (
              <motion.p
                key="more"
                className="sov-justify sov-justify-l sov-nohyph"
                lang="en-GB"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{ ...cardTextStyle, overflow: 'hidden', marginTop: 10 }}
              >
                The design pack exists to test each decision on paper first, long before anything is built. In
                the research, layout, lighting and quality topped the list of regrets, and more than half of those
                homeowners paid to have the work redone.
              </motion.p>
            )}
          </AnimatePresence>
          <button
            type="button"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((open) => !open)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              marginTop: 10,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              fontWeight: 600,
              color: '#C2B2A0',
            }}
          >
            {moreOpen ? 'Less' : 'Read more'}
            <ChevronDown
              size={16}
              color="#C2B2A0"
              aria-hidden="true"
              style={{ transform: moreOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
            />
          </button>
        </motion.div>

        {SHOW_REVIEW && (
          <motion.figure
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              margin: isMobile ? '40px 0 0' : '56px auto 0',
              maxWidth: 1000,
              overflow: 'visible',
            }}
          >
            <p
              style={{
                margin: '0 0 8px',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#C2B2A0',
                textAlign: 'left',
              }}
            >
              In Their Words
            </p>
            <h3
              style={{
                margin: '0 0 18px',
                color: '#FFFFFF',
                fontSize: isMobile ? 20 : 26,
                fontWeight: 800,
                lineHeight: 1.25,
                letterSpacing: '-0.005em',
                textAlign: 'left',
              }}
            >
              A Dream Finally Realised.
            </h3>
            {/* The photo stands on its own, with the review below it as normal text. */}
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 6,
                background: '#141414',
                aspectRatio: isMobile ? '1 / 1' : '16 / 9',
              }}
            >
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
                  objectPosition: isMobile ? '25% center' : 'center',
                  display: 'block',
                }}
              />
            </div>
            <figcaption
              style={{
                position: 'static',
                padding: isMobile ? '18px 2px 0' : '22px 4px 0',
                maxWidth: 640,
                textAlign: 'left',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'block',
                  color: '#C2B2A0',
                  fontSize: isMobile ? 30 : 36,
                  lineHeight: 0.8,
                  fontFamily: 'Georgia, serif',
                }}
              >
                {'“'}
              </span>
              <blockquote
                style={{
                  margin: '6px 0 0',
                  color: 'rgba(255,255,255,0.86)',
                  fontSize: isMobile ? 13 : 15,
                  lineHeight: 1.65,
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  fontStyle: 'normal',
                }}
              >
                {QUOTE_1}
                <AnimatePresence initial={false}>
                  {reviewOpen && (
                    <motion.span
                      key="quote-2"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ display: 'block', marginTop: 8, overflow: 'hidden' }}
                    >
                      {QUOTE_2}
                    </motion.span>
                  )}
                </AnimatePresence>
              </blockquote>
              <button
                type="button"
                aria-expanded={reviewOpen}
                onClick={() => setReviewOpen((open) => !open)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: '10px 0 0',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  fontWeight: 600,
                  color: '#C2B2A0',
                }}
              >
                {reviewOpen ? 'Less' : 'Read her story'}
                <ArrowRight
                  size={14}
                  color="#C2B2A0"
                  aria-hidden="true"
                  style={{ transform: reviewOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                />
              </button>
              <p
                style={{
                  margin: '12px 0 0',
                  color: '#C2B2A0',
                  fontSize: 11,
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
