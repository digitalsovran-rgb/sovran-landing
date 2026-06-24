import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const cards = [
  { before: '/media/before1.png', after: '/media/after1.png' },
  { before: '/media/before2.png', after: '/media/after2.png' },
  { before: '/media/before3.png?v=3', after: '/media/after3.png?v=2' },
];

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  fontSize: '28px',
  fontWeight: 900,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#ffffff',
  textShadow: '0 2px 8px rgba(0,0,0,0.6)',
  zIndex: 2,
  pointerEvents: 'none',
};

function ImageHalf({
  src,
  alt,
  filter,
  label,
  labelPosition,
  wrapperStyle,
}: {
  src: string;
  alt: string;
  filter?: string;
  label: string;
  labelPosition: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        ...wrapperStyle,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '300px',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          filter: filter,
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.5s ease',
        }}
      />
      <div style={{ ...labelStyle, ...labelPosition }}>{label}</div>
    </div>
  );
}

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '0px' });

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#f5f0eb', padding: '100px 0' }}
    >
      <div className="inner" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 900,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          See The Transformation
        </motion.h2>
      </div>

      <div className="inner">
        <div style={{ display: 'flex', gap: '16px' }}>
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: 'easeOut' }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <ImageHalf
                src={card.before}
                alt={`Before ${i + 1}`}
                filter="grayscale(55%) brightness(0.9)"
                label="Before"
                labelPosition={{ bottom: '16px', left: '50%', transform: 'translateX(-50%)' }}
                wrapperStyle={{ marginBottom: '8px' }}
              />
              <ImageHalf
                src={card.after}
                alt={`After ${i + 1}`}
                label="After"
                labelPosition={{ top: '16px', left: '50%', transform: 'translateX(-50%)' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
