import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Box, Palette, FileText, Check, Minus } from 'lucide-react';

const items = [
  { icon: LayoutGrid, title: 'Floor Plans', text: 'Layouts drawn around how you live.' },
  { icon: Box, title: '3D Visuals', text: 'See each room before work begins.' },
  { icon: Palette, title: 'Mood Board', text: 'Materials, finishes and joinery, chosen together.' },
  { icon: FileText, title: 'Project Proposal', text: 'Scope, timeline and cost, set out in full.' },
];

const FOR_YOU = [
  'You are planning a new build, extension, renovation or basement',
  'You own the property, or are close to completing on it',
  'You want Sovran to design and build it',
];

const NOT_FOR_YOU = ['You are looking for design only', 'You have no plans to build yet'];

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

const columnHeadingStyle: React.CSSProperties = {
  textTransform: 'uppercase',
  fontSize: '12px',
  letterSpacing: '0.2em',
  fontWeight: 600,
  margin: '0 0 16px',
};

const rowBorder = '1px solid rgba(255,255,255,0.12)';

function QualifierList({ rows, positive }: { rows: string[]; positive: boolean }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {rows.map((text, i) => (
        <li
          key={text}
          style={{
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start',
            padding: '14px 0',
            borderTop: rowBorder,
            ...(i === rows.length - 1 ? { borderBottom: rowBorder } : {}),
          }}
        >
          <span
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              flex: '0 0 auto',
              marginTop: '1px',
              border: positive ? '1px solid #C2B2A0' : '1px solid rgba(255,255,255,0.35)',
            }}
          >
            {positive ? (
              <Check size={12} strokeWidth={1.8} color="#C2B2A0" />
            ) : (
              <Minus size={12} strokeWidth={1.8} color="rgba(255,255,255,0.6)" />
            )}
          </span>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.55,
              margin: 0,
              textAlign: 'left',
              color: positive ? '#FFFFFF' : 'rgba(255,255,255,0.72)',
            }}
          >
            {text}
          </p>
        </li>
      ))}
    </ul>
  );
}

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
            The Design Package
          </p>
          <h2 className="sov-h2" style={{ color: '#FFFFFF', margin: 0 }}>
            What Your Design Package Includes.
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '16px' : '24px',
          }}
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                style={{
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
                <h3
                  style={{
                    color: '#FFFFFF',
                    fontSize: isMobile ? '15px' : '17px',
                    fontWeight: 700,
                    margin: '0 0 8px',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            marginTop: isMobile ? '44px' : '56px',
            maxWidth: '880px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '32px' : '48px',
            }}
          >
            <div>
              <p style={{ ...columnHeadingStyle, color: '#C2B2A0' }}>For you if</p>
              <QualifierList rows={FOR_YOU} positive />
            </div>
            <div>
              <p style={{ ...columnHeadingStyle, color: 'rgba(255,255,255,0.6)' }}>Not for you if</p>
              <QualifierList rows={NOT_FOR_YOU} positive={false} />
            </div>
          </div>

          <p
            style={{
              marginTop: '28px',
              marginBottom: 0,
              textAlign: 'center',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Looking for design only?{' '}
            <a
              href="https://www.sovranstudio.co.uk/architecture"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#FFFFFF',
                textDecoration: 'underline',
                textDecorationColor: '#C2B2A0',
                textUnderlineOffset: '3px',
              }}
            >
              See our design services
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
