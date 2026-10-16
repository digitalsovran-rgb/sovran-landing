import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Compass, ShieldCheck, Users } from 'lucide-react';

// One statement under the heading.
const ABOUT_STATEMENT =
  'Since 2011, our designers, planners and builders have worked as one team. What you approve on paper is what arrives on site.';

const ethosCards = [
  {
    label: 'One Point Of Contact',
    icon: Users,
    desc: 'One project manager runs your project from start to finish.',
  },
  {
    label: 'Planning Know-How',
    icon: Compass,
    desc: 'Former planning officers on our team prepare your application the way councils expect.',
  },
  {
    label: 'A Price That Holds',
    icon: ShieldCheck,
    desc: 'Fixed before work begins, paid in milestones, protected by contract and insurance.',
  },
];

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

type EthosCard = (typeof ethosCards)[number];

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

const descTextStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  fontSize: '14px',
  lineHeight: 1.6,
  color: 'rgba(255,255,255,0.72)',
  textAlign: 'left',
};

// Large faint copy of the icon in the panel corner, plus the ringed icon at the top left.
// The ghost icon drifts and redraws itself (sov-ghost classes in index.css), staggered per
// pillar through --sov-delay.
function PanelIcons({ icon: Icon, index }: { icon: EthosCard['icon']; index: number }) {
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

// Mobile pillar card in the horizontal swipe track. The full description is always shown.
function MobilePanel({
  card,
  index,
  trackInView,
}: {
  card: EthosCard;
  index: number;
  trackInView: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 60 }}
      animate={trackInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
      transition={{ duration: 0.8, delay: index * 0.18, ease: EASE }}
      style={{
        ...panelStyle,
        display: 'block',
        flex: '0 0 auto',
        width: 'min(76vw, 320px)',
        scrollSnapAlign: 'start',
      }}
    >
      <PanelIcons icon={card.icon} index={index} />
      <h3 style={titleStyle}>{card.label}</h3>
      <div style={ruleStyle} />
      <p lang="en-GB" style={descTextStyle}>
        {card.desc}
      </p>
    </motion.article>
  );
}

function DesktopPanel({ card, index }: { card: EthosCard; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: EASE }}
      style={panelStyle}
    >
      <PanelIcons icon={card.icon} index={index} />
      <h3 style={{ ...titleStyle, whiteSpace: 'nowrap' }}>{card.label}</h3>
      <div style={ruleStyle} />
      <p lang="en-GB" style={descTextStyle}>
        {card.desc}
      </p>
    </motion.article>
  );
}

export default function AboutSovran() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const trackRef = useRef<HTMLDivElement>(null);
  const trackInView = useInView(trackRef, { once: true, amount: 0.3 });
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
          The Studio
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
          Design And Build Studio.
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

        {/* The pillars are the section's last element; the section's own bottom padding closes it. */}
        {isMobile ? (
          <div
            ref={trackRef}
            className="sov-track"
            style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'stretch',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollPaddingLeft: '24px',
              padding: '4px 24px 12px',
              margin: '56px -24px 0',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {ethosCards.map((card, i) => (
              <MobilePanel key={card.label} card={card} index={i} trackInView={trackInView} />
            ))}
          </div>
        ) : (
          <div
            style={{
              marginTop: '56px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              alignItems: 'stretch',
            }}
          >
            {ethosCards.map((card, i) => (
              <DesktopPanel key={card.label} card={card} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
