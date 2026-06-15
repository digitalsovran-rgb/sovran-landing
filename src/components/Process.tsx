const steps = [
  { num: '01', label: 'Consultation' },
  { num: '02', label: 'Design' },
  { num: '03', label: 'Planning' },
  { num: '04', label: 'Build' },
  { num: '05', label: 'Handover' },
];

export default function Process() {
  return (
    <section style={{ backgroundColor: '#0a0a0a', padding: '80px 0' }}>
      <div className="process-inner">
        <div
          className="process-row"
          style={{
            display: 'flex',
            position: 'relative',
            width: '100%',
          }}
        >
          {/* Connecting line behind all steps */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '10%',
              right: '10%',
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              zIndex: 0,
            }}
          />

          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                flex: 1,
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
                padding: '0 8px',
              }}
            >
              {/* Step number */}
              <span
                style={{
                  display: 'block',
                  fontSize: '48px',
                  fontWeight: 900,
                  color: 'rgba(201,169,110,0.4)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {step.num}
              </span>

              {/* Step label */}
              <span
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  marginTop: '8px',
                }}
              >
                {step.label}
              </span>

              {/* Arrowhead at right edge of step (except last) */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    right: '-1px',
                    top: '21px',
                    width: 0,
                    height: 0,
                    borderTop: '4px solid transparent',
                    borderBottom: '4px solid transparent',
                    borderLeft: '6px solid rgba(255,255,255,0.2)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
