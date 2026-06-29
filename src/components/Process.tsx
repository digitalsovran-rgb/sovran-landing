import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const steps = [
  {
    num: '01',
    label: 'Discovery',
    tooltip: 'Every exceptional project begins with listening & understanding how you want to live, work, and experience your space.',
  },
  {
    num: '02',
    label: 'Design & Planning',
    tooltip: 'We transform your vision into a buildable design while managing planning application, regulations, and approvals, giving you confidence before construction begins.',
  },
  {
    num: '03',
    label: 'Construction',
    tooltip: 'Your project is delivered by experienced specialists, with clear communication, regular updates, and practical coordination around access, deliveries, and day-to-day decisions throughout the build.',
  },
  {
    num: '04',
    label: 'Completion & Aftercare',
    tooltip: 'We remain by your side even after completion, providing 6 months dedicated aftercare to address any settlement refinements, and a 10-year workmanship guarantee.',
  },
];

function StepItem({
  step,
  i,
  isInView,
}: {
  step: (typeof steps)[0];
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
        {step.num}
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
        {step.label}
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
        {step.tooltip}
      </div>

      {i < steps.length - 1 && (
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

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [openStep, setOpenStep] = useState<number | null>(null);

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
            fontSize: 'clamp(36px, 4.35vw, 50px)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.005em',
            color: '#f5f0eb',
            marginBottom: '60px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          The Sovran Method
        </motion.p>

        {isMobile ? (
          /* Mobile: vertical accordion */
          <div style={{ padding: '0 24px 16px' }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
              >
                <button
                  type="button"
                  onClick={() => setOpenStep(openStep === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    background: 'none',
                    border: 'none',
                    borderBottom: `1px solid rgba(255,255,255,${openStep === i ? '0.12' : '0.08'})`,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span
                      style={{
                        fontSize: '24px',
                        fontWeight: 900,
                        color: openStep === i ? '#c9a96e' : 'rgba(201,169,110,0.4)',
                        letterSpacing: '-0.005em',
                        lineHeight: 1,
                        minWidth: '36px',
                        transition: 'color 0.25s ease',
                      }}
                    >
                      {step.num}
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
                      {step.label}
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
                      transform: openStep === i ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                    }}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {openStep === i && (
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
                      {step.tooltip}
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

            {steps.map((step, i) => (
              <StepItem key={step.num} step={step} i={i} isInView={isInView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
