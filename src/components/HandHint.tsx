import { motion } from 'framer-motion';

type HandHintProps = {
  show: boolean;
  tone: 'dark' | 'light';
};

const TONES = {
  dark: { main: '#FFFFFF', halo: '#0A0A0A' },
  light: { main: '#0A0A0A', halo: '#FFFFFF' },
};

// Geometry copied from the lucide "pointer" icon (viewBox 0 0 24 24). FINGER_PATH is the index
// finger, the tall narrow path that reaches the smallest y (y = 2) and is centred on x = 8.
const FINGER_PATH = 'M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10';
const HAND_PATHS = [
  'M22 14a8 8 0 0 1-8 8',
  'M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2',
  'M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1',
  'M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15',
];

// Ripple at the fingertip: finger centre x, topmost finger y plus 1.5.
const RIPPLE_CX = 8;
const RIPPLE_CY = 3.5;

const TOTAL_S = 3.4;
const TAP_TIMES = [0, 0.2, 0.36, 0.52, 0.68, 0.84, 1];
const tapTransition = { duration: TOTAL_S, ease: 'easeInOut' as const, times: TAP_TIMES };

// A pointing hand whose index finger taps twice, played once per mount. It sits inside a
// position-relative wrapper around the icon it points at. Only the finger and the ripple at
// its tip move during the taps; the rest of the hand is static.
export default function HandHint({ show, tone }: HandHintProps) {
  if (!show) return null;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  const { main, halo } = TONES[tone];

  // Each layer draws the static paths and the animated finger with the same stroke, so the
  // wide halo layer underneath and the main layer on top always move together.
  const layer = (stroke: string, strokeWidth: string) => (
    <g stroke={stroke} strokeWidth={strokeWidth}>
      {HAND_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
      <motion.path
        d={FINGER_PATH}
        initial={{ y: 0 }}
        animate={{ y: [0, 0, 1.7, 0, 1.7, 0, 0] }}
        transition={tapTransition}
      />
    </g>
  );

  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0, x: 8, y: 8 }}
      animate={{ opacity: [0, 0.5, 0.5, 0], x: [8, 0, 0, 4], y: [8, 0, 0, 4] }}
      transition={{ duration: TOTAL_S, ease: 'easeInOut', times: [0, 0.1, 0.84, 1] }}
      style={{
        position: 'absolute',
        // Places the fingertip (8, 2 in the 24 unit geometry, after the -32deg rotation)
        // about 22px right of and 14px below the centre of the icon being pointed at.
        left: 'calc(50% + 34px)',
        top: 'calc(50% + 23px)',
        width: 34,
        height: 34,
        margin: '-17px 0 0 -17px',
        pointerEvents: 'none',
        zIndex: 3,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))',
      }}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        overflow="visible"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: 'rotate(-32deg)', display: 'block' }}
      >
        {layer(halo, '3')}
        {layer(main, '1.5')}

        <motion.circle
          cx={RIPPLE_CX}
          cy={RIPPLE_CY}
          r="2"
          fill="none"
          stroke={main}
          strokeWidth="0.6"
          style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{
            scale: [0.4, 0.4, 1.8, 0.4, 1.8, 0.4, 0.4],
            opacity: [0, 0, 0.85, 0, 0.85, 0, 0],
          }}
          transition={tapTransition}
        />
      </svg>
    </motion.span>
  );
}
