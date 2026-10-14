import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ethosCards = [
  {
    label: 'One Team',
    desc: 'You speak to the same people from your first conversation to the day we hand over the keys.',
  },
  {
    label: 'Planning Expertise',
    desc: 'Our team includes former planning officers, so we know what a council needs to see before you even apply.',
  },
  {
    label: 'Protected Investment',
    desc: 'A fixed price, agreed upfront, so there are no surprises waiting for you halfway through your project.',
  },
];

const stats = [
  { target: 15, decimals: 0, suffix: '+', label: 'Years' },
  { target: 1000, decimals: 0, suffix: '+', label: 'Projects Delivered' },
  { target: 95, decimals: 0, suffix: '%', label: 'Planning Success' },
  { target: 4.9, decimals: 1, suffix: '', label: 'Google Rating' },
];

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];
const COUNT_UP_MS = 1500;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

// Height of one collapsed description line: 14px font at line-height 1.6.
const LINE_PX = 14 * 1.6;

// Counts from 0 up to `target` once `active` becomes true, and stays latched (never restarts
// on later re-triggers).
function useCountUp(target: number, decimals: number, active: boolean) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    let rafId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / COUNT_UP_MS, 1);
      setValue(target * easeOutCubic(progress));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, target]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-GB');
}

function StatNumber({
  stat,
  active,
  numberSize,
  suffixSize,
}: {
  stat: (typeof stats)[number];
  active: boolean;
  numberSize: string;
  suffixSize: string;
}) {
  const display = useCountUp(stat.target, stat.decimals, active);
  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      <span style={{ fontSize: numberSize, fontWeight: 900, color: 'var(--sov-white)', lineHeight: 1 }}>
        {display}
      </span>
      <span style={{ fontSize: suffixSize, fontWeight: 900, color: 'var(--sov-greige-light)', lineHeight: 1 }}>
        {stat.suffix}
      </span>
    </span>
  );
}

const numberStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 900,
  color: 'transparent',
  WebkitTextStroke: '1px var(--sov-greige-light)',
  letterSpacing: '0.02em',
  lineHeight: 1,
};

const titleStyle: React.CSSProperties = {
  textTransform: 'uppercase',
  fontSize: '15px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  color: 'var(--sov-white)',
};

const cardStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  backgroundColor: 'rgba(255,255,255,0.04)',
  borderLeft: '2px solid var(--sov-greige-light)',
  borderRadius: '6px',
  padding: '20px 18px',
};

const descTextStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: 'rgba(255,255,255,0.72)',
};

function PillarCard({
  card,
  index,
  isMobile,
}: {
  card: (typeof ethosCards)[number];
  index: number;
  isMobile: boolean;
}) {
  const [open, setOpen] = useState(false);
  // The one-line clamp comes off as soon as the card opens and goes back on only after the
  // collapse animation has finished, so the text never jumps while the height is animating.
  const [clamped, setClamped] = useState(true);
  const [fullHeight, setFullHeight] = useState(LINE_PX);
  const descRef = useRef<HTMLSpanElement>(null);
  const descId = `about-pillar-${index}`;
  const number = String(index + 1).padStart(2, '0');

  useEffect(() => {
    if (!open) return;
    const handler = () => {
      if (descRef.current) setFullHeight(descRef.current.scrollHeight);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [open]);

  const toggle = () => {
    if (!open) {
      if (descRef.current) setFullHeight(descRef.current.scrollHeight);
      setClamped(false);
    }
    setOpen(!open);
  };

  if (!isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: index * 0.15, ease: EASE }}
        style={cardStyle}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={numberStyle}>{number}</span>
          <h3 style={titleStyle}>{card.label}</h3>
        </div>
        <p style={{ ...descTextStyle, marginTop: '12px' }}>{card.desc}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: EASE }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={descId}
        style={{ ...cardStyle, border: 'none', borderLeft: '2px solid var(--sov-greige-light)', cursor: 'pointer', font: 'inherit' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={numberStyle}>{number}</span>
          <span style={titleStyle}>{card.label}</span>
        </span>

        <motion.span
          id={descId}
          initial={false}
          animate={{ height: open ? fullHeight : LINE_PX }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            if (!open) setClamped(true);
          }}
          style={{ display: 'block', overflow: 'hidden', marginTop: '12px' }}
        >
          <span
            ref={descRef}
            style={{
              ...descTextStyle,
              ...(clamped
                ? {
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }
                : { display: 'block' }),
            }}
          >
            {card.desc}
          </span>
        </motion.span>

        <span
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            fontWeight: 600,
            color: 'var(--sov-greige-light)',
          }}
        >
          {open ? 'Less' : 'Read more'}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'inline-flex' }}
          >
            <ChevronDown size={16} color="#C2B2A0" />
          </motion.span>
        </span>
      </button>
    </motion.div>
  );
}

