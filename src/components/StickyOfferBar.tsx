import { useEffect, useRef, useState } from 'react';

export default function StickyOfferBar() {
  const [visible, setVisible] = useState(true);
  // The bar's own visual style — always the inverse of whatever section currently sits
  // behind it, so it stays legible against both dark and cream sections.
  const [barStyle, setBarStyle] = useState<'dark' | 'light'>('light');
  const areasRef = useRef(new Map<Element, number>());

  // Bug A fix: which section is behind the bar right now. Shrinks the observed root down to
  // just the horizontal strip the bar occupies (bottom `barHeight` px of the viewport), then
  // picks whichever [data-bg] section currently covers the most of that strip — comparing
  // overlap area (not intersectionRatio, which is normalized per-target and not comparable
  // across sections of very different heights).
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setup = () => {
      observer?.disconnect();
      areasRef.current = new Map();
      const barHeight = window.innerWidth < 768 ? 56 : 60;
      const topInset = Math.max(window.innerHeight - barHeight, 0);

      observer = new IntersectionObserver(
        (entries) => {
          const areas = areasRef.current;
          entries.forEach((entry) => {
            const rect = entry.intersectionRect;
            areas.set(entry.target, entry.isIntersecting ? rect.width * rect.height : 0);
          });

          let best: Element | null = null;
          let bestArea = 0;
          areas.forEach((area, el) => {
            if (area > bestArea) {
              bestArea = area;
              best = el;
            }
          });

          if (best) {
            const bg = (best as HTMLElement).dataset.bg;
            if (bg === 'dark') setBarStyle('light');
            else if (bg === 'light') setBarStyle('dark');
          }
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: `-${topInset}px 0px 0px 0px` }
      );

      document.querySelectorAll('[data-bg]').forEach((el) => observer!.observe(el));
    };

    setup();
    window.addEventListener('resize', setup);
    return () => {
      window.removeEventListener('resize', setup);
      observer?.disconnect();
    };
  }, []);

  // Visibility is recomputed from live isIntersecting values on every callback — never
  // latched. Hidden while #hero, #consultation, or the footer is actually in view (Hero has
  // its own "Claim Offer" button already, so the persistent bar is redundant there), so
  // scrolling back up past any of them always brings the bar back.
  useEffect(() => {
    const hero = document.getElementById('hero');
    const consultation = document.getElementById('consultation');
    const footer = document.getElementById('site-footer');
    const targets = [hero, consultation, footer].filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const state = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => state.set(entry.target, entry.isIntersecting));
        const shouldHide = targets.some((t) => state.get(t));
        setVisible(!shouldHide);
      },
      { threshold: 0 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  const dark = barStyle === 'dark';

  return (
    <>
      <style>{`
        .sticky-offer-bar {
          height: 60px;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: min(700px, calc(100% - 32px));
        }
        @media (max-width: 767px) {
          .sticky-offer-bar {
            height: 56px !important;
            font-size: 12px !important;
            left: 16px !important;
            right: 16px !important;
            width: auto !important;
            transform: none !important;
          }
        }
      `}</style>
      <div
        className="sticky-offer-bar"
        style={{
          position: 'fixed',
          zIndex: 55,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          backgroundColor: dark ? '#0a0a0a' : '#f5f0eb',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, background-color 0.2s ease',
        }}
      >
        <button
          type="button"
          onClick={() => {
            document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            color: dark ? '#f5f0eb' : '#0a0a0a',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
          }}
        >
          Claim Your Design Package
        </button>
      </div>
    </>
  );
}
