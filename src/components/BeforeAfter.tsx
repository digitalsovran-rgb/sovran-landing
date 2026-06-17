import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const cards = [
  { before: '/media/before1.png', after: '/media/after1.png' },
  { before: '/media/before2.png', after: '/media/after2.png' },
  { before: '/media/before3.png', after: '/media/after3.png' },
];

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  fontSize: '10px',
  fontWeight: 500,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#ffffff',
  backgroundColor: 'rgba(0,0,0,0.5)',
  padding: '6px 12px',
  zIndex: 2,
  pointerEvents: 'none',
};

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#f5f0eb', padding: '100px 0' }}
    >
      <div className="inner" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 900,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          See The Transformation
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="inner"
      >
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Before half */}
              <div
                style={{
                  position: 'relative',
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={card.before}
                  alt={`Before ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
                <div style={{ ...labelStyle, top: 0, left: 0 }}>Before</div>
              </div>

              {/* After half */}
              <div
                style={{
                  position: 'relative',
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={card.after}
                  alt={`After ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
                <div style={{ ...labelStyle, bottom: 0, left: 0 }}>After</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
