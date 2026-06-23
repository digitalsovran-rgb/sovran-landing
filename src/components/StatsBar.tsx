const stats = [
  { value: '15+', label: 'Years of Experience' },
  { value: '98%', label: 'Planning Success Rate' },
  { value: '£25M+', label: 'Value Delivered' },
  { value: '1,000+', label: 'Projects Delivered' },
];

export default function StatsBar() {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#0f0f0f',
      }}
    >
      <div
        className="stats-tiles"
        style={{
          display: 'flex',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label + i}
            className="stats-tile"
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderLeft: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              padding: '32px 40px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '10px',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
