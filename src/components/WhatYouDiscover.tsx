import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Home, TrendingUp, ClipboardCheck, Wallet, LayoutGrid, ShieldAlert } from 'lucide-react';
import PulseRing from './PulseRing';
import HandHint from './HandHint';
import MoreHint from './MoreHint';

const tiles = [
  {
    icon: Home,
    label: 'Suitability',
    desc: 'Every property presents its own challenges, from a new build to a basement. We understand yours before the first line is drawn.',
  },
  {
    icon: TrendingUp,
    label: 'Value Increase',
    desc: 'A clear roadmap of how your investment with Sovran adds to your property, for years to come.',
  },
  {
    icon: ClipboardCheck,
    label: 'Planning Potential',
    desc: 'A professional overview of the best path and the documents to submit, so your application is approved first time, from householder consent to a full planning application.',
  },
  {
    icon: Wallet,
    label: 'Budget & Timeline',
    desc: 'A price that holds, protected by airtight contracts, with every milestone agreed before work begins.',
  },
  {
    icon: LayoutGrid,
    label: 'Layout Ideas',
    desc: 'Architecture, bespoke joinery and interior design work as one team, so we bring ideas and statement details to your property that go beyond what you had imagined.',
  },
  {
    icon: ShieldAlert,
    label: 'Risk Assessment',
    desc: 'We have faced and solved some of the most demanding challenges in construction, so problems are spotted early. If something surfaces midway, our team is trained to handle it.',
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
  index,
  delay,
  isInView,
  descOpen,
  onToggleDesc,
}: {
  tile: TileData;
  index: number;
  delay: number;
  isInView: boolean;
  descOpen: boolean;
  onToggleDesc: () => void;
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
      <p
        id={descId}
        onClick={onToggleDesc}
        style={{
          ...descStyle,
          cursor: 'pointer',
          ...(descOpen
            ? {}
            : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }),
        }}
      >
        {tile.desc}
      </p>
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
        <MoreHint
          variant="plus"
          expanded={descOpen}
          onToggle={onToggleDesc}
          controlsId={descId}
          label="Show full description"
        />
      </div>
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
  tileRef,
  showHand,
}: {
  tile: TileData;
  index: number;
  delay: number;
  isInView: boolean;
  open: boolean;
  opened: boolean;
  onToggle: () => void;
  tileRef?: React.Ref<HTMLDivElement>;
  showHand?: boolean;
}) {
  const Icon = tile.icon;
  const descId = `wyd-desc-${index}`;
  return (
    <motion.div
      ref={tileRef}
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
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <PulseRing size={64} tone="dark" pulse={!opened} delay={index * 0.3}>
              <Icon size={34} color="#C2B2A0" strokeWidth={1.75} />
            </PulseRing>
            {index === 0 && <HandHint show={Boolean(showHand)} tone="dark" />}
          </span>
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
  const [handHint, setHandHint] = useState<'idle' | 'show' | 'done'>('idle');
  // Desktop only: which tile descriptions are expanded past their two line preview.
  const [descOpen, setDescOpen] = useState<Set<number>>(() => new Set());
  const firstTileRef = useRef<HTMLDivElement>(null);
  const firstTileInView = useInView(firstTileRef, { once: true, amount: 0.8 });

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Mobile only: one tap-hint hand over the first tile's icon, a second after that tile
  // scrolls into view, unless a tile has been opened by then.
  useEffect(() => {
    if (!isMobile || !firstTileInView) return;
    const timer = window.setTimeout(() => setHandHint((h) => (h === 'idle' ? 'show' : h)), 1000);
    return () => window.clearTimeout(timer);
  }, [isMobile, firstTileInView]);

  useEffect(() => {
    if (handHint !== 'show') return;
    const timer = window.setTimeout(() => setHandHint('done'), 3400);
    return () => window.clearTimeout(timer);
  }, [handHint]);

  const toggleDesc = (i: number) => {
    setDescOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggle = (i: number) => {
    setHandHint('done');
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
          For You To Start
        </motion.p>

        <motion.h2
          className="sov-h2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            color: 'var(--sov-white)',
          }}
        >
          The Life You Want, Drawn First.
        </motion.h2>

        <motion.p
          className="sov-justify sov-justify-c"
          lang="en-GB"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.65,
            letterSpacing: 'normal',
            maxWidth: '620px',
            margin: '20px auto 0',
          }}
        >
          Building your dream home is a big challenge, and Sovran is committed to taking it on with you.
          Whether it is a new build, an extension, a renovation or a basement, you start with floor
          plans, 3D visuals, a mood board and a full project proposal, everything you need to begin
          bringing your home to life.
        </motion.p>

        <div
          className="wyd-grid"
          style={{
            marginTop: '56px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: '24px',
            rowGap: '40px',
            alignItems: isMobile ? 'flex-start' : 'start',
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
                tileRef={i === 0 ? firstTileRef : undefined}
                showHand={i === 0 && handHint === 'show'}
              />
            ) : (
              <Tile
                key={tile.label}
                tile={tile}
                index={i}
                delay={i * 0.08}
                isInView={isInView}
                descOpen={descOpen.has(i)}
                onToggleDesc={() => toggleDesc(i)}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
