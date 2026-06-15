import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(Math.max((x / rect.width) * 100, 1), 99);
    setSliderPos(pct);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      updatePos(e.clientX);
    },
    [updatePos],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current) return;
      updatePos(e.touches[0].clientX);
    },
    [updatePos],
  );

  const stopDrag = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', stopDrag);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDrag);
    };
  }, [handleMouseMove, handleTouchMove, stopDrag]);

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#f5f0eb', padding: '100px 0' }}
    >
      <div className="inner" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <p
          style={{
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: '#0a0a0a',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          The Transformation
        </p>
        <h2
          style={{
            fontSize: 'clamp(28px, 3.5vw, 44px)',
            fontWeight: 900,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
          }}
        >
          Drag to see the transformation.
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <div
          ref={containerRef}
          className="ba-container"
          onMouseDown={() => {
            isDragging.current = true;
          }}
          onTouchStart={() => {
            isDragging.current = true;
          }}
          style={{
            position: 'relative',
            width: '85vw',
            maxWidth: '1200px',
            height: '600px',
            overflow: 'hidden',
            cursor: 'ew-resize',
            userSelect: 'none',
            touchAction: 'none',
          }}
        >
          {/* After image — always full */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/media/afterpic.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Before image — clipped to left portion */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/media/beforepic.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            }}
          />

          {/* Slider line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${sliderPos}%`,
              transform: 'translateX(-50%)',
              width: '2px',
              backgroundColor: '#ffffff',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            {/* Handle */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#000000',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <svg
                width="22"
                height="12"
                viewBox="0 0 22 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 6H21M1 6L5 2M1 6L5 10M21 6L17 2M21 6L17 10"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Before label */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#ffffff',
              padding: '8px 16px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          >
            Before
          </div>

          {/* After label */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#ffffff',
              padding: '8px 16px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          >
            After
          </div>
        </div>
      </motion.div>
    </section>
  );
}
