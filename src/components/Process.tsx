import { useState } from 'react';
import { motion } from 'framer-motion';

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

function StepItem({ step, i }: { step: (typeof steps)[0]; i: number }) {
  const [iconHovered, setIconHovered] = useState(false);

  return (
    <div
      style={{
        flex: 1,
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '0 8px',
      }}
    >
      {/* Step number */}
      <span
        style={{
          display: 'block',
          fontSize: '48px',
          fontWeight: 900,
          color: 'rgba(201,169,110,0.4)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {step.num}
      </span>

      {/* Step label */}
      <span
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginTop: '8px',
        }}
      >
        {step.label}
      </span>

      {/* + circle with tooltip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '10px',
          position: 'relative',
        }}
      >
        {/* Tooltip */}
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '12px',
            backgroundColor: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '12px',
            lineHeight: 1.6,
            padding: '16px 20px',
            maxWidth: '200px',
            width: 'max-content',
            pointerEvents: 'none',
            opacity: iconHovered ? 1 : 0,
            transition: 'opacity 0.2s',
            zIndex: 10,
            textAlign: 'left',
          }}
        >
          {step.tooltip}
          {/* Triangle border */}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(255,255,255,0.12)',
            }}
          />
          {/* Triangle fill */}
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #0a0a0a',
            }}
          />
        </div>

        {/* Pulsing + icon */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
          style={{
            width: '20px',
            height: '20px',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          +
        </motion.div>
      </div>

      {/* Arrowhead at right edge of step (except last) */}
      {i < steps.length - 1 && (
        <div
          style={{
            position: 'absolute',
            right: '-1px',
            top: '21px',
            width: 0,
            height: 0,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderLeft: '6px solid rgba(255,255,255,0.2)',
          }}
        />
      )}
    </div>
  );
}

export default function Process() {
  return (
    <section style={{ backgroundColor: '#0a0a0a', padding: '80px 0' }}>
      <div className="process-inner">
        <div
          className="process-row"
          style={{
            display: 'flex',
            position: 'relative',
            width: '100%',
          }}
        >
          {/* Connecting line behind all steps */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '10%',
              right: '10%',
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              zIndex: 0,
            }}
          />

          {steps.map((step, i) => (
            <StepItem key={step.num} step={step} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
