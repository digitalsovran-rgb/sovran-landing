import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileSearch, PenTool, Video, ClipboardCheck, HardHat } from 'lucide-react';

const rows = [
  {
    num: '01',
    icon: FileSearch,
    label: 'Brief',
    image: '/media/sites.webp',
    imageLeft: true,
    desc: 'We shape the plan around your goals. If a site survey is needed, it comes with your package.',
  },
  {
    num: '02',
    icon: PenTool,
    label: 'Drawings',
    image: '/media/archdraw.webp',
    imageLeft: false,
    desc: 'Floor plans built around you, already prepared for the 2027 energy standards.',
  },
  {
    num: '03',
    icon: Video,
    label: 'Walkthrough',
    image: '/media/renderw.webp?v=2',
    imageLeft: true,
    desc: 'Walk through your home in 3D and adjust anything you like.',
  },
  {
    num: '04',
    icon: ClipboardCheck,
    label: 'Planning',
    image: '/media/plann.webp',
    imageLeft: false,
    desc: 'We prepare and manage your application, so you are ready to build with us.',
  },
  {
    num: '05',
    icon: HardHat,
    label: 'Build',
    image: '/media/startb.webp',
    imageLeft: true,
    desc: 'One project manager and one team take you from the first day to moving in.',
  },
];

function Row({ row, i, isMobile }: { row: (typeof rows)[0]; i: number; isMobile: boolean }) {
  // Each row observes its own (comparatively short) container rather than sharing a single
  // isInView tied to the whole section. A shared isInView over the whole (very tall,
  // stacked-on-mobile) section could never reach its visibility threshold and left
  // everything stuck at opacity 0.
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px', amount: 0.2 });
  const Icon = row.icon;
  const imgFromX = row.imageLeft ? -50 : 50;
  const textFromX = row.imageLeft ? 50 : -50;

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px' }}>
              <Icon size={28} color="#4A443C" strokeWidth={1.75} style={{ flexShrink: 0 }} />
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
            </div>
            <p
              lang="en-GB"
              style={{
                margin: '10px 0 0',
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#6B655C',
                textAlign: 'left',
              }}
            >
              {row.desc}
            </p>
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
              lang="en-GB"
              style={{
                fontSize: '17px',
                fontWeight: 400,
                color: 'var(--sov-grey)',
                lineHeight: 1.6,
                letterSpacing: 'normal',
                maxWidth: '450px',
                textAlign: 'left',
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
          className="sov-h2"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            color: '#0a0a0a',
          }}
        >
          Five Steps To Your Front Door.
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
