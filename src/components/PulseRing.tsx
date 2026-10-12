import type { ReactNode } from 'react';

type PulseRingProps = {
  size: number;
  tone: 'dark' | 'light';
  pulse: boolean;
  delay: number;
  children: ReactNode;
};

// Ring that sits behind an icon to hint that the control is tappable. `pulse` turns the
// beat animation on; once a control has been opened the ring goes static and faint.
export default function PulseRing({ size, tone, pulse, delay, children }: PulseRingProps) {
  const ringStyle =
    tone === 'dark'
      ? { border: '1px solid rgba(194,178,160,0.6)', background: 'rgba(194,178,160,0.10)' }
      : { border: '1px solid rgba(74,68,60,0.55)', background: 'rgba(74,68,60,0.08)' };

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
      }}
    >
      <span
        className={pulse ? 'sov-beat' : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          ...ringStyle,
          ...(pulse ? { animationDelay: `${delay}s` } : { opacity: 0.35 }),
        }}
      />
      <span
        className="sov-float"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'inline-flex',
          animationDelay: `${delay}s`,
        }}
      >
        {children}
      </span>
    </span>
  );
}
