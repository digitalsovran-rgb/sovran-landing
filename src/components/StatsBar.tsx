import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: '15+', label: 'Years of Experience' },
  { value: '97%', label: 'Planning Success Rate' },
  { value: '£25M+', label: 'Value Delivered' },
  { value: '1,000+', label: 'Projects Completed' },
];

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        backgroundColor: '#0f0f0f',
      }}
    >
      <div
        className="stats-tiles"
        style={{
          display: 'flex',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label + i}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            className="stats-tile"
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderLeft: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              padding: '32px 40px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '10px',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
