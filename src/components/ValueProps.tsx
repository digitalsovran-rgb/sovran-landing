import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const cards = [
  {
    title: 'Design & Build',
    body: 'One team handling architecture and construction from day one. No handovers, no blame shifting.',
  },
  {
    title: 'Deadline Guaranteed',
    body: 'Every stage agreed in writing before work begins. Payments tied to progress, not promises.',
  },
  {
    title: '95% Planning Approval',
    body: 'Our former planning officers know exactly what local authorities look for. Your project moves forward, not sideways.',
  },
  {
    title: 'Full Accountability',
    body: 'A dedicated project manager assigned to you from start to finish. Weekly updates, full visibility, no chasing.',
  },
  {
    title: 'No Hidden Fees',
    body: 'What you agree on day one is what you pay. Every cost outlined upfront, nothing added along the way.',
  },
];

function ValueCard({
  card,
  delay,
  isInView,
}: {
  card: (typeof cards)[0];
  delay: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#ede8e1',
        border: `1px solid ${hovered ? 'rgba(201,169,110,0.4)' : 'rgba(0,0,0,0.08)'}`,
        padding: '40px',
        transition: 'border-color 0.3s',
        height: '100%',
      }}
    >
      {/* Gold accent line */}
      <div
        style={{
          width: '32px',
          height: '2px',
          backgroundColor: '#c9a96e',
          marginBottom: '24px',
        }}
      />
      <h3
        style={{
          fontSize: '28px',
          fontWeight: 900,
          color: '#0a0a0a',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '12px',
        }}
      >
        {card.title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          fontWeight: 400,
          color: 'rgba(0,0,0,0.55)',
          lineHeight: 1.7,
          letterSpacing: 'normal',
        }}
      >
        {card.body}
      </p>
    </motion.div>
  );
}

export default function ValueProps() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{ backgroundColor: '#f5f0eb', padding: '100px 0' }}
    >
      <div className="inner">
        <h2
          style={{
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            fontWeight: 900,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            marginBottom: '80px',
          }}
        >
          The Experience You Should Expect.
        </h2>

        {/* Top row — 3 cards */}
        <div
          className="value-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          {cards.slice(0, 3).map((card, i) => (
            <ValueCard
              key={card.title}
              card={card}
              delay={i * 0.1}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom row — 2 cards centered */}
        <div
          className="value-bottom-row"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {cards.slice(3).map((card, i) => (
            <div
              key={card.title}
              className="value-bottom-card"
              style={{
                flex: '0 0 calc(33.333% - 8px)',
                maxWidth: 'calc(33.333% - 8px)',
              }}
            >
              <ValueCard
                card={card}
                delay={(i + 3) * 0.1}
                isInView={isInView}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
