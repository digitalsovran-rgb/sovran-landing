import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const FAQS = [
  {
    q: 'Why is the design pack complimentary?',
    a: 'Because too many homeowners spend thousands on a home they end up regretting. We would rather you see your home, question it and fall in love with it before construction begins. When Sovran builds your project, the design pack is how we make sure the home you get is the one you wanted.',
  },
  {
    q: 'What will I have in my hands?',
    a: 'Floor plans, 3D visuals of each room, a mood board of materials and finishes, and a full project proposal. Everything you need to see your home clearly and move forward with confidence.',
  },
  {
    q: 'Who is the design pack for?',
    a: 'Homeowners planning a new build, extension, renovation or basement of £100K or more, who want Sovran to design and build it with them.',
  },
  {
    q: 'Can I shape the design to my taste?',
    a: 'Completely. You compare layouts, walk through each space in 3D and adjust anything until it feels like yours.',
  },
  {
    q: 'Do I need a site survey?',
    a: 'If your project needs one, it comes as part of your pack. Your project manager will walk you through the arrangements for your location.',
  },
  {
    q: 'What happens after I enquire?',
    a: 'A member of our team calls you to hear about your plans. If it is the right fit, your design begins, and so does the journey to your new home.',
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
