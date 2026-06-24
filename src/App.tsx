import { useEffect } from 'react';
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

function useScrollMomentum() {
  useEffect(() => {
    let velocity = 0;
    let rafId: number | null = null;
    let isMomentum = false;
    let stopTimer: number | null = null;

    const applyMomentum = () => {
      velocity *= 0.84;
      if (Math.abs(velocity) < 0.5) {
        velocity = 0;
        isMomentum = false;
        rafId = null;
        return;
      }
      window.scrollBy(0, velocity);
      rafId = requestAnimationFrame(applyMomentum);
    };

    const onWheel = (e: WheelEvent) => {
      if (isMomentum) {
        isMomentum = false;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }

      velocity += e.deltaY * 0.1;
      if (velocity > 30) velocity = 30;
      if (velocity < -30) velocity = -30;

      if (stopTimer !== null) clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        stopTimer = null;
        if (Math.abs(velocity) > 2) {
          isMomentum = true;
          rafId = requestAnimationFrame(applyMomentum);
        }
      }, 80);
    };

    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (stopTimer !== null) clearTimeout(stopTimer);
    };
  }, []);
}

export default function App() {
  useScrollMomentum();

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
    </>
  );
}