function StatsBlock({ isMobile, active }: { isMobile: boolean; active: boolean }) {
  const ruleStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.18)',
    transformOrigin: 'left',
  };
  const labelStyle: React.CSSProperties = {
    textTransform: 'uppercase',
    fontSize: '12px',
    letterSpacing: '0.18em',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.65)',
  };
  const ruleMotion = (delay: number) => ({
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    transition: { duration: 0.8, delay, ease: EASE },
  });
  const itemMotion = (i: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.15 + i * 0.14, ease: EASE },
  });

  if (isMobile) {
    return (
      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        {stats.map((stat, i) => (
          <div key={stat.label}>
            <motion.div style={ruleStyle} {...ruleMotion(0.15 + i * 0.14)} />
            <motion.div
              {...itemMotion(i)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '24px 0',
              }}
            >
              <span style={labelStyle}>{stat.label}</span>
              <StatNumber stat={stat} active={active} numberSize="52px" suffixSize="28px" />
            </motion.div>
          </div>
        ))}
        <motion.div style={ruleStyle} {...ruleMotion(0.15 + stats.length * 0.14)} />
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: '48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '32px',
        textAlign: 'left',
      }}
    >
      {stats.map((stat, i) => (
        <motion.div key={stat.label} {...itemMotion(i)}>
          <StatNumber stat={stat} active={active} numberSize="60px" suffixSize="32px" />
          <motion.div style={{ ...ruleStyle, margin: '20px 0 14px' }} {...ruleMotion(0.15 + i * 0.14)} />
          <span style={labelStyle}>{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function AboutSovran() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [statsRevealed, setStatsRevealed] = useState(false);
  const [revealHovered, setRevealHovered] = useState(false);

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
          About Sovran
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(30px, 3.5vw, 44px)',
            fontWeight: 900,
            color: 'var(--sov-white)',
            letterSpacing: '-0.005em',
            lineHeight: 1.1,
          }}
        >
          Design And Build Studio.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 400,
            color: 'var(--sov-white)',
            lineHeight: 1.7,
            letterSpacing: 'normal',
            maxWidth: '650px',
            margin: '20px auto 0',
          }}
        >
          Sovran is a design and build studio: architects, planners and construction specialists
          working as one team, under one roof. Founded in 2011, we&apos;ve delivered over 1,000
          projects across London and the Home Counties, spanning architecture, construction and
          interiors, each one carried by the same team from first drawing to completion.
        </motion.p>

        <div
          style={{
            marginTop: '56px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '14px' : '24px',
            alignItems: 'start',
          }}
        >
          {ethosCards.map((card, i) => (
            <PillarCard key={card.label} card={card} index={i} isMobile={isMobile} />
          ))}
        </div>

        <div style={{ marginTop: '72px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              color: 'var(--sov-greige-light)',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Our Track Record
          </p>
          <h3
            style={{
              fontSize: 'clamp(22px, 2.6vw, 30px)',
              fontWeight: 900,
              color: 'var(--sov-white)',
              letterSpacing: '-0.005em',
            }}
          >
            See The Numbers Behind Our Work.
          </h3>

          <AnimatePresence mode="wait" initial={false}>
            {statsRevealed ? (
              <motion.div
                key="stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <StatsBlock isMobile={isMobile} active={statsRevealed} />
              </motion.div>
            ) : (
              <motion.div
                key="reveal"
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: '28px' }}>
                  <button
                    type="button"
                    onClick={() => setStatsRevealed(true)}
                    onMouseEnter={() => setRevealHovered(true)}
                    onMouseLeave={() => setRevealHovered(false)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      width: isMobile ? '100%' : 'auto',
                      backgroundColor: revealHovered ? 'var(--sov-white)' : 'var(--sov-greige-light)',
                      color: 'var(--sov-black)',
                      border: 'none',
                      padding: '16px 28px',
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      borderRadius: 0,
                      cursor: 'pointer',
                      transition: 'background-color 0.25s ease',
                    }}
                  >
                    Show Our Numbers
                    <ChevronDown size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
