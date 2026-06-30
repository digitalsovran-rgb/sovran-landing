import { motion } from 'framer-motion';

const btnBase: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '16px 32px',
  cursor: 'pointer',
  transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
};

export default function Hero() {
  const scrollToForm = () => {
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        .hero-hl { white-space: nowrap; }
        @media (max-width: 767px) {
          .hero-hl { white-space: normal; }
          .hero-h1 { font-size: clamp(24px, 6.5vw, 32px) !important; font-weight: 800 !important; }
          .hero-label { font-size: 10px !important; margin-bottom: 24px !important; font-weight: 600 !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
          .hero-desc { font-size: 13px !important; font-weight: 500 !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
        }
      `}</style>
      <section
        id="hero"
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Background */}
        <motion.div
          className="hero-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/media/heroepic.png?v=2)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.35)',
          }}
        />

        {/* Content */}
        <div
          className="hero-content"
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            padding: '120px 24px 0',
            width: '100%',
            maxWidth: '1000px',
          }}
        >
          <motion.p
            className="hero-label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              color: '#c9a96e',
              textTransform: 'uppercase',
              marginBottom: '40px',
            }}
          >
            London&apos;s Luxury Extension Specialists
          </motion.p>

          <motion.h1
            className="hero-h1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{
              fontSize: 'clamp(36px, 5.8vw, 73px)',
              fontWeight: 900,
              color: '#ffffff',
              margin: '0 auto',
              lineHeight: 1.05,
              letterSpacing: '-0.005em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <div className="hero-hl">EXTENDING YOUR HOME?</div>
            <div className="hero-hl">DO IT ONCE. DO IT RIGHT.</div>
          </motion.h1>

          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '560px',
              margin: '40px auto 0',
              lineHeight: 1.75,
              letterSpacing: 'normal',
            }}
          >
            Premium Design &amp; Build. Architecture, planning, and construction delivered as one seamless experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hero-btns"
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '56px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={scrollToForm}
              className="hero-btn"
              style={{
                ...btnBase,
                backgroundColor: '#ffffff',
                color: '#000000',
                border: '1px solid #ffffff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#c9a96e';
                e.currentTarget.style.borderColor = '#c9a96e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#ffffff';
              }}
            >
              Book Your Design Consultation
            </button>

            <button
              onClick={scrollToProjects}
              className="hero-btn"
              style={{
                ...btnBase,
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.6)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#c9a96e';
                e.currentTarget.style.color = '#c9a96e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              See Our Projects
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
