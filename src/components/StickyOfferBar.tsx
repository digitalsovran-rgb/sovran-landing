import { useEffect, useState } from 'react';
import { getSlotCount } from '../utils/slotCount';

export default function StickyOfferBar() {
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);

  // Visibility is recomputed from live isIntersecting values on every callback and never
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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          zIndex: 55,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 6px 24px rgba(0,0,0,0.30)',
          backgroundColor: hovered ? 'var(--sov-white)' : 'var(--sov-greige-light)',
          border: '1px solid rgba(10,10,10,0.12)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, background-color 0.25s ease',
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
            color: 'var(--sov-black)',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            Claim Your Design Package
          </span>
          <span
            style={{
              fontSize: '8px',
              fontWeight: 500,
              color: 'rgba(10,10,10,0.7)',
              marginTop: '5px',
              letterSpacing: '0.05em',
            }}
          >
            {getSlotCount()} slots left.
          </span>
        </button>
      </div>
    </>
  );
}
