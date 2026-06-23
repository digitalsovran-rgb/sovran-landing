import { useState } from 'react';

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
  const [hovered, setHovered] = useState(false);

  return (
    <div
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
      {/* Step number */}
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

      {/* Step label */}
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

      {/* Tooltip text — visible on hover */}
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

      {/* Arrowhead at right edge (except last) */}
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
    </div>
  );
}

export default function Process() {
  return (
    <section style={{ backgroundColor: '#0a0a0a', padding: '80px 0' }}>
      <div className="process-inner">
        {/* Section title */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#c9a96e',
            marginBottom: '40px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Our Process
        </p>

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
              top: '48px',
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
