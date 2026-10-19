import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { PencilRuler, HeartHandshake } from 'lucide-react';

// One statement under the heading.
const ABOUT_STATEMENT =
  'We believe in timeless design and prestigious homes built to last. Across architecture and construction, we pursue design excellence and let the projects we deliver show it.';

const cards = [
  {
    label: 'Decisions Made On Paper',
    icon: PencilRuler,
    desc: 'Each choice is tested in drawings and 3D first, where changing your mind is simple.',
  },
  {
    label: 'A Home You Will Not Second-Guess',
    icon: HeartHandshake,
    desc: 'By the time work begins, you already know you will love what is being built.',
  },
];

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

type Card = (typeof cards)[number];

const panelStyle: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  textAlign: 'left',
  color: 'var(--sov-white)',
  padding: '28px 24px 22px',
  borderRadius: '4px',
  border: '1px solid rgba(194,178,160,0.28)',
  background: 'linear-gradient(165deg, rgba(194,178,160,0.16) 0%, rgba(255,255,255,0.03) 60%)',
};

const titleStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  marginTop: '24px',
  textTransform: 'uppercase',
  fontSize: '13.5px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'var(--sov-white)',
};

const ruleStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  width: '28px',
  height: '2px',
  backgroundColor: 'var(--sov-greige-light)',
  margin: '14px 0',
};

// Large faint copy of the icon in the card corner, plus the ringed icon at the top left.
// The ghost icon drifts and redraws itself (sov-ghost classes in index.css), staggered per
// card through --sov-delay.
function PanelIcons({ icon: Icon, index }: { icon: Card['icon']; index: number }) {
  return (
    <>
      <span
        className="sov-ghost-wrap"
        style={
          {
            position: 'absolute',
            top: '-24px',
            right: '-28px',
            pointerEvents: 'none',
            display: 'block',
            '--sov-delay': `${index * 1.4}s`,
          } as React.CSSProperties
        }
      >
        <Icon
          size={150}
          strokeWidth={0.6}
          color="rgba(194,178,160,0.12)"
          aria-hidden="true"
          className="sov-ghost"
        />
      </span>
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '1px solid rgba(194,178,160,0.5)',
        }}
      >
        <Icon size={24} strokeWidth={1.4} color="#C2B2A0" />
      </span>
    </>
  );
}

function ReasonCard({ card, index, isMobile }: { card: Card; index: number; isMobile: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: EASE }}
      style={panelStyle}
    >
      <PanelIcons icon={card.icon} index={index} />
      <h3 style={titleStyle}>{card.label}</h3>
      <div style={ruleStyle} />
      <p
        lang="en-GB"
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: isMobile ? 14 : 15,
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.72)',
          textAlign: 'left',
        }}
      >
        {card.desc}
      </p>
    </motion.article>
  );
}

export default function AboutSovran() {
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
      <div className="inner" style={{ maxWidth: '900px' }}>
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
          What We Stand For
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
          Homes Built To Endure.
        </motion.h2>

        <motion.p
          lang="en-GB"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            color: '#FFFFFF',
            fontSize: 'clamp(18px, 2vw, 24px)',
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: isMobile ? '20px auto 0' : '24px auto 0',
            textAlign: 'center',
          }}
        >
          {ABOUT_STATEMENT}
        </motion.p>

        <div
          aria-hidden="true"
          style={{
            height: '1px',
            width: '80px',
            background: 'rgba(194,178,160,0.5)',
            margin: isMobile ? '44px auto 28px' : '56px auto 36px',
          }}
        />

        <h3
          style={{
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: 'clamp(22px, 2.4vw, 30px)',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Why Your Design Pack Comes First.
        </h3>

        <p
          lang="en-GB"
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.88)',
            fontSize: 'clamp(17px, 1.8vw, 21px)',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '18px auto 0',
          }}
        >
          We stand against homeowners spending thousands on a home they end up unhappy with, regretting a
          decision that should have been one of their best. The design pack exists so that never becomes
          your story.
        </p>

        <div
          style={
            isMobile
              ? { display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '32px' }
              : {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                  maxWidth: '880px',
                  marginTop: '40px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  alignItems: 'stretch',
                }
          }
        >
          {cards.map((card, i) => (
            <ReasonCard key={card.label} card={card} index={i} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}
