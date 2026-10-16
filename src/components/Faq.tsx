import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const FAQS = [
  {
    q: 'What is included in the design package?',
    a: 'Floor plans, 3D visuals, a mood board and a full project proposal, all drawn around your home.',
  },
  {
    q: 'Is the design package complimentary?',
    a: 'Yes, when Sovran carries out the construction of your project. If you are looking for design only, our design services are available separately.',
  },
  {
    q: 'Do I need a site survey?',
    a: 'Most projects need one. Your project manager arranges it and talks you through the details for your location.',
  },
  {
    q: 'Can I change the design?',
    a: 'Yes. You review the 3D visuals with our team and adjust anything before the design is final.',
  },
  {
    q: 'What happens after I enquire?',
    a: 'A member of our team calls you to talk through your project. If it is the right fit, we book your site survey and begin your design.',
  },
];

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];
const LINE = '1px solid rgba(255,255,255,0.18)';

export default function Faq() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Items open and close independently. Opening one is reported to GTM; closing is not.
  const toggle = (i: number) => {
    const opening = !open.has(i);
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
    if (opening) {
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'faq_open', question: i + 1 });
    }
  };

  return (
    <section
      id="faq"
      data-bg="dark"
      style={{ backgroundColor: '#4A443C', color: '#FFFFFF', padding: isMobile ? '72px 0' : '100px 0' }}
    >
      <style>{`.faq-q:focus-visible { outline: 2px solid #C2B2A0; outline-offset: 3px; }`}</style>
      <div className="inner">
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ textAlign: 'center' }}
          >
            <p
              style={{
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.2em',
                color: '#C2B2A0',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Questions
            </p>
            <h2 className="sov-h2" style={{ color: '#FFFFFF', margin: '0 0 40px' }}>
              Before You Enquire.
            </h2>
          </motion.div>

          <div style={{ borderTop: LINE }}>
            {FAQS.map((item, i) => {
              const isOpen = open.has(i);
              return (
                <div key={item.q} style={{ borderBottom: LINE }}>
                  <button
                    type="button"
                    className="faq-q"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => toggle(i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '20px',
                      background: 'none',
                      border: 'none',
                      padding: '22px 0',
                      cursor: 'pointer',
                      color: '#FFFFFF',
                      textAlign: 'left',
                      fontSize: isMobile ? 16 : 18,
                      fontWeight: 600,
                      lineHeight: 1.4,
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {item.q}
                    <span
                      style={{
                        flex: '0 0 auto',
                        display: 'inline-flex',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <Plus size={20} strokeWidth={1.6} color="#C2B2A0" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        id={`faq-a-${i}`}
                        role="region"
                        aria-labelledby={`faq-q-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p
                          lang="en-GB"
                          style={{
                            margin: '0 0 22px',
                            paddingRight: '40px',
                            fontSize: isMobile ? '15px' : '16px',
                            lineHeight: 1.65,
                            color: 'rgba(255,255,255,0.78)',
                            textAlign: 'left',
                          }}
                        >
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
