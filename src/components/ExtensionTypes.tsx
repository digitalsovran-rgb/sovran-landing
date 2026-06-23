import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const extensions = [
  {
    title: 'Rear Extension',
    desc: 'Open the back of your home to the garden.',
    image: '/media/rearext.png',
    imageLeft: true,
    location: 'Richmond, London',
  },
  {
    title: 'Loft Conversion',
    desc: 'Turn unused space into the room you need.',
    image: '/media/loftconver.png?v=3',
    imageLeft: false,
    location: 'Wimbledon, London',
  },
  {
    title: 'Side Return',
    desc: 'Reclaim the narrow gap beside your property.',
    image: '/media/sideret.png',
    imageLeft: true,
    location: 'Chiswick, London',
  },
  {
    title: 'Double Storey',
    desc: 'Two floors of new space. One build.',
    image: '/media/doublstor.png?v=2',
    imageLeft: false,
    location: 'Hampstead, London',
  },
  {
    title: 'Wrap Around',
    desc: 'Change the entire feel of your home.',
    image: '/media/wraparound.png',
    imageLeft: true,
    location: 'Notting Hill, London',
  },
];

function ExtRow({ ext }: { ext: (typeof extensions)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="ext-row"
      style={{
        display: 'flex',
        flexDirection: ext.imageLeft ? 'row' : 'row-reverse',
        height: '500px',
      }}
    >
      {/* Image block */}
      <div
        className="ext-img-block"
        style={{
          flex: '0 0 60%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={ext.image}
          alt={ext.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
        {/* Location label */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            backgroundColor: 'rgba(10,10,10,0.6)',
            color: '#ffffff',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '6px 14px',
            pointerEvents: 'none',
          }}
        >
          {ext.location}
        </div>
      </div>

      {/* Text block */}
      <div
        className="ext-text-block"
        style={{
          flex: '0 0 40%',
          backgroundColor: '#f5f0eb',
          display: 'flex',
          alignItems: 'center',
          padding: '60px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 'clamp(28px, 3vw, 42px)',
              fontWeight: 900,
              color: '#0a0a0a',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
          >
            {ext.title}
          </h3>
          <p
            style={{
              fontSize: '15px',
              fontWeight: 400,
              color: 'rgba(0,0,0,0.6)',
              marginTop: '16px',
              lineHeight: 1.65,
              letterSpacing: 'normal',
            }}
          >
            {ext.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExtensionTypes() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-60px' });

  return (
    <section id="projects" style={{ backgroundColor: '#f5f0eb' }}>
      <div
        ref={headingRef}
        style={{
          textAlign: 'center',
          padding: '100px 24px 60px',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 900,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Recent Extension Projects Across London
        </motion.h2>
      </div>
      {extensions.map((ext) => (
        <ExtRow key={ext.title} ext={ext} />
      ))}
    </section>
  );
}
