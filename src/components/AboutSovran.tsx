import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, Compass, ShieldCheck, Users } from 'lucide-react';
import HouseMark from './HouseMark';

const ethosCards = [
  {
    label: 'One Team',
    icon: Users,
    desc: 'One project manager runs your build. They are your single point of contact: you ask them, they answer, and they plan and coordinate every trade on site, so you never have to chase anyone.',
  },
  {
    label: 'Planning Expertise',
    icon: Compass,
    desc: 'We know what a council needs to see. Our team includes former planning officers, so your application arrives prepared the way the council expects it, with the right documents in the right order, ready to be approved the first time.',
  },
  {
    label: 'Protected Investment',
    icon: ShieldCheck,
    desc: 'Your price is fixed before work begins. Airtight contracts and milestone payments protect your investment at each stage, and Sovran backs it with legal insurance.',
  },
];

const stats = [
  { target: 15, decimals: 0, suffix: '+', label: 'Years' },
  { target: 1000, decimals: 0, suffix: '+', label: 'Projects Delivered' },
  { target: 97, decimals: 0, suffix: '%', label: 'Planning Success' },
  { target: 4.9, decimals: 1, suffix: '', label: 'Google Rating' },
];

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];
const COUNT_UP_MS = 1500;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

// Height of one collapsed description line: 14px font at line-height 1.6.
const LINE_PX = 14 * 1.6;

// Press and hold control: how long the hold lasts and the circumference of its progress ring
// (2 * PI * r with r = 72).
const HOLD_MS = 1600;
// A hold is cancelled if the pointer wanders further than this from where it went down.
const HOLD_MAX_DRIFT_PX = 80;
const RING_CIRCUMFERENCE = 452.39;

type EthosCard = (typeof ethosCards)[number];

// Shared look of the two stacked hold messages (idle and "Keep holding...").
const holdTextStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '0 8px',
  pointerEvents: 'none',
  textTransform: 'uppercase',
  fontSize: '13px',
  letterSpacing: '0.18em',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.7)',
  transition: 'opacity 0.25s ease',
};

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
  fontSize: '15px',
  fontWeight: 700,
  letterSpacing: '0.14em',
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

