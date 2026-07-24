import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import WhatYouGet from './components/WhatYouGet';
import WhatYouDiscover from './components/WhatYouDiscover';
import BuiltForTomorrow from './components/BuiltForTomorrow';
import HowItWorks from './components/HowItWorks';
import BeforeAfter from './components/BeforeAfter';
import ExtensionTypes from './components/ExtensionTypes';
import AboutSovran from './components/AboutSovran';
import ConsultationForm from './components/ConsultationForm';
import Footer from './components/Footer';
import StickyOfferBar from './components/StickyOfferBar';

function BackToTopButton() {
  const [hovered, setHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [idle, setIdle] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    let idleTimer: number | undefined;
    const consultationEl = document.getElementById('consultation');

    const handler = () => {
      const threshold = consultationEl ? consultationEl.offsetTop - 100 : Infinity;
      setScrolled(window.scrollY >= threshold);
      setIdle(false);
      if (idleTimer !== undefined) clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setIdle(true), 2000);
    };

    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('scroll', handler);
      if (idleTimer !== undefined) clearTimeout(idleTimer);
    };
  }, []);

  const visible = scrolled && !(isMobile && idle);

  return (
    <>
      {/* Bottom offset cleared so the button never overlaps StickyOfferBar (60px desktop / 56px
          mobile) — button bottom = bar height + 16px spacing on top of its own base offset. */}
      <style>{`
        .back-to-top-btn { bottom: 76px !important; }
        @media (max-width: 767px) {
          .back-to-top-btn { left: 20px !important; right: auto !important; padding: 10px 16px !important; font-size: 11px !important; bottom: 72px !important; }
        }
      `}</style>
      <button
        type="button"
        className="back-to-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '16px 28px',
          backgroundColor: hovered ? '#c9a96e' : 'transparent',
          color: hovered ? '#f5f0eb' : '#0a0a0a',
          border: `2px solid ${hovered ? '#c9a96e' : '#0a0a0a'}`,
          borderRadius: 0,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
        }}
      >
        <span aria-hidden="true">↑</span> Top
      </button>
    </>
  );
}

export default function App() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 800);
    }
  }, []);

  return (
    <>
      <Hero />
      <WhatYouGet />
      <WhatYouDiscover />
      <BuiltForTomorrow />
      <HowItWorks />
      <BeforeAfter />
      <ExtensionTypes />
      <AboutSovran />
      <ConsultationForm />
      <Footer />
      <StickyOfferBar />
      <BackToTopButton />
    </>
  );
}
