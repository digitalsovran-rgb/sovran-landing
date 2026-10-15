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

const circle = (size: number): React.CSSProperties => ({
  width: size,
  height: size,
  borderRadius: '50%',
  border: '1px solid rgba(194,178,160,0.65)',
  background: 'rgba(194,178,160,0.12)',
  display: 'grid',
  placeItems: 'center',
});

const rotating = (on: boolean, degrees: number): React.CSSProperties => ({
  display: 'inline-flex',
  transform: on ? `rotate(${degrees}deg)` : 'rotate(0deg)',
  transition: 'transform 0.3s ease',
});

// A small "there is more" control: a ringed chevron or plus, three pulsing dots, or a rule with
// a chevron in the middle. Used to expand text that is shortened on first view.
export default function MoreHint({ variant, expanded, onToggle, controlsId, label, pulse }: MoreHintProps) {
  const animating = Boolean(pulse) && !expanded;

  let content: React.ReactNode;

  if (variant === 'chevron') {
    content = (
      <span className={animating ? 'sov-nudge' : undefined} style={{ display: 'inline-flex' }}>
        <span style={circle(40)}>
          <span style={rotating(expanded, 180)}>
            <ChevronDown size={20} strokeWidth={1.6} color="#FFFFFF" />
          </span>
        </span>
      </span>
    );
  } else if (variant === 'plus') {
    content = (
      <span className={animating ? 'sov-beat' : undefined} style={circle(30)}>
        <span style={rotating(expanded, 45)}>
          <Plus size={16} strokeWidth={1.6} color="#FFFFFF" />
        </span>
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
        <span style={circle(28)}>
          <span style={rotating(expanded, 180)}>
            <ChevronDown size={16} strokeWidth={1.6} color="#FFFFFF" />
          </span>
        </span>
      </span>
    );
  } else {
    const line: React.CSSProperties = { flex: 1, height: '1px', background: 'rgba(255,255,255,0.25)' };
    content = (
      <>
        <span style={line} />
        <span className={animating ? 'sov-nudge' : undefined} style={{ display: 'inline-flex' }}>
          <span style={circle(36)}>
            <span style={rotating(expanded, 180)}>
              <ChevronDown size={18} strokeWidth={1.6} color="#FFFFFF" />
            </span>
          </span>
        </span>
        <span style={line} />
      </>
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
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        display: variant === 'rule' ? 'flex' : 'inline-flex',
        alignItems: 'center',
        color: '#FFFFFF',
        ...(variant === 'rule' ? { width: '100%', gap: '14px' } : {}),
      }}
    >
      {content}
    </button>
  );
}
