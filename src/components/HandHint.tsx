import { motion } from 'framer-motion';
import { Pointer } from 'lucide-react';

const HAND_ICON = Pointer;

type HandHintProps = {
  show: boolean;
  tone: 'dark' | 'light';
};

const TONES = {
  dark: { stroke: '#FFFFFF', fill: 'rgba(255,255,255,0.15)' },
  light: { stroke: '#0A0A0A', fill: 'rgba(255,255,255,0.85)' },
};

// A hand that taps twice over an icon and then fades out, played once per mount. It sits
// inside a position-relative wrapper around the icon it points at.
export default function HandHint({ show, tone }: HandHintProps) {
  if (!show) return null;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  const colours = TONES[tone];

  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0, scale: 1, y: 10 }}
      animate={{
        opacity: [0, 1, 1, 1, 1, 1, 1, 0],
        scale: [1, 1, 0.82, 1, 0.82, 1, 1, 1],
        y: [10, 0, 4, 0, 4, 0, 0, -4],
      }}
      transition={{
        duration: 3.2,
        ease: 'easeInOut',
        times: [0, 0.14, 0.3, 0.45, 0.6, 0.75, 0.88, 1],
      }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '42%',
        width: 30,
        height: 30,
        pointerEvents: 'none',
        zIndex: 3,
        display: 'inline-flex',
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))',
      }}
    >
      <HAND_ICON size={30} strokeWidth={1.5} stroke={colours.stroke} fill={colours.fill} />
    </motion.span>
  );
}
