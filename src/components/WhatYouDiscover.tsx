import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, LayoutGrid, Box, Milestone } from 'lucide-react';

// Each title is stored as two parts: joined by a space on desktop, split over two lines on mobile.
const items = [
  {
    icon: Compass,
    title: ['Your Planning', 'Potential'],
    text: 'An early read on what your property can gain approval for.',
  },
  {
    icon: LayoutGrid,
    title: ['Layout', 'Selection'],
    text: 'Options drawn for your space, ready to compare and refine.',
  },
  {
    icon: Box,
    title: ['Realistic', 'Renders'],
    text: "A true picture of what you're investing in, through 3D illustrations.",
  },
  {
    icon: Milestone,
    title: ['Your Project', 'Roadmap'],
    text: 'Each stage and its investment, with expert guidance.',
  },
];

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

export default function WhatYouDiscover() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <section data-bg="dark" style={{ backgroundColor: '#0A0A0A', padding: '100px 0' }}>
      <div className="inner" style={{ maxWidth: '1000px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '48px' }}
        >
          <p
            style={{
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              color: '#C2B2A0',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Your Design Pack
          </p>
          <h2
            className="sov-h2"
            style={{ color: '#FFFFFF', margin: 0, fontSize: isMobile ? 'clamp(28px, 7.6vw, 34px)' : undefined }}
          >
            Clarity Before Your
            <br />
            Biggest Investment.
          </h2>
        </motion.div>

        {/* Cards in a row stretch to the same height, since titles may wrap on mobile. */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '16px' : '24px',
            alignItems: 'stretch',
          }}
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title.join(' ')}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  padding: isMobile ? '22px 12px' : '28px 18px',
                  border: '1px solid rgba(194,178,160,0.22)',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <Icon
                  size={isMobile ? 26 : 30}
                  strokeWidth={1.4}
                  color="#C2B2A0"
                  style={{ display: 'block', margin: '0 auto 16px' }}
                />
                {/* Every title reserves two lines, so the descriptions start at the same height.
                    The span keeps the title as one flex item, so the line break works inside it. */}
                <h3
                  style={{
                    color: '#FFFFFF',
                    fontSize: isMobile ? '15px' : '17px',
                    fontWeight: 700,
                    lineHeight: isMobile ? 1.25 : undefined,
                    minHeight: '2.5em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    margin: '0 0 8px',
                  }}
                >
                  <span>
                    {item.title[0]}
                    {isMobile ? <br /> : ' '}
                    {item.title[1]}
                  </span>
                </h3>
                <p
                  className={isMobile ? 'sov-nohyph' : 'sov-justify sov-justify-l sov-nohyph'}
                  lang="en-GB"
                  style={{
                    textAlign: isMobile ? 'center' : undefined,
                    fontSize: isMobile ? '13px' : '14px',
                    lineHeight: 1.55,
                    color: 'rgba(255,255,255,0.7)',
                    margin: 0,
                  }}
                >
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
