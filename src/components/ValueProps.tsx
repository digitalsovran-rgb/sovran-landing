import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const cards = [
  {
    title: 'One team, one responsibility',
    body: 'A single team accountable for every detail, from concept to completion.',
  },
  {
    title: 'Payment protection',
    body: 'Structured contracts and milestone aligned payments designed to protect your investment.',
  },
  {
    title: 'Planning with purpose',
    body: 'Led by former planning officers who understand what drives approvals.',
  },
  {
    title: 'Dedicated project manager',
    body: 'Regular updates, clear communication, and complete project visibility.',
  },
  {
    title: 'Uncompromised quality',
    body: 'Meticulous craftsmanship and rigorous quality checks at every stage.',
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
      className="value-card"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? 'rgba(245,240,235,0.86)' : 'rgba(245,240,235,0.78)',
        border: 'none',
        padding: '48px 36px',
        transition: 'background-color 0.3s',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '2px',
          backgroundColor: '#c9a96e',
          marginBottom: '16px',
        }}
      />
      <h3
        className="value-card-title"
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#0a0a0a',
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
          marginBottom: '10px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {card.title}
      </h3>
      <p
        className="value-card-body"
        style={{
          fontSize: '13px',
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
      <img
        src="/media/humantouch.png"
        alt="Extensions done properly"
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

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          zIndex: 1,
        }}
      />

      {/* All content — pushed down to reveal face above headline */}
      <div
        className="value-content"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '150px 40px 40px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <motion.h2
          className="value-heading"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(36px, 4.35vw, 54px)',
            fontWeight: 900,
            color: '#f5f0eb',
            letterSpacing: '-0.005em',
            textAlign: 'center',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '80px',
          }}
        >
          Extensions. Done Properly.
        </motion.h2>

        {/* Top row — 3 cards */}
        <div
          className="value-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '32px',
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
