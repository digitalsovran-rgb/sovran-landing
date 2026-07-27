import { useEffect } from 'react';
import Hero from './components/Hero';
import WhatYouGet from './components/WhatYouGet';
import WhatYouDiscover from './components/WhatYouDiscover';
import HowItWorks from './components/HowItWorks';
import ExtensionTypes from './components/ExtensionTypes';
import AboutSovran from './components/AboutSovran';
import ConsultationForm from './components/ConsultationForm';
import Footer from './components/Footer';
import StickyOfferBar from './components/StickyOfferBar';

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
      <HowItWorks />
      <ExtensionTypes />
      <AboutSovran />
      <ConsultationForm />
      <Footer />
      <StickyOfferBar />
    </>
  );
}
