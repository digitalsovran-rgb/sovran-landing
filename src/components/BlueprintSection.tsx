import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const items = [
  {
    num: '01',
    label: 'Floor Plans',
    tooltip: 'Precise architectural drawings showing the full layout of your proposed extension — every dimension, door, and window positioned — so you can see exactly how your new space will live before a single wall moves.',
  },
  {
    num: '02',
    label: 'Moodboard',
    tooltip: 'A curated visual reference combining materials, finishes, and textures that translate your brief into a clear aesthetic direction — something you can see, refine, and align on before design begins.',
  },
  {
    num: '03',
    label: '3D Visuals',
    tooltip: 'Photorealistic renders of your completed extension, inside and out, from every angle. See your home transformed before construction begins.',
  },
  {
    num: '04',
    label: 'Comprehensive Proposal',
    tooltip: 'A detailed project document covering your estimated budget, build timeline, and planning potential. The full picture, in writing, before you commit to anything.',
  },
];

function ItemBlock({
  item,
  i,
  isInView,
}: {
  item: (typeof items)[0];
  i: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 40 }}
      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '24px 20px',
        backgroundColor: hovered ? '#f5f0eb' : 'transparent',
        transition: 'background-color 0.3s ease',
        cursor: 'default',
      }}
    >
      <span
        style={{
          display: 'block',
          fontSize: '48px',
          fontWeight: 900,
          color: hovered ? '#0a0a0a' : 'rgba(201,169,110,0.4)',
          letterSpacing: '-0.005em',
          lineHeight: 1,
          transition: 'color 0.3s ease',
        }}
      >
        {item.num}
      </span>

      <span
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: hovered ? '#0a0a0a' : '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginTop: '8px',
          transition: 'color 0.3s ease',
        }}
      >
        {item.label}
      </span>

      <div
        style={{
          fontSize: '13px',
          lineHeight: 1.6,
          color: '#0a0a0a',
          maxWidth: '220px',
          margin: '12px auto 0',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        {item.tooltip}
      </div>

      {i < items.length - 1 && (
        <div
          style={{
            position: 'absolute',
            right: '-1px',
            top: '48px',
            width: 0,
            height: 0,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderLeft: '6px solid rgba(255,255,255,0.2)',
            zIndex: 2,
          }}
        />
      )}
    </motion.div>
  );
}

export default function BlueprintSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [openItem, setOpenItem] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <section ref={ref} style={{ backgroundColor: '#0a0a0a', padding: '48px 0' }}>
      <div className="process-inner">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: '#c9a96e',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          Complimentary With Every Consultation
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(36px, 4.35vw, 50px)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.005em',
            color: '#f5f0eb',
            marginBottom: '20px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Your Sovran Home Transformation Blueprint
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 400,
            color: 'rgba(245,240,235,0.6)',
            lineHeight: 1.65,
            letterSpacing: 'normal',
            maxWidth: '620px',
            margin: '0 auto 60px',
          }}
        >
          Before your project begins, receive a comprehensive concept design package — built
          around your property, your brief, and your vision.
        </motion.p>

        {isMobile ? (
          /* Mobile: vertical accordion */
          <div style={{ padding: '0 24px 16px' }}>
            {items.map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
              >
                <button
                  type="button"
                  onClick={() => setOpenItem(openItem === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    background: 'none',
                    border: 'none',
                    borderBottom: `1px solid rgba(255,255,255,${openItem === i ? '0.12' : '0.08'})`,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span
                      style={{
                        fontSize: '24px',
                        fontWeight: 900,
                        color: openItem === i ? '#c9a96e' : 'rgba(201,169,110,0.4)',
                        letterSpacing: '-0.005em',
                        lineHeight: 1,
                        minWidth: '36px',
                        transition: 'color 0.25s ease',
                      }}
                    >
                      {item.num}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    style={{
                      color: '#c9a96e',
                      fontSize: '20px',
                      lineHeight: 1,
                      flexShrink: 0,
                      marginLeft: '12px',
                      display: 'inline-block',
                      transform: openItem === i ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                    }}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {openItem === i && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.55)',
                        lineHeight: 1.65,
                        letterSpacing: 'normal',
                        margin: 0,
                        paddingTop: '16px',
                        paddingBottom: '24px',
                        paddingLeft: '52px',
                        paddingRight: '0',
                      }}
                    >
                      {item.tooltip}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Desktop: horizontal strip */
          <div
            className="process-row"
            style={{
              display: 'flex',
              position: 'relative',
              width: '100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '48px',
                left: '10%',
                right: '10%',
                height: '1px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                zIndex: 0,
              }}
            />

            {items.map((item, i) => (
              <ItemBlock key={item.num} item={item} i={i} isInView={isInView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
