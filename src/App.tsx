import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import BeforeAfter from './components/BeforeAfter';
import PainPoints from './components/PainPoints';
import ValueProps from './components/ValueProps';
import Process from './components/Process';
import ExtensionTypes from './components/ExtensionTypes';
import SocialProof from './components/SocialProof';
import ConsultationForm from './components/ConsultationForm';
import Footer from './components/Footer';

function FloatingCTA() {
  const [hovered, setHovered] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const form = document.getElementById('consultation');
    if (form) {
      const o = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), { threshold: 0.1 });
      o.observe(form);
      observers.push(o);
    }

    const hero = document.getElementById('hero');
    if (hero) {
      const o = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0 });
      o.observe(hero);
      observers.push(o);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const shouldShow = !formVisible && !(heroVisible && isMobile);

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .floating-cta { bottom: 16px !important; right: 16px !important; padding: 10px 16px !important; font-size: 11px !important; }
        }
      `}</style>
      <button
        type="button"
        className="floating-cta"
        onClick={() => {
          document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          padding: '16px 28px',
          backgroundColor: hovered ? '#c9a96e' : '#0a0a0a',
          color: hovered ? '#0a0a0a' : '#f5f0eb',
          border: '2px solid #f5f0eb',
          borderRadius: 0,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          opacity: shouldShow ? 1 : 0,
          pointerEvents: shouldShow ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, background-color 0.3s ease, color 0.3s ease',
        }}
      >
        Get In Touch
      </button>
    </>
  );
}

function BackToTopButton() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY >= 300);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .back-to-top-btn { left: 20px !important; }
        }
        @media (min-width: 768px) {
          .back-to-top-btn { left: 32px !important; }
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
          left: '32px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '16px 28px',
          backgroundColor: hovered ? '#c9a96e' : '#0a0a0a',
          color: '#f5f0eb',
          border: `2px solid ${hovered ? '#c9a96e' : '#f5f0eb'}`,
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
          transition: 'opacity 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
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
      <StatsBar />
      <BeforeAfter />
      <PainPoints />
      <ValueProps />
      <Process />
      <ExtensionTypes />
      <SocialProof />
      <ConsultationForm />
      <Footer />
      <FloatingCTA />
      <BackToTopButton />
    </>
  );
}