function MobilePanel({
  card,
  index,
  trackInView,
}: {
  card: EthosCard;
  index: number;
  trackInView: boolean;
}) {
  const [open, setOpen] = useState(false);
  // The one-line clamp comes off as soon as the panel opens and goes back on only after the
  // collapse animation has finished, so the text never jumps while the height is animating.
  const [clamped, setClamped] = useState(true);
  const [fullHeight, setFullHeight] = useState(LINE_PX);
  const descRef = useRef<HTMLSpanElement>(null);
  const descId = `about-pillar-${index}`;

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

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-controls={descId}
      initial={{ opacity: 0, x: 60 }}
      animate={trackInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
      transition={{ duration: 0.8, delay: index * 0.18, ease: EASE }}
      style={{
        ...panelStyle,
        display: 'block',
        flex: '0 0 auto',
        width: 'min(76vw, 320px)',
        scrollSnapAlign: 'start',
        cursor: 'pointer',
        font: 'inherit',
      }}
    >
      <PanelIcons icon={card.icon} index={index} />
      <span style={{ ...titleStyle, display: 'block' }}>{card.label}</span>
      <span style={{ ...ruleStyle, display: 'block' }} />

      <motion.span
        id={descId}
        initial={false}
        animate={{ height: open ? fullHeight : LINE_PX }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        onAnimationComplete={() => {
          if (!open) setClamped(true);
        }}
        style={{ position: 'relative', zIndex: 1, display: 'block', overflow: 'hidden' }}
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
          position: 'relative',
          zIndex: 1,
          marginTop: '16px',
          display: 'flex',
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
    </motion.button>
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
      <h3 style={titleStyle}>{card.label}</h3>
      <div style={ruleStyle} />
      <p style={descTextStyle}>{card.desc}</p>
    </motion.article>
  );
}

function StatsBlock({ isMobile, active }: { isMobile: boolean; active: boolean }) {
  const ruleLineStyle: React.CSSProperties = {
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
            <motion.div style={ruleLineStyle} {...ruleMotion(0.15 + i * 0.14)} />
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
        <motion.div style={ruleLineStyle} {...ruleMotion(0.15 + stats.length * 0.14)} />
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
          <motion.div style={{ ...ruleLineStyle, margin: '20px 0 14px' }} {...ruleMotion(0.15 + i * 0.14)} />
          <span style={labelStyle}>{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function AboutSovran() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const trackRef = useRef<HTMLDivElement>(null);
  const trackInView = useInView(trackRef, { once: true, amount: 0.3 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [statsRevealed, setStatsRevealed] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const ringRef = useRef<SVGCircleElement>(null);
  const houseRef = useRef<SVGGElement>(null);
  const downPosRef = useRef<{ x: number; y: number } | null>(null);
  const holdingRef = useRef(false);
  const completedRef = useRef(false);
  const startTsRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const startHold = () => {
    if (holdingRef.current || completedRef.current) return;
    holdingRef.current = true;
    if (ringRef.current) ringRef.current.style.transition = 'none';
    if (houseRef.current) houseRef.current.style.transition = 'none';
    setIsHolding(true);
    startTsRef.current = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - startTsRef.current) / HOLD_MS);
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - p));
      if (houseRef.current) houseRef.current.style.strokeDashoffset = String(1 - p);
      if (p >= 1) {
        rafRef.current = null;
        holdingRef.current = false;
        completedRef.current = true;
        navigator.vibrate?.(40);
        setIsHolding(false);
        setStatsRevealed(true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const cancelHold = () => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsHolding(false);
    if (ringRef.current) {
      ringRef.current.style.transition = 'stroke-dashoffset 0.4s ease';
      ringRef.current.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
    }
    if (houseRef.current) {
      houseRef.current.style.transition = 'stroke-dashoffset 0.4s ease';
      houseRef.current.style.strokeDashoffset = '1';
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    downPosRef.current = { x: e.clientX, y: e.clientY };
    startHold();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const down = downPosRef.current;
    if (!holdingRef.current || down === null) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > HOLD_MAX_DRIFT_PX) cancelHold();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (e.repeat) return;
    startHold();
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    cancelHold();
  };

  const holdSize = isMobile ? 148 : 160;

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
          Our evolved approach to architecture creates places people remember, and our mission is to
          shape how you experience your home through every design decision. A home deserves a design
          made only for it, and you are the one who will enjoy it for the rest of your life. For us,
          architecture is a commitment to perfection, and we carry that same standard into the studio.
          By managing design and construction as one team, we protect it at any level and at each
          stage of your project. That is our footprint: spatial harmony, at all times.
        </motion.p>

        {isMobile ? (
          <div
            ref={trackRef}
            className="sov-track"
            style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
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
              alignItems: 'start',
            }}
          >
            {ethosCards.map((card, i) => (
              <DesktopPanel key={card.label} card={card} index={i} />
            ))}
          </div>
        )}

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
                key="hold"
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                style={{ overflow: 'hidden' }}
              >
                {/* Fixed-height slot: both messages are always laid out and only cross-fade, so
                    the control below never shifts while holding. */}
                <div
                  aria-live="polite"
                  style={{ position: 'relative', width: '100%', height: '52px', margin: '18px 0 22px' }}
                >
                  <span style={{ ...holdTextStyle, opacity: isHolding ? 0 : 1 }}>
                    {isMobile ? 'Tap and hold to reveal our numbers' : 'Click and hold to reveal our numbers'}
                  </span>
                  <span style={{ ...holdTextStyle, opacity: isHolding ? 1 : 0 }}>Keep holding...</span>
                </div>

                <button
                  type="button"
                  aria-label="Press and hold to reveal our numbers"
                  className="sov-hold-btn"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={cancelHold}
                  onPointerCancel={cancelHold}
                  onLostPointerCapture={cancelHold}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    width: `${holdSize}px`,
                    height: `${holdSize}px`,
                    borderRadius: '50%',
                    position: 'relative',
                    display: 'grid',
                    placeItems: 'center',
                    padding: 0,
                    margin: '0 auto',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(194,178,160,0.35)',
                    cursor: 'pointer',
                    color: '#C2B2A0',
                    touchAction: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    outline: 'none',
                  }}
                >
                  <span
                    className={isHolding ? undefined : 'sov-beat'}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: '1px solid rgba(194,178,160,0.5)',
                      pointerEvents: 'none',
                      ...(isHolding ? { opacity: 0 } : {}),
                    }}
                  />
                  <svg
                    viewBox="0 0 148 148"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      transform: 'rotate(-90deg)',
                      pointerEvents: 'none',
                    }}
                  >
                    <circle
                      ref={ringRef}
                      cx="74"
                      cy="74"
                      r="72"
                      fill="none"
                      stroke="#C2B2A0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={RING_CIRCUMFERENCE}
                    />
                  </svg>
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      transform: isHolding ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <HouseMark size={78} drawRef={houseRef} holding={isHolding} />
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
