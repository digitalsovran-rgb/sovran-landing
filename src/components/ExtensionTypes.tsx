import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const extensions = [
  {
    title: 'Rear Extension',
    desc: 'Open the back of your home to the garden.',
    image: '/media/rearext.png',
    imageLeft: true,
    location: 'Richmond, TW9',
  },
  {
    title: 'Loft Conversion',
    desc: 'Turn unused space into the room you need.',
    image: '/media/loftconver.png?v=3',
    imageLeft: false,
    location: 'Wimbledon, SW19',
  },
  {
    title: 'Side Return',
    desc: 'Reclaim the narrow gap beside your property.',
    image: '/media/sideret.png',
    imageLeft: true,
    location: 'Chiswick, W4',
  },
  {
    title: 'Double Storey',
    desc: 'Two floors of new space. One build.',
    image: '/media/doublstor.png?v=2',
    imageLeft: false,
    location: 'Hampstead, NW3',
  },
  {
    title: 'Wrap Around',
    desc: 'Change the entire feel of your home.',
    image: '/media/wraparound.png',
    imageLeft: true,
    location: 'Notting Hill, W11',
  },
];

function ExtRow({ ext }: { ext: (typeof extensions)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const [imgHovered, setImgHovered] = useState(false);

  const imgFromX = ext.imageLeft ? -60 : 60;
  const textFromX = ext.imageLeft ? 60 : -60;

  return (
    <div
      ref={ref}
      className="ext-row"
      style={{
        display: 'flex',
        flexDirection: ext.imageLeft ? 'row' : 'row-reverse',
        height: '500px',
      }}
    >
      {/* Image block */}
      <motion.div
        initial={{ opacity: 0, x: imgFromX }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: imgFromX }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="ext-img-block"
        style={{
          flex: '0 0 60%',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => setImgHovered(false)}
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
            transform: imgHovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        />
        {/* Location label — no background, text-shadow only */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            pointerEvents: 'none',
            textShadow: '0 2px 6px rgba(0,0,0,0.6)',
          }}
        >
          {ext.location}
        </div>
      </motion.div>

      {/* Text block */}
      <motion.div
        initial={{ opacity: 0, x: textFromX }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: textFromX }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
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
      </motion.div>
    </div>
  );
}

export default function ExtensionTypes() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '0px' });

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
          initial={{ opacity: 0, y: 40 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
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
