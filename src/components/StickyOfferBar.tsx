import { useEffect, useState } from 'react';

export default function StickyOfferBar() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [formReached, setFormReached] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const hero = document.getElementById('hero');
    if (hero) {
      const o = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0 });
      o.observe(hero);
      observers.push(o);
    }

    // Once the consultation form has been reached, keep the bar hidden for the rest of the
    // page (including Footer) rather than toggling it back on when the form scrolls out of view.
    const form = document.getElementById('consultation');
    if (form) {
      const o = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setFormReached(true);
        },
        { threshold: 0 }
      );
      o.observe(form);
      observers.push(o);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const visible = !heroVisible && !formReached;

  return (
    <>
      <style>{`
        .sticky-offer-bar { height: 60px; }
        @media (max-width: 767px) {
          .sticky-offer-bar { height: 56px !important; font-size: 12px !important; }
        }
      `}</style>
      <div
        className="sticky-offer-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 55,
          backgroundColor: '#0a0a0a',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
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
            color: '#f5f0eb',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            cursor: 'pointer',
          }}
        >
          Claim Your Design Package
        </button>
      </div>
    </>
  );
}
