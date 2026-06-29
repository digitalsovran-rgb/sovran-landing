import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const extensions = [
  {
    title: 'Rear Extension',
    desc: 'Open the back of your home to the garden.',
    longDesc:
      'This Georgian property gained a full-width glass extension across the rear, opening the kitchen, dining and living areas into a single uninterrupted space. Slim black-framed sliding doors run the entire width of the new structure, folding the garden into the room on warmer days. A paved terrace was laid directly outside the doors, with steps leading down to the lawn, keeping the new space and garden feeling like one continuous area. Inside, oak flooring carries through from the original house into the extension, with no visible step or threshold between old and new.',
    image: '/media/rearext.png',
    imageLeft: true,
    location: 'Richmond, TW9',
  },
  {
    title: 'Loft Conversion',
    desc: 'Turn unused space into the room you need.',
    longDesc:
      "The loft of this Victorian terrace was converted into a full bedroom suite, with a slate-grey dormer extending the roofline to create proper standing height across the new floor. Large dormer windows were positioned to catch the rooftop views over the surrounding terraces, a detail the homeowners specifically asked for during early design conversations. Downstairs, the original sash windows and brick façade were left completely untouched, so the addition reads as a natural extension of the roofline rather than an obvious addition. The result added a full extra floor of usable space without altering the character of the street-facing elevation.",
    image: '/media/loftconver.png?v=3',
    imageLeft: false,
    location: 'Wimbledon, SW19',
  },
  {
    title: 'Side Return',
    desc: 'Reclaim the narrow gap beside your property.',
    longDesc:
      "The narrow side return of this terraced house was reclaimed and turned into the heart of the home, with a glass roof lantern installed to flood the new kitchen and dining space with daylight throughout the day. The original exposed brick wall was kept and cleaned back, giving the new extension a warmth that plastered walls wouldn't have achieved. A long kitchen island anchors the space, with bi-fold doors at the far end opening directly onto the garden. Open shelving and a built-in bookcase were added along the brick wall, making use of a space that was previously just a dead-end passage beside the house.",
    image: '/media/sideret.png',
    imageLeft: true,
    location: 'Chiswick, W4',
  },
  {
    title: 'Double Storey',
    desc: 'Two floors of new space. One build.',
    longDesc:
      'A red brick double-storey addition was built across the rear of this terraced home, matching the existing brickwork so closely the join is barely visible from the garden. The ground floor opens entirely through black-framed glazing into a new kitchen and dining space, while the bedroom above takes full advantage of the extra floor with a wall of glass overlooking the garden. Internally, the ceiling height was raised on both levels to avoid the boxed-in feeling many double-storey extensions create. The planting beneath the new windows was left untouched during construction, softening the new structure within weeks of completion.',
    image: '/media/doublstor.png?v=3',
    imageLeft: false,
    location: 'Hampstead, NW3',
  },
  {
    title: 'Wrap Around',
    desc: 'Change the entire feel of your home.',
    longDesc:
      "This period property's rear and side were both extended in a single wrap-around build, fully glazed at the corner to maximise light from two directions at once. The flat roof was finished in a dark anthracite frame, contrasting deliberately against the white render of the original façade. Inside, the kitchen, dining and living spaces flow continuously around the wrapped corner, with the garden visible from almost every point in the new structure. Lavender and hydrangea beds were planted along the new terrace edge, softening the glass line and giving the extension a settled, established feel from the moment it was finished.",
    image: '/media/wraparound.png',
    imageLeft: true,
    location: 'Notting Hill, W11',
  },
];

function ExtRow({ ext }: { ext: (typeof extensions)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });
  const [imgHovered, setImgHovered] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);
  const [clickActive, setClickActive] = useState(false);
  const textHovered = hoverActive || clickActive;

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
        overflow: 'hidden',
      }}
    >
      {/* Image block */}
      <motion.div
        initial={{ opacity: 0, x: imgFromX }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: imgFromX }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="ext-img-block"
        style={{
          flex: '0 0 55%',
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
            fontSize: '18px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            pointerEvents: 'none',
            textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)',
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
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
        onClick={() => setClickActive((c) => !c)}
        style={{
          flex: '0 0 45%',
          backgroundColor: textHovered ? '#0a0a0a' : '#ede7df',
          transition: 'background-color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          padding: '60px',
          cursor: 'default',
        }}
      >
        <div style={{ width: '100%' }}>
          <h3
            style={{
              fontSize: 'clamp(28px, 2.9vw, 40px)',
              fontWeight: 900,
              color: textHovered ? '#f5f0eb' : '#0a0a0a',
              letterSpacing: '-0.005em',
              lineHeight: 1.05,
              transition: 'color 0.3s ease',
            }}
          >
            {ext.title}
          </h3>

          {/* Description — default state fades out, long desc fades in on hover */}
          <div style={{ position: 'relative', marginTop: '16px', minHeight: '260px' }}>
            {/* Default: short tagline + read more cue, fades out together */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                opacity: textHovered ? 0 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 400,
                  color: 'rgba(0,0,0,0.6)',
                  lineHeight: 1.65,
                  letterSpacing: 'normal',
                }}
              >
                {ext.desc}
              </p>
              <p
                style={{
                  margin: '12px 0 0',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#c9a96e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Read More
              </p>
              <p
                className="ext-mob-tap"
                style={{
                  margin: '16px 0 0',
                  fontSize: '22px',
                  fontWeight: 300,
                  color: '#c9a96e',
                  lineHeight: 1,
                  display: 'none',
                }}
              >
                +
              </p>
            </div>
            {/* Hover: long description fades in */}
            <p
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                margin: 0,
                fontSize: '13px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.65,
                letterSpacing: 'normal',
                opacity: textHovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              {ext.longDesc}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ExtensionTypes() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '0px 0px -150px 0px', amount: 0.2 });

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
            fontSize: 'clamp(32px, 3.85vw, 46px)',
            fontWeight: 900,
            color: '#0a0a0a',
            letterSpacing: '-0.005em',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          RECENT EXTENSION PROJECTS
        </motion.h2>
      </div>
      {extensions.map((ext) => (
        <ExtRow key={ext.title} ext={ext} />
      ))}
    </section>
  );
}
