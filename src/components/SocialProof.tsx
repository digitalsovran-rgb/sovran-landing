import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const testimonials = [
  {
    quote:
      "We've worked with Sovran for over five years on multiple developments. Their consistency, attention to detail, and reliability keep us coming back — they deliver exactly what high-value projects demand.",
    name: "Marcus O'Neill",
    title: 'Residential Property Developer, London',
    image: '/media/marcus.png',
  },
  {
    quote:
      'Military-level precision on every project. Sovran understood our vision from day one and delivered without a single compromise on quality or timeline.',
    name: 'Shiv Patel',
    title: 'Property Investor, London',
    image: '/media/shiv.png',
  },
  {
    quote:
      'They went beyond our expectations. The attention to detail, the communication throughout, and the final result — everything exceeded what we thought was possible.',
    name: 'Nyla Idrissi',
    title: 'Homeowner, West London',
    image: '/media/nyla.png',
  },
];

function TestimonialCard({
  t,
  delay,
  isInView,
}: {
  t: (typeof testimonials)[0];
  delay: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay }}
      style={{
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {/* Profile picture */}
      <img
        src={t.image}
        alt={t.name}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          objectFit: 'cover',
          objectPosition: 'center top',
          marginBottom: '16px',
          border: '2px solid rgba(201,169,110,0.3)',
          display: 'block',
        }}
      />

      {/* Stars */}
      <div
        style={{
          fontSize: '16px',
          color: '#c9a96e',
          marginBottom: '16px',
          letterSpacing: '2px',
        }}
      >
        ★★★★★
      </div>

      {/* Quote */}
      <p
        style={{
          fontSize: '15px',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.8,
          fontStyle: 'italic',
          flex: 1,
          letterSpacing: 'normal',
        }}
      >
        {t.quote}
      </p>

      {/* Attribution */}
      <div style={{ marginTop: '32px' }}>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
        >
          {t.name}
        </p>
        <p
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.4)',
            marginTop: '4px',
            letterSpacing: 'normal',
          }}
        >
          {t.title}
        </p>
      </div>
    </motion.div>
  );
}

export default function SocialProof() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{ backgroundColor: '#0a0a0a', padding: '100px 0' }}
    >
      <div className="inner">
        <h2
          style={{
            fontSize: 'clamp(30px, 3.5vw, 48px)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 80px',
            lineHeight: 1.1,
          }}
        >
          Stories of Success
        </h2>

        <div
          className="testimonials-grid"
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={t.name}
              t={t}
              delay={i * 0.12}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
