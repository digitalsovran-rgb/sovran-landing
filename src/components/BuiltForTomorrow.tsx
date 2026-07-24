import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check } from 'lucide-react';

const checklist = [
  'Warmer and more energy efficient',
  'Less expensive to run',
  'Filled with natural light',
  'Designed for healthier, more comfortable living',
  'Built to deliver lasting value for years to come',
];

export default function BuiltForTomorrow() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#0a0a0a',
      }}
    >
      {/* Background image */}
      <picture>
        <source media="(max-width: 768px)" srcSet="/media/humantouchmob.png" />
        <img
          src="/media/humantouch.png"
          alt="Sovran homes built for the future"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            zIndex: 0,
          }}
        />
      </picture>

      {/* Dark scrim — increases toward the bottom so text stays readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.8) 100%)',
          zIndex: 1,
        }}
      />

      <div
        className="inner"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '100px 40px',
          maxWidth: '900px',
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: '#c9a96e',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          The Best Time To Build For Tomorrow Is Today
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(30px, 3.5vw, 44px)',
            fontWeight: 900,
            color: '#f5f0eb',
            letterSpacing: '-0.005em',
            lineHeight: 1.15,
          }}
        >
          From March 2027, New Standards Will Judge Homes On How They Perform, Not Just How They
          Look.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#f5f0eb',
            lineHeight: 1.7,
            letterSpacing: 'normal',
            maxWidth: '600px',
            marginTop: '28px',
          }}
        >
          At Sovran, we&apos;re already designing with the future in mind. That means homes that
          are:
        </motion.p>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {checklist.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.08, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <Check size={18} color="#c9a96e" strokeWidth={2.25} style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#f5f0eb',
                  letterSpacing: 'normal',
                }}
              >
                {item}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#f5f0eb',
            lineHeight: 1.7,
            letterSpacing: 'normal',
            maxWidth: '650px',
            marginTop: '32px',
          }}
        >
          Exceptional homes aren&apos;t created by reacting to regulation. They&apos;re created by
          planning ahead. Our architects, planners and construction specialists work as one team
          from the outset, so every decision contributes to a home that&apos;s beautiful today and
          ready for tomorrow.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          style={{
            fontSize: '19px',
            fontWeight: 600,
            color: '#c9a96e',
            lineHeight: 1.5,
            letterSpacing: 'normal',
            maxWidth: '650px',
            marginTop: '32px',
          }}
        >
          Planning an extension or renovation? Start with a design that&apos;s built for the
          future.
        </motion.p>
      </div>
    </section>
  );
}
