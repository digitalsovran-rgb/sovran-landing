import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import MoreHint from './MoreHint';

// Intro copy. Desktop shows both parts together; mobile shows the first and reveals the second.
const INTRO_1 = "We take pride in creating spaces that meet our clients' expectations and go beyond them.";
const INTRO_2 =
  "As an extension of that commitment, the architectural package is offered to clients who have chosen Sovran's design and build or construction service. Here is how to tell if yours is one of them.";

type TabId = 'for' | 'not';

const TABS: { id: TabId; label: string }[] = [
  { id: 'for', label: 'For you' },
  { id: 'not', label: 'Not for you' },
];

const LISTS = {
  for: [
    'You want your property designed and built by Sovran, from the first drawing to the final detail.',
    'You own the property, or are close to completing on it.',
    'You are ready to choose your team and start building.',
  ],
  not: [
    'You are looking for architectural advice, design or an architectural service on its own.',
    'You do not own the property and are not close to owning it.',
    'You are exploring what your property could become, with no plans to build.',
  ],
};

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

export default function WhoFor() {
  const [tab, setTab] = useState<TabId>('for');
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [introMore, setIntroMore] = useState(false);
  const [introSeen, setIntroSeen] = useState(false);
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

  const introStyle: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.82)',
    maxWidth: '560px',
    margin: isMobile ? '0 auto' : '0',
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
        className="sov-h2"
        style={{
          color: '#FFFFFF',
          margin: '0 0 18px',
        }}
      >
        Who This Is For.
      </h2>
      {isMobile ? (
        <>
          <p className="sov-justify sov-justify-c" lang="en-GB" style={introStyle}>
            {INTRO_1}
          </p>
          <AnimatePresence initial={false}>
            {introMore && (
              <motion.p
                key="who-intro-more"
                id="who-intro-more"
                className="sov-justify sov-justify-c"
                lang="en-GB"
                style={{ ...introStyle, marginTop: '8px', overflow: 'hidden' }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {INTRO_2}
              </motion.p>
            )}
          </AnimatePresence>
          <div style={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}>
            <MoreHint
              variant="dots"
              expanded={introMore}
              onToggle={() => {
                setIntroMore((v) => !v);
                setIntroSeen(true);
              }}
              controlsId="who-intro-more"
              label="Keep reading"
              pulse={!introSeen}
            />
          </div>
        </>
      ) : (
        <p className="sov-justify" lang="en-GB" style={introStyle}>
          {INTRO_1} {INTRO_2}
        </p>
      )}
    </motion.div>
  );

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
        aspectRatio: '16 / 9',
      }}
    >
      <img
        src="/media/whospic.webp"
        alt="A Sovran design and build project"
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
          opacity: 1,
          transform: 'none',
        }}
      />
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
      <motion.div
        key={tab}
        id="who-for-panel"
        role="tabpanel"
        aria-labelledby={`who-for-tab-${tab}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
      <ul
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
      </ul>
      {tab === 'not' && (
        <p
          style={{
            margin: '22px 0 0',
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.72)',
            textAlign: 'left',
          }}
        >
          Looking for architecture on its own? We would still be glad to help.{' '}
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
            Visit our architecture page
          </a>{' '}
          and enquire about the service you need.
        </p>
      )}
      </motion.div>
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
              gridTemplateColumns: '1.3fr 1fr',
              columnGap: '64px',
              alignItems: 'start',
            }}
          >
            {/* Top aligned, so the image never shifts when the tab changes the list height. */}
            <div style={{ alignSelf: 'start', marginTop: 24 }}>{frame}</div>
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
