import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FileSearch, PenTool, Video, ClipboardCheck } from 'lucide-react';
import PulseRing from './PulseRing';

const rows = [
  {
    num: '01',
    icon: FileSearch,
    label: 'Brief Assessment',
    image: '/media/sites.webp',
    imageLeft: true,
    desc: "Wherever possible, we work from your existing architectural drawings and design on top of what's already there. Where a site survey is needed, it's included as part of your design pack, subject to availability.",
  },
  {
    num: '02',
    icon: PenTool,
    label: 'Architectural Drawings',
    image: '/media/archdraw.webp',
    imageLeft: false,
    desc: "Floor plans developed around your brief and your home, already accounting for the energy and comfort standards taking effect from March 2027, so what's drawn today still holds up tomorrow.",
  },
  {
    num: '03',
    icon: Video,
    label: '3D Render & Walkthrough',
    image: '/media/renderw.webp',
    imageLeft: true,
    desc: 'See the finished extension before a single brick is laid, rendered and walked through in full.',
  },
  {
    num: '04',
    icon: ClipboardCheck,
    label: 'Planning Assessment',
    image: '/media/plann.webp',
    imageLeft: false,
    desc: 'A clear read on planning potential, budget and timeline, including how the finished extension performs against the standards coming into force in 2027.',
  },
];

function Row({ row, i, isMobile }: { row: (typeof rows)[0]; i: number; isMobile: boolean }) {
  // Each row observes its own (comparatively short) container rather than sharing a single
  // isInView tied to the whole section. A shared isInView over the whole (very tall,
  // stacked-on-mobile) section could never reach its visibility threshold and left
  // everything stuck at opacity 0.
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px', amount: 0.2 });
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const Icon = row.icon;
  const imgFromX = row.imageLeft ? -50 : 50;
  const textFromX = row.imageLeft ? 50 : -50;
  const descId = `hiw-desc-${row.num}`;

  const toggle = () => {
    setOpen((o) => !o);
    setOpened(true);
  };

  return (
    <div
      ref={ref}
      className="hiw-row"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: row.imageLeft ? 'row' : 'row-reverse',
        alignItems: 'stretch',
        minHeight: '420px',
      }}
    >
      {/* Mobile-only numbered badge, overlapping the image's top-left corner so the number
          stays visibly tied to its image once rows stack vertically. */}
      <div
        className="hiw-badge"
        style={{
          position: 'absolute',
          top: '-20px',
          left: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#0a0a0a',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 900,
          color: 'var(--sov-white)',
          letterSpacing: '-0.02em',
          zIndex: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {row.num}
      </div>

      <motion.div
        initial={{ opacity: 0, x: imgFromX }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: imgFromX }}
        transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
        className="hiw-img-block"
        style={{ flex: '0 0 50%', position: 'relative', overflow: 'hidden' }}
      >
        <img
          src={row.image}
          alt={row.label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: textFromX }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: textFromX }}
        transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
        className="hiw-text-block"
        style={{
          flex: '0 0 50%',
          display: 'flex',
          alignItems: 'center',
          padding: '48px 56px',
        }}
      >
        {isMobile ? (
          <div style={{ width: '100%' }}>
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls={descId}
              style={{
                background: 'none',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                padding: 0,
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
              }}
            >
              <PulseRing size={56} tone="light" pulse={!opened} delay={i * 0.3}>
                <Icon size={28} color="#4A443C" strokeWidth={1.75} />
              </PulseRing>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#0a0a0a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}
              >
                {row.label}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={descId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <p
                    className="hiw-desc"
                    style={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: 'var(--sov-grey)',
                      lineHeight: 1.65,
                      letterSpacing: 'normal',
                      maxWidth: '450px',
                      textAlign: 'justify',
                      paddingTop: '14px',
                    }}
                  >
                    {row.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Icon size={18} color="#0a0a0a" strokeWidth={1.75} style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0a0a0a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}
              >
                {row.label}
              </span>
            </div>
            <p
              className="hiw-desc"
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: 'var(--sov-grey)',
                lineHeight: 1.65,
                letterSpacing: 'normal',
                maxWidth: '450px',
                textAlign: 'justify',
              }}
            >
              {row.desc}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function HowItWorks() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '0px 0px -100px 0px', amount: 0.2 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <section data-bg="light" style={{ backgroundColor: 'var(--sov-white)', padding: '100px 0' }}>
      <div ref={headingRef} className="inner" style={{ maxWidth: '900px' }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: 'var(--sov-greige-dark)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          The Process
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(30px, 3.5vw, 44px)',
            fontWeight: 900,
            color: '#0a0a0a',
            letterSpacing: '-0.005em',
            lineHeight: 1.15,
          }}
        >
          How Your Design Pack Comes Together.
        </motion.h2>
      </div>

      <div className="hiw-rows-wrapper" style={{ maxWidth: '1200px', margin: '64px auto 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {rows.map((row, i) => (
          <Row key={row.num} row={row} i={i} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}
