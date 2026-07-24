import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Ruler, Palette, Video, FileText, CheckCircle } from 'lucide-react';

const checklist = [
  'Every measurement is real, taken on-site by our own team',
  'Every drawing reflects what will actually be built',
  'Every visual shows your finished extension before it exists',
  'Every figure comes from a full assessment, not a guess',
];

const tiles = [
  {
    icon: Ruler,
    label: 'Floor Plans',
    desc: 'Precise architectural drawings of your proposed extension, every dimension positioned and ready for planning.',
  },
  {
    icon: Palette,
    label: 'Moodboard',
    desc: 'Materials, finishes and textures curated around your property and your brief.',
  },
  {
    icon: Video,
    label: '3D Visuals & Walkthrough',
    desc: 'A photorealistic render and walkthrough video of your completed extension, seen before construction begins.',
  },
  {
    icon: FileText,
    label: 'Comprehensive Proposal',
    desc: 'Full budget, build timeline and planning potential, set out in writing.',
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
      style={{
        backgroundColor: '#ede9e3',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: '6px',
        padding: '32px 28px',
      }}
    >
      <Icon size={24} color="#0a0a0a" strokeWidth={1.75} />
      <h3
        style={{
          fontSize: '17px',
          fontWeight: 600,
          color: '#0a0a0a',
          letterSpacing: '-0.005em',
          marginTop: '18px',
          marginBottom: '8px',
        }}
      >
        {tile.label}
      </h3>
      <p
        style={{
          fontSize: '14px',
          fontWeight: 400,
          color: 'rgba(0,0,0,0.55)',
          lineHeight: 1.6,
          letterSpacing: 'normal',
        }}
      >
        {tile.desc}
      </p>
    </motion.div>
  );
}

export default function WhatYouGet() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });

  return (
    <section ref={ref} data-bg="light" style={{ backgroundColor: '#f5f0eb', padding: '100px 0' }}>
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
          An Architectural Design Pack
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(32px, 3.85vw, 48px)',
            fontWeight: 900,
            color: '#0a0a0a',
            letterSpacing: '-0.005em',
            lineHeight: 1.1,
          }}
        >
          Everything You Need To Know For Your Extension.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(0,0,0,0.55)',
            lineHeight: 1.65,
            letterSpacing: 'normal',
            maxWidth: '600px',
            margin: '20px auto 0',
          }}
        >
          A complete architectural package, built around your home, complimentary when you begin
          your project with Sovran, worth <strong style={{ fontWeight: 700 }}>£2,500</strong>.
        </motion.p>

        <div
          style={{
            marginTop: '56px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}
          className="wyg-grid"
        >
          {tiles.map((tile, i) => (
            <Tile key={tile.label} tile={tile} delay={i * 0.1} isInView={isInView} />
          ))}
        </div>

        <div
          className="wyg-checklist"
          style={{
            marginTop: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            columnGap: '32px',
            rowGap: '16px',
          }}
        >
          {checklist.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.06, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
            >
              <CheckCircle size={18} color="#c9a96e" strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#0a0a0a',
                  lineHeight: 1.5,
                  letterSpacing: 'normal',
                }}
              >
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
