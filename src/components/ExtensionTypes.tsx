import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const extensions = [
  {
    title: 'Rear Extension',
    desc: 'Open the back of your home to the garden.',
    image: '/media/rearext.png',
    imageLeft: true,
  },
  {
    title: 'Loft Conversion',
    desc: 'Turn unused space into the room you need.',
    image: '/media/loftconver.png',
    imageLeft: false,
  },
  {
    title: 'Side Return',
    desc: 'Reclaim the narrow gap beside your property.',
    image: '/media/sideret.png',
    imageLeft: true,
  },
  {
    title: 'Double Storey',
    desc: 'Two floors of new space. One build.',
    image: '/media/doublstor.png',
    imageLeft: false,
  },
  {
    title: 'Wrap Around',
    desc: 'Change the entire feel of your home.',
    image: '/media/wraparound.png',
    imageLeft: true,
  },
];

function ExtRow({ ext }: { ext: (typeof extensions)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
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
  return (
    <section id="projects" style={{ backgroundColor: '#f5f0eb' }}>
      {extensions.map((ext) => (
        <ExtRow key={ext.title} ext={ext} />
      ))}
    </section>
  );
}
