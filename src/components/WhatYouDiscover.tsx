import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Home, ClipboardCheck, Wallet } from 'lucide-react';

const outcomes = [
  {
    icon: Home,
    title: 'A home drawn around you',
    text: 'Layouts, light and joinery shaped around how you live, with ideas you had not thought to ask for.',
  },
  {
    icon: Wallet,
    title: 'A price that holds',
    text: 'Agreed before work starts, protected by airtight contracts and paid by milestones you can see on site.',
  },
  {
    icon: ClipboardCheck,
    title: 'No surprises on the way',
    text: 'Planning handled and problems found on paper, so the build runs the way it was shown.',
  },
];

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

export default function WhatYouDiscover() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <section ref={ref} data-bg="dark" style={{ backgroundColor: '#0a0a0a', padding: '100px 0' }}>
      <div className="inner" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: isMobile ? '44px' : '56px' }}>
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
            Your Architectural Package
          </motion.p>

          <motion.h2
            className="sov-h2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{
              textAlign: 'center',
              color: 'var(--sov-white)',
              marginBottom: 0,
            }}
          >
            Certainty, Before You Commit.
          </motion.h2>

          <motion.p
            lang="en-GB"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            style={{
              color: 'rgba(255,255,255,0.78)',
              fontSize: isMobile ? 15 : 17,
              lineHeight: 1.7,
              fontWeight: 400,
              maxWidth: 600,
              margin: '18px auto 0',
              textAlign: 'center',
            }}
          >
            Floor plans, 3D walkthroughs, a mood board and a full project proposal, all drawn around your
            home. Here is what it gives you.
          </motion.p>
        </div>

        <div
          style={
            isMobile
              ? { display: 'flex', flexDirection: 'column', gap: '44px' }
              : { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'start' }
          }
        >
          {outcomes.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                style={{
                  textAlign: 'center',
                  ...(isMobile
                    ? {}
                    : {
                        padding: '0 40px',
                        borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      }),
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 22px',
                    border: '1px solid rgba(194,178,160,0.4)',
                    background: 'rgba(194,178,160,0.06)',
                    borderRadius: '50%',
                  }}
                >
                  <Icon size={28} strokeWidth={1.4} color="#C2B2A0" />
                </div>
                <h3
                  style={{
                    color: '#FFFFFF',
                    fontSize: '20px',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    margin: '0 0 12px',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  lang="en-GB"
                  style={{
                    fontSize: isMobile ? '15px' : '16px',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.72)',
                    margin: '0 auto',
                    maxWidth: '340px',
                    textAlign: 'center',
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
