import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';

type TabId = 'for' | 'not';

const TABS: { id: TabId; label: string }[] = [
  { id: 'for', label: 'For you' },
  { id: 'not', label: 'Not for you' },
];

const IMAGES = {
  for: { src: '/media/rearext.webp', alt: 'A finished rear extension', tag: 'Designed and built with Sovran' },
  not: { src: '/media/archdraw.webp', alt: 'Design drawings laid out on a desk', tag: 'Design on its own' },
};

const LISTS = {
  for: [
    'You want your extension designed and built by Sovran, from first drawing to the day you move in.',
    'You own the property, or you are about to complete on it.',
    'You are ready to choose your team now, even if building starts later.',
  ],
  not: [
    'You are looking for design work with no build attached.',
    'Price is the main thing you are comparing.',
    'You are exploring ideas with no plan to build.',
  ],
};

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

export default function WhoFor() {
  const [tab, setTab] = useState<TabId>('for');
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const reduced = useReducedMotion();
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ for: null, not: null });

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Only a real switch by the visitor counts: it updates the tab and reports it to GTM.
  const selectTab = (next: TabId) => {
    if (next === tab) return;
    setTab(next);
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'who_for_toggle', tab: next });
  };

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next: TabId = tab === 'for' ? 'not' : 'for';
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  const header = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{ textAlign: isMobile ? 'center' : 'left' }}
    >
      <p
        style={{
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.2em',
          color: '#C2B2A0',
          margin: '0 0 16px',
        }}
      >
        Before You Enquire
      </p>
      <h2
        style={{
          color: '#FFFFFF',
          fontSize: 'clamp(30px, 3.85vw, 50px)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          margin: '0 0 18px',
        }}
      >
        Who This Is For.
      </h2>
      <p
        style={{
          fontSize: '16px',
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.82)',
          maxWidth: '560px',
          margin: isMobile ? '0 auto' : '0',
        }}
      >
        The design package is offered to projects that Sovran will also build. Here is how to tell if yours is
        one of them.
      </p>
    </motion.div>
  );

  const imageTransition = reduced ? 'none' : 'opacity 0.7s ease, transform 1.1s cubic-bezier(0.2, 0.7, 0.2, 1)';

  const frame = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
        backgroundColor: '#2f2b26',
        width: '100%',
        aspectRatio: isMobile ? '5 / 4' : '4 / 5',
        ...(isMobile ? {} : { maxHeight: '640px' }),
      }}
    >
      {(Object.keys(IMAGES) as TabId[]).map((id) => (
        <img
          key={id}
          src={IMAGES[id].src}
          alt={IMAGES[id].alt}
          draggable={false}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            opacity: tab === id ? 1 : 0,
            transform: tab === id ? 'scale(1)' : 'scale(1.05)',
            transition: imageTransition,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              backgroundColor: 'rgba(10,10,10,0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              padding: '8px 12px',
              borderRadius: '10px',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              lineHeight: 1.4,
            }}
          >
            {IMAGES[tab].tag}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );

  const toggle = (
    <div
      role="tablist"
      aria-label="Who this package is for"
      onKeyDown={handleTabKeyDown}
      style={{
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '12px',
        padding: '4px',
        width: '100%',
        ...(isMobile ? {} : { maxWidth: '440px' }),
      }}
    >
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <motion.span
          aria-hidden="true"
          animate={{ x: tab === 'for' ? '0%' : '100%' }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 36 }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '50%',
            backgroundColor: '#FFFFFF',
            borderRadius: '9px',
          }}
        />
        {TABS.map((t) => {
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`who-for-tab-${t.id}`}
              aria-selected={selected}
              aria-controls="who-for-panel"
              tabIndex={selected ? 0 : -1}
              className="who-for-tab"
              onClick={() => selectTab(t.id)}
              style={{
                position: 'relative',
                zIndex: 1,
                minHeight: '48px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                padding: '0 8px',
                WebkitTapHighlightColor: 'transparent',
                color: selected ? '#0A0A0A' : 'rgba(255,255,255,0.78)',
                transition: 'color 0.25s ease',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const isFor = tab === 'for';

  const panel = (
    <AnimatePresence mode="wait">
      <motion.ul
        key={tab}
        id="who-for-panel"
        role="tabpanel"
        aria-labelledby={`who-for-tab-${tab}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        {LISTS[tab].map((text, i) => (
          <motion.li
            key={text}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={
              reduced ? { duration: 0.01 } : { duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE }
            }
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              padding: '20px 0',
              borderTop: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <span
              style={{
                flex: '0 0 auto',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                marginTop: '1px',
                border: isFor ? '1px solid #C2B2A0' : '1px solid rgba(255,255,255,0.35)',
              }}
            >
              {isFor ? (
                <Check size={13} strokeWidth={1.6} color="#C2B2A0" />
              ) : (
                <Minus size={13} strokeWidth={1.6} color="rgba(255,255,255,0.6)" />
              )}
            </span>
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.55,
                margin: 0,
                textAlign: 'left',
                color: isFor ? '#FFFFFF' : 'rgba(255,255,255,0.72)',
              }}
            >
              {text}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </AnimatePresence>
  );

  return (
    <section
      id="who-for"
      data-bg="dark"
      style={{
        backgroundColor: '#4A443C',
        color: '#FFFFFF',
        padding: isMobile ? '72px 0' : '100px 0',
        overflow: 'hidden',
      }}
    >
      <style>{`.who-for-tab:focus-visible { outline: 2px solid #C2B2A0; outline-offset: 2px; }`}</style>
      <div className="inner">
        {isMobile ? (
          <>
            {header}
            <div style={{ marginTop: '36px' }}>{frame}</div>
            <div style={{ marginTop: '20px' }}>{toggle}</div>
            <div style={{ marginTop: '24px' }}>{panel}</div>
          </>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: '64px',
              alignItems: 'center',
            }}
          >
            <div>{frame}</div>
            <div>
              {header}
              <div style={{ marginTop: '32px' }}>{toggle}</div>
              <div style={{ marginTop: '28px' }}>{panel}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
