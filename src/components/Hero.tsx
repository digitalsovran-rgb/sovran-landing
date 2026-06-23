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
    <section
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
          backgroundImage: 'url(/media/heroepic.png)',
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
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '120px 24px 0',
          width: '100%',
          maxWidth: '900px',
        }}
      >
        <motion.p
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            fontSize: 'clamp(36px, 5.5vw, 68px)',
            fontWeight: 900,
            color: '#ffffff',
            maxWidth: '900px',
            margin: '0 auto',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
        >
          Extending Your London Home?<br />Do It Once. Do It Right.
        </motion.h1>

        <motion.p
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
          A seamless design and build experience, combining architecture, planning and construction under one roof. Thoughtfully designed, expertly managed, and built to the highest standards.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
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
  );
}
