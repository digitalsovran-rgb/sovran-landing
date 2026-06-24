import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    num: '01',
    label: 'Consultation',
    tooltip: 'We learn about your project, vision, and budget. No commitment required.',
  },
  {
    num: '02',
    label: 'Design',
    tooltip: 'Full architectural drawings, 3D renders, and material selections tailored to your home. Includes interior design and structural engineering.',
  },
  {
    num: '03',
    label: 'Planning',
    tooltip: 'We handle every submission. Former planning officers ensure the strongest possible application.',
  },
  {
    num: '04',
    label: 'Build',
    tooltip: "Our construction team works to contract-backed milestones. You always know what's happening on site.",
  },
  {
    num: '05',
    label: 'Handover',
    tooltip: 'A full walkthrough of your completed space. Snagging handled before we leave.',
  },
];

function StepItem({
  step,
  i,
  isInView,
}: {
  step: (typeof steps)[0];
  i: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 40 }}
      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '24px 20px',
        backgroundColor: hovered ? '#f5f0eb' : 'transparent',
        transition: 'background-color 0.3s ease',
        cursor: 'default',
      }}
    >
      <span
        style={{
          display: 'block',
          fontSize: '48px',
          fontWeight: 900,
          color: hovered ? '#0a0a0a' : 'rgba(201,169,110,0.4)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          transition: 'color 0.3s ease',
        }}
      >
        {step.num}
      </span>

      <span
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: hovered ? '#0a0a0a' : '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginTop: '8px',
          transition: 'color 0.3s ease',
        }}
      >
        {step.label}
      </span>

      <div
        style={{
          fontSize: '13px',
          lineHeight: 1.6,
          color: '#0a0a0a',
          maxWidth: '220px',
          margin: '12px auto 0',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        {step.tooltip}
      </div>

      {i < steps.length - 1 && (
        <div
          style={{
            position: 'absolute',
            right: '-1px',
            top: '48px',
            width: 0,
            height: 0,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderLeft: '6px solid rgba(255,255,255,0.2)',
            zIndex: 2,
          }}
        />
      )}
    </motion.div>
  );
}

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });

  return (
    <section ref={ref} style={{ backgroundColor: '#0a0a0a', padding: '48px 0' }}>
      <div className="process-inner">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(36px, 4.5vw, 52px)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: '#f5f0eb',
            marginBottom: '60px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          A Seamless Process
        </motion.p>

        <div
          className="process-row"
          style={{
            display: 'flex',
            position: 'relative',
            width: '100%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '48px',
              left: '10%',
              right: '10%',
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              zIndex: 0,
            }}
          />

          {steps.map((step, i) => (
            <StepItem key={step.num} step={step} i={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
