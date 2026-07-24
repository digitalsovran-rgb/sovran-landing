import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Ruler, Palette, Video, FileText } from 'lucide-react';

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
    <section ref={ref} style={{ backgroundColor: '#f5f0eb', padding: '100px 0' }}>
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
          The Concept Design Package
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
          Everything You Need Before You Commit To A Single Brick.
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
          A complete architectural package, built around your home, at no cost to you — worth £2,500.
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

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: '#c9a96e',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginTop: '48px',
          }}
        >
          Measured Site Survey Included: No Estimates, No Guesswork.
        </motion.p>
      </div>
    </section>
  );
}
