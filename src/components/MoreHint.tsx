import { ChevronDown, Plus } from 'lucide-react';

type MoreHintProps = {
  variant: 'chevron' | 'plus' | 'dots' | 'rule';
  expanded: boolean;
  onToggle: () => void;
  controlsId?: string;
  // Accessible name while collapsed. While expanded the name is always "Show less".
  label: string;
  // Gentle attention animation, only while collapsed.
  pulse?: boolean;
};

// Icons only: no circle, border or background. A soft shadow keeps them readable on photos.
const iconStyle: React.CSSProperties = {
  color: '#FFFFFF',
  filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.55))',
};

const rotating = (on: boolean, degrees: number): React.CSSProperties => ({
  display: 'inline-flex',
  transform: on ? `rotate(${degrees}deg)` : 'rotate(0deg)',
  transition: 'transform 0.3s ease',
});

// A small "there is more" control: a down arrow, a plus, or three pulsing dots with an arrow.
// Used to expand text that is shortened on first view.
export default function MoreHint({ variant, expanded, onToggle, controlsId, label, pulse }: MoreHintProps) {
  const animating = Boolean(pulse) && !expanded;

  const arrow = (size: number) => (
    <span style={rotating(expanded, 180)}>
      <ChevronDown size={size} strokeWidth={1.8} color="#FFFFFF" style={iconStyle} />
    </span>
  );

  let content: React.ReactNode;

  if (variant === 'plus') {
    content = (
      <span style={rotating(expanded, 45)}>
        <Plus size={20} strokeWidth={1.8} color="#FFFFFF" style={iconStyle} />
      </span>
    );
  } else if (variant === 'dots') {
    const delays = ['0s', '0.2s', '0.4s'];
    content = (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        {delays.map((delay) => (
          <span
            key={delay}
            className={animating ? 'sov-dot' : undefined}
            style={
              {
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#C2B2A0',
                opacity: animating ? undefined : 0.7,
                '--sov-delay': delay,
              } as React.CSSProperties
            }
          />
        ))}
        {arrow(24)}
      </span>
    );
  } else {
    // 'chevron' and 'rule' are both a single down arrow.
    content = (
      <span className={animating ? 'sov-nudge' : undefined} style={{ display: 'inline-flex' }}>
        {arrow(28)}
      </span>
    );
  }

  return (
    <button
      type="button"
      className="sov-more"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={controlsId}
      aria-label={expanded ? 'Show less' : label}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        minWidth: 44,
        minHeight: 32,
        lineHeight: 0,
      }}
    >
      {content}
    </button>
  );
}
