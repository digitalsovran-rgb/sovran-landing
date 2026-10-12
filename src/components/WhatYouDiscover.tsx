import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Home, TrendingUp, ClipboardCheck, Wallet, LayoutGrid, ShieldAlert } from 'lucide-react';
import PulseRing from './PulseRing';

const tiles = [
  {
    icon: Home,
    label: 'Suitability',
    desc: 'Which extension ideas suit your home best, based on your plot, surroundings and existing architecture.',
  },
  {
    icon: TrendingUp,
    label: 'Value Increase',
    desc: "An estimate of what this project could add to your property's value.",
  },
  {
    icon: ClipboardCheck,
    label: 'Planning Potential',
    desc: "A clear read on what's likely to be approved, before you apply.",
  },
  {
    icon: Wallet,
    label: 'Budget & Timeline',
    desc: 'Realistic figures from the current market prices.',
  },
  {
    icon: LayoutGrid,
    label: 'Layout Ideas',
    desc: 'Suggested configurations you may not have thought of.',
  },
  {
    icon: ShieldAlert,
    label: 'Risk Assessment',
    desc: 'The issues that could derail the project, identified early.',
  },
];

type TileData = (typeof tiles)[0];

const descStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 400,
  color: 'rgba(255,255,255,0.65)',
  lineHeight: 1.6,
  letterSpacing: 'normal',
};

function Tile({
  tile,
  delay,
  isInView,
}: {
  tile: TileData;
  delay: number;
  isInView: boolean;
}) {
  const Icon = tile.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      style={{ textAlign: 'center' }}
    >
      <Icon size={22} color="#C2B2A0" strokeWidth={1.75} style={{ margin: '0 auto' }} />
      <h3
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--sov-white)',
          letterSpacing: '0.01em',
          marginTop: '16px',
          marginBottom: '8px',
        }}
      >
        {tile.label}
      </h3>
      <p style={descStyle}>{tile.desc}</p>
    </motion.div>
  );
}

function MobileTile({
  tile,
  index,
  delay,
  isInView,
  open,
  opened,
  onToggle,
}: {
  tile: TileData;
  index: number;
  delay: number;
  isInView: boolean;
  open: boolean;
  opened: boolean;
  onToggle: () => void;
}) {
  const Icon = tile.icon;
  const descId = `wyd-desc-${index}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      style={{ textAlign: 'center' }}
    >
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--sov-white)',
          letterSpacing: '0.01em',
          margin: 0,
        }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={descId}
          style={{
            background: 'none',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
            padding: 0,
            minHeight: '44px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            font: 'inherit',
            color: 'inherit',
            letterSpacing: 'inherit',
          }}
        >
          <PulseRing size={64} tone="dark" pulse={!opened} delay={index * 0.3}>
            <Icon size={34} color="#C2B2A0" strokeWidth={1.75} />
          </PulseRing>
          <span style={{ display: 'block', marginTop: '16px' }}>{tile.label}</span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={descId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ ...descStyle, marginTop: '8px' }}>{tile.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function WhatYouDiscover() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());
  const [opened, setOpened] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
    setOpened((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  };

  return (
    <section ref={ref} data-bg="dark" style={{ backgroundColor: '#0a0a0a', padding: '100px 0' }}>
      <div className="inner" style={{ maxWidth: '1000px' }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: 'var(--sov-greige-light)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Before You Start
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(32px, 3.85vw, 48px)',
            fontWeight: 900,
            color: 'var(--sov-white)',
            letterSpacing: '-0.005em',
            lineHeight: 1.1,
          }}
        >
          Know Exactly What&apos;s Possible.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.65,
            letterSpacing: 'normal',
            maxWidth: '620px',
            margin: '20px auto 0',
          }}
        >
          Your design package doesn&apos;t just show you a drawing. It answers the questions that
          actually decide whether this project is worth doing.
        </motion.p>

        <div
          className="wyd-grid"
          style={{
            marginTop: '56px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: '24px',
            rowGap: '40px',
            ...(isMobile ? { alignItems: 'flex-start' } : {}),
          }}
        >
          {tiles.map((tile, i) =>
            isMobile ? (
              <MobileTile
                key={tile.label}
                tile={tile}
                index={i}
                delay={i * 0.08}
                isInView={isInView}
                open={expanded.has(i)}
                opened={opened.has(i)}
                onToggle={() => toggle(i)}
              />
            ) : (
              <Tile key={tile.label} tile={tile} delay={i * 0.08} isInView={isInView} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
