import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const points = [
  { num: '01', text: 'Budget overruns' },
  { num: '02', text: 'Planning refusals' },
  { num: '03', text: 'No accountability' },
  { num: '04', text: 'Endless delays' },
  { num: '05', text: 'Compromised quality' },
];

function PainTile({
  point,
  delay,
  isInView,
}: {
  point: (typeof points)[0];
  delay: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: `2px solid ${hovered ? 'rgba(201,169,110,0.6)' : 'rgba(201,169,110,0.3)'}`,
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        transition: 'background-color 0.25s, border-left-color 0.25s',
      }}
    >
      <span
        style={{
          fontSize: '13px',
          fontWeight: 900,
          color: 'rgba(201,169,110,0.6)',
          letterSpacing: '0.1em',
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {point.num}
      </span>
      <span
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        }}
      >
        {point.text}
      </span>
    </motion.div>
  );
}

export default function PainPoints() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });

  return (
    <section
      ref={ref}
      style={{ backgroundColor: '#0a0a0a', padding: '100px 0' }}
    >
      <div className="inner">
        <div
          className="pain-grid"
          style={{
            display: 'flex',
            gap: '80px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left column */}
          <div style={{ flex: '0 0 40%', maxWidth: '40%' }}>
            <motion.h2
              initial={{ opacity: 0, x: -60 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(34px, 3.8vw, 52px)',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
              }}
            >
              Extending your home shouldn&apos;t feel like a nightmare.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -60 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              style={{
                fontSize: '15px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.5)',
                marginTop: '16px',
                lineHeight: 1.65,
                letterSpacing: 'normal',
              }}
            >
              Yet for many homeowners, it does.
            </motion.p>
          </div>

          {/* Right column — tiles */}
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '8px',
            }}
          >
            {points.map((point, i) => (
              <PainTile
                key={point.num}
                point={point}
                delay={i * 0.1}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
