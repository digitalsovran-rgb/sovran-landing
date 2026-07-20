import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const items = [
  {
    label: 'Floor Plans',
    body: 'Precise architectural drawings showing the full layout of your proposed extension — every dimension, door, and window positioned — so you can see exactly how your new space will live before a single wall moves.',
  },
  {
    label: 'Moodboard',
    body: 'A curated visual reference combining materials, finishes, and textures that translate your brief into a clear aesthetic direction — something you can see, refine, and align on before design begins.',
  },
  {
    label: '3D Visuals',
    body: 'Photorealistic renders of your completed extension, inside and out, from every angle. See your home transformed before construction begins.',
  },
  {
    label: 'Comprehensive Proposal',
    body: 'A detailed project document covering your estimated budget, build timeline, and planning potential. The full picture, in writing, before you commit to anything.',
  },
];

function BlueprintCard({
  item,
  delay,
  isInView,
}: {
  item: (typeof items)[0];
  delay: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="blueprint-card"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      style={{
        backgroundColor: '#ede9e3',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '4px',
        padding: '32px 28px',
      }}
    >
      <span
        className="blueprint-card-label"
        style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: 600,
          color: '#c9a96e',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '14px',
        }}
      >
        {item.label}
      </span>
      <h3
        className="blueprint-card-title"
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#0a0a0a',
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
          marginBottom: '10px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {item.label}
      </h3>
      <p
        className="blueprint-card-body"
        style={{
          fontSize: '13px',
          fontWeight: 400,
          color: 'rgba(0,0,0,0.55)',
          lineHeight: 1.7,
          letterSpacing: 'normal',
        }}
      >
        {item.body}
      </p>
    </motion.div>
  );
}

export default function BlueprintSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });

  return (
    <section ref={ref} style={{ backgroundColor: '#f5f0eb', padding: '100px 0' }}>
      <div className="inner">
        <div
          className="blueprint-grid"
          style={{
            display: 'flex',
            gap: '80px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left column */}
          <div className="blueprint-left" style={{ flex: '0 0 40%', maxWidth: '40%' }}>
            <motion.p
              initial={{ opacity: 0, x: -60 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.2em',
                color: '#c9a96e',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}
            >
              Complimentary With Every Consultation
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -60 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(34px, 3.65vw, 50px)',
                fontWeight: 900,
                color: '#0a0a0a',
                letterSpacing: '-0.005em',
                lineHeight: 1.05,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Your Sovran Home Transformation Blueprint
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -60 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              style={{
                fontSize: '15px',
                fontWeight: 400,
                color: 'rgba(0,0,0,0.55)',
                marginTop: '20px',
                lineHeight: 1.65,
                letterSpacing: 'normal',
              }}
            >
              Before your project begins, receive a comprehensive concept design package — built
              around your property, your brief, and your vision.
            </motion.p>
          </div>

          {/* Right column — 2x2 item grid */}
          <div
            className="blueprint-items-grid"
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}
          >
            {items.map((item, i) => (
              <BlueprintCard key={item.label} item={item} delay={i * 0.1} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
