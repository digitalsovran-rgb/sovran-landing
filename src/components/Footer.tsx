export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '40px 0',
      }}
    >
      <div className="inner">
        <div
          className="footer-grid"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left */}
          <div>
            <p
              style={{
                fontSize: '16px',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.01em',
                marginBottom: '6px',
              }}
            >
              Sovran Group
            </p>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              Architecture, Design and Build
            </p>
          </div>

          {/* Centre */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '6px',
              }}
            >
              020 3143 0103
            </p>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              info@sovrangroup.co.uk
            </p>
          </div>

          {/* Right */}
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              &copy; 2026 Sovran Group Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
