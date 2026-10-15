import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type PeekTextProps = {
  open: boolean;
  id?: string;
  // How many lines show (faded) while closed.
  lines?: number;
  marginTop?: number;
  className?: string;
  wrapperClassName?: string;
  style?: React.CSSProperties;
  lang?: string;
  children: React.ReactNode;
};

// Fades the visible preview lines towards the bottom while the text is closed.
const MASK = 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 100%)';

// A paragraph that shows its first few lines as a faded preview and expands to its full
// height when opened. Heights are measured from the rendered text, so it adapts to any width.
export default function PeekText({
  open,
  id,
  lines = 2,
  marginTop = 0,
  className,
  wrapperClassName,
  style,
  lang,
  children,
}: PeekTextProps) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [m, setM] = useState({ full: 0, line: 0 });

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    const measure = () => {
      const el = pRef.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      let lh = parseFloat(cs.lineHeight);
      if (!Number.isFinite(lh)) lh = parseFloat(cs.fontSize) * 1.4;
      setM({ full: el.offsetHeight, line: lh });
    };

    measure();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && pRef.current) {
      observer = new ResizeObserver(measure);
      observer.observe(pRef.current);
    }
    window.addEventListener('resize', measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <motion.div
      id={id}
      className={wrapperClassName}
      initial={false}
      animate={{ height: m.full ? (open ? m.full : Math.min(m.full, m.line * lines)) : 'auto' }}
      transition={{ duration: reduced ? 0 : 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      style={{
        overflow: 'hidden',
        marginTop,
        WebkitMaskImage: open ? 'none' : MASK,
        maskImage: open ? 'none' : MASK,
      }}
    >
      <p ref={pRef} className={className} lang={lang} style={{ ...style, margin: 0 }}>
        {children}
      </p>
    </motion.div>
  );
}
