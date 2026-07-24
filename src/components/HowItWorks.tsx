import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Ruler, PenTool, Video, ClipboardCheck } from 'lucide-react';

const rows = [
  {
    num: '01',
    icon: Ruler,
    label: 'Site Survey',
    image: '/media/heroepic.png',
    imageLeft: true,
    desc: 'A measured survey of your property, carried out in person by our team, so every drawing that follows starts from real dimensions, not assumptions.',
  },
  {
    num: '02',
    icon: PenTool,
    label: 'Architectural Drawings',
    image: '/media/before1.png',
    imageLeft: false,
    desc: "Floor plans developed around your brief and your home, already accounting for the energy and comfort standards taking effect from March 2027, so what's drawn today still holds up tomorrow.",
  },
  {
    num: '03',
    icon: Video,
    label: '3D Render & Walkthrough',
    image: '/media/after1.png',
    imageLeft: true,
    desc: 'See the finished extension before a single brick is laid, rendered and walked through in full.',
  },
  {
    num: '04',
    icon: ClipboardCheck,
    label: 'Planning Assessment',
    image: '/media/humantouch.png',
    imageLeft: false,
    desc: 'A clear read on planning potential, budget and timeline, including how the finished extension performs against the standards coming into force in 2027.',
  },
];

function Row({
  row,
  delay,
  isInView,
}: {
  row: (typeof rows)[0];
  delay: number;
  isInView: boolean;
}) {
  const Icon = row.icon;
  const imgFromX = row.imageLeft ? -50 : 50;
  const textFromX = row.imageLeft ? 50 : -50;

  return (
    <div
      className="hiw-row"
      style={{
        display: 'flex',
        flexDirection: row.imageLeft ? 'row' : 'row-reverse',
        alignItems: 'stretch',
        minHeight: '420px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: imgFromX }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: imgFromX }}
        transition={{ duration: 0.8, delay, ease: 'easeOut' }}
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
        transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        className="hiw-text-block"
        style={{
          flex: '0 0 50%',
          display: 'flex',
          alignItems: 'center',
          padding: '48px 56px',
        }}
      >
        <div>
          <span
            style={{
              display: 'block',
              fontSize: '40px',
              fontWeight: 900,
              color: '#c9a96e',
              letterSpacing: '-0.005em',
              lineHeight: 1,
              marginBottom: '14px',
            }}
          >
            {row.num}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Icon size={18} color="#f5f0eb" strokeWidth={1.75} style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#f5f0eb',
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
              color: 'rgba(245,240,235,0.65)',
              lineHeight: 1.65,
              letterSpacing: 'normal',
              maxWidth: '450px',
            }}
          >
            {row.desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const [ctaHovered, setCtaHovered] = useState(false);

  const scrollToForm = () => {
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} style={{ backgroundColor: '#0a0a0a', padding: '100px 0' }}>
      <div className="inner" style={{ maxWidth: '900px' }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: '#c9a96e',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Designed For What&apos;s Next
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(30px, 3.5vw, 44px)',
            fontWeight: 900,
            color: '#f5f0eb',
            letterSpacing: '-0.005em',
            lineHeight: 1.15,
          }}
        >
          A Design Pack Built For Where Home Standards Are Heading.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 400,
            color: '#f5f0eb',
            lineHeight: 1.7,
            letterSpacing: 'normal',
            maxWidth: '650px',
            margin: '20px auto 0',
          }}
        >
          From March 2027, new standards will judge homes on how they perform, not just how they
          look: warmer, more efficient to run, filled with natural light, and built to hold their
          value for years. We&apos;re already designing this way, and every design pack you
          receive reflects it.
        </motion.p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '64px auto 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {rows.map((row, i) => (
          <Row key={row.num} row={row} delay={i * 0.05} isInView={isInView} />
        ))}
      </div>

      <div className="inner" style={{ maxWidth: '900px' }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '17px',
            fontWeight: 500,
            color: '#c9a96e',
            lineHeight: 1.6,
            letterSpacing: 'normal',
            maxWidth: '600px',
            margin: '64px auto 0',
          }}
        >
          Homes built to last aren&apos;t created by reacting to new rules once they arrive.
          They&apos;re created by planning for them in advance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          style={{ marginTop: '40px', textAlign: 'center' }}
        >
          <button
            type="button"
            onClick={scrollToForm}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '400px',
              margin: '0 auto',
              backgroundColor: ctaHovered ? '#e1dcd8' : '#f5f0eb',
              color: '#0a0a0a',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '16px 32px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          >
            Claim Your Design Package
          </button>
        </motion.div>
      </div>
    </section>
  );
}
