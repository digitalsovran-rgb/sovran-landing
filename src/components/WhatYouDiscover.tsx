import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Home, TrendingUp, ClipboardCheck, Wallet, LayoutGrid, ShieldAlert } from 'lucide-react';

const tiles = [
  {
    icon: Home,
    label: 'Suitability',
    desc: 'Whether your home and site genuinely support the extension you have in mind.',
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
    desc: 'Realistic figures, not a placeholder range.',
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

function Tile({
  tile,
  delay,
  isInView,
}: {
  tile: (typeof tiles)[0];
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
      <Icon size={22} color="#c9a96e" strokeWidth={1.75} style={{ margin: '0 auto' }} />
      <h3
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#f5f0eb',
          letterSpacing: '0.01em',
          marginTop: '16px',
          marginBottom: '8px',
        }}
      >
        {tile.label}
      </h3>
      <p
        style={{
          fontSize: '13px',
          fontWeight: 400,
          color: 'rgba(245,240,235,0.65)',
          lineHeight: 1.6,
          letterSpacing: 'normal',
        }}
      >
        {tile.desc}
      </p>
    </motion.div>
  );
}

export default function WhatYouDiscover() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const [ctaHovered, setCtaHovered] = useState(false);

  const scrollToForm = () => {
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} style={{ backgroundColor: '#0a0a0a', padding: '100px 0' }}>
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
            color: '#c9a96e',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Before You Spend A Penny
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(32px, 3.85vw, 48px)',
            fontWeight: 900,
            color: '#f5f0eb',
            letterSpacing: '-0.005em',
            lineHeight: 1.1,
          }}
        >
          Know Exactly What&apos;s Possible, Before You Decide Anything.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(245,240,235,0.6)',
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
          }}
        >
          {tiles.map((tile, i) => (
            <Tile key={tile.label} tile={tile} delay={i * 0.08} isInView={isInView} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          style={{ marginTop: '56px', textAlign: 'center' }}
        >
          <button
            type="button"
            onClick={scrollToForm}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '400px',
              margin: '0 auto',
              backgroundColor: ctaHovered ? '#e1dcd8' : '#f5f0eb',
              color: '#0a0a0a',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '16px 32px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          >
            Claim Your Design Package
          </button>
        </motion.div>
      </div>
    </section>
  );
}
