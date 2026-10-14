import { motion } from 'framer-motion';

type HandHintProps = {
  show: boolean;
  tone: 'dark' | 'light';
};

const TONES = {
  dark: { fill: '#FFFFFF', stroke: '#0A0A0A' },
  light: { fill: '#0A0A0A', stroke: '#FFFFFF' },
};

const TOTAL_S = 3.4;
const TAP_TIMES = [0, 0.2, 0.36, 0.52, 0.68, 0.84, 1];

// A drawn hand whose index finger taps twice, played once per mount. It sits inside a
// position-relative wrapper around the icon it points at. Only the finger and the ripple at
// its tip move during the taps; the palm and thumb are static.
export default function HandHint({ show, tone }: HandHintProps) {
  if (!show) return null;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  const { fill, stroke } = TONES[tone];
  const shape = { fill, stroke, strokeWidth: 1.5, strokeLinejoin: 'round' as const };
  const tapTransition = { duration: TOTAL_S, ease: 'easeInOut' as const, times: TAP_TIMES };

  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0, x: 14, y: 14 }}
      animate={{ opacity: [0, 1, 1, 0], x: [14, 0, 0, 6], y: [14, 0, 0, 6] }}
      transition={{ duration: TOTAL_S, ease: 'easeInOut', times: [0, 0.1, 0.84, 1] }}
      style={{
        position: 'absolute',
        left: 'calc(50% + 12px)',
        top: 'calc(50% + 19px)',
        width: 56,
        height: 56,
        margin: '-28px 0 0 -28px',
        pointerEvents: 'none',
        zIndex: 3,
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
      }}
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 64 64"
        overflow="visible"
        style={{ transform: 'rotate(-32deg)', display: 'block' }}
      >
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: [1, 1, 0.78, 1, 0.78, 1, 1] }}
          transition={tapTransition}
        >
          <rect x="27" y="6" width="11" height="32" rx="5.5" {...shape} />
        </motion.g>

        <motion.circle
          cx="32.5"
          cy="6"
          r="5"
          fill="none"
          stroke={stroke}
          strokeWidth="1.25"
          style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{
            scale: [0.4, 0.4, 1.6, 0.4, 1.6, 0.4, 0.4],
            opacity: [0, 0, 0.8, 0, 0.8, 0, 0],
          }}
          transition={tapTransition}
        />

        <path
          d="M20 36 C20 33 22 31 25 31 L39 31 C43 31 46 34 46 38 L46 52 C46 56 43 59 39 59 L27 59 C23 59 20 56 20 52 Z"
          {...shape}
        />
        <path d="M20 42 C16 41 13 43 13 46 C13 49 16 51 20 52 Z" {...shape} />
      </svg>
    </motion.span>
  );
}
