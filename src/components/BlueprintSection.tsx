import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Ruler, Palette, Box, FileText, ChevronDown } from 'lucide-react';

const items = [
  {
    icon: Ruler,
    label: 'Floor Plans',
    desc: 'Precise architectural drawings of your proposed extension, every dimension positioned.',
  },
  {
    icon: Palette,
    label: 'Moodboard',
    desc: 'Materials, finishes, and textures curated around your brief and aesthetic.',
  },
  {
    icon: Box,
    label: '3D Visuals',
    desc: 'Photorealistic renders of your completed extension before construction begins.',
  },
  {
    icon: FileText,
    label: 'Comprehensive Proposal',
    desc: 'Full budget, build timeline, and planning potential — in writing, before you commit.',
  },
];

function ItemRow({
  item,
  delay,
  isInView,
  isMobile,
}: {
  item: (typeof items)[0];
  delay: number;
  isInView: boolean;
  isMobile: boolean;
}) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      style={
        isMobile
          ? { borderBottom: '1px solid rgba(245,240,235,0.15)' }
          : {
              border: '1px solid rgba(245,240,235,0.15)',
              borderRadius: '8px',
              padding: '0 20px',
            }
      }
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '20px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
          <Icon size={20} color="#f5f0eb" strokeWidth={1.75} style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#f5f0eb',
              letterSpacing: '0.01em',
            }}
          >
            {item.label}
          </span>
        </div>
        <ChevronDown
          size={18}
          color="#f5f0eb"
          strokeWidth={1.75}
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
          }}
        />
      </button>

      <div
        style={{
          maxHeight: open ? '100px' : '0px',
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.25s ease',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: 'rgba(245,240,235,0.65)',
            lineHeight: 1.6,
            letterSpacing: 'normal',
            margin: 0,
            paddingLeft: '34px',
            paddingBottom: '20px',
          }}
        >
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function BlueprintSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const scrollToForm = () => {
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: '#0a0a0a',
        paddingTop: 0,
        paddingBottom: isMobile ? '56px' : '96px',
      }}
    >
      <div
        className="inner"
        style={{
          maxWidth: '860px',
          paddingTop: isMobile ? '64px' : '100px',
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: isMobile ? '16px' : '17px',
            fontWeight: 400,
            color: '#f5f0eb',
            lineHeight: 1.6,
            letterSpacing: 'normal',
            maxWidth: '620px',
            margin: '0 auto',
          }}
        >
          Before your project begins, receive a comprehensive concept design package — built
          around your property, your brief, and your vision.
        </motion.p>

        <div
          style={{
            marginTop: isMobile ? '40px' : '56px',
            display: isMobile ? 'block' : 'grid',
            gridTemplateColumns: isMobile ? undefined : 'repeat(2, 1fr)',
            gap: isMobile ? 0 : '16px',
            maxWidth: isMobile ? '380px' : 'none',
            marginLeft: isMobile ? 'auto' : undefined,
            marginRight: isMobile ? 'auto' : undefined,
            padding: isMobile ? '0 24px' : 0,
          }}
        >
          {items.map((item, i) => (
            <ItemRow
              key={item.label}
              item={item}
              delay={i * 0.08}
              isInView={isInView}
              isMobile={isMobile}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          style={{
            marginTop: isMobile ? '40px' : '56px',
            textAlign: 'center',
          }}
        >
          <button
            type="button"
            onClick={scrollToForm}
            onMouseEnter={() => { if (!isMobile) setCtaHovered(true); }}
            onMouseLeave={() => { if (!isMobile) setCtaHovered(false); }}
            style={{
              display: 'block',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '100%' : '400px',
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
          <p
            style={{
              fontSize: '12px',
              fontWeight: 400,
              color: 'rgba(245,240,235,0.55)',
              textAlign: 'center',
              marginTop: '8px',
              letterSpacing: 'normal',
            }}
          >
            Limited availability
          </p>
        </motion.div>
      </div>
    </section>
  );
}
