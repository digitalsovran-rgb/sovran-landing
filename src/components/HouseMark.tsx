type HouseMarkProps = {
  size: number;
  drawRef: React.Ref<SVGGElement>;
  holding: boolean;
};

// The drawn layer starts fully hidden (dash offset 1 on every line, each normalised to
// pathLength 1). This object is a module constant so React never rewrites the offset after
// mount; only the hold loop in AboutSovran changes it, through drawRef.
const DRAWN_STYLE: React.CSSProperties = { strokeDasharray: '1 1', strokeDashoffset: 1 };

// Line drawing of a house: ground, walls, roof, chimney, arched door, two windows with
// glazing bars and a round attic window.
function lines(drawn: boolean) {
  const len = drawn ? { pathLength: 1 } : {};
  return [
    <path key="ground" d="M4 56H60" {...len} />,
    <path key="wall-left" d="M12 56V28" {...len} />,
    <path key="wall-right" d="M52 56V28" {...len} />,
    <path key="roof" d="M7 32L32 11L57 32" {...len} />,
    <path key="chimney" d="M43 20.2V12H48V24.4" {...len} />,
    <path key="door" d="M27 56V44A5 5 0 0 1 37 44V56" {...len} />,
    <rect key="window-left" x="16" y="36" width="7" height="10" {...len} />,
    <rect key="window-right" x="41" y="36" width="7" height="10" {...len} />,
    <path key="bar-left" d="M19.5 36V46" {...len} />,
    <path key="bar-right" d="M44.5 36V46" {...len} />,
    <circle key="attic" cx="32" cy="22" r="3.2" {...len} />,
  ];
}

export default function HouseMark({ size, drawRef, holding }: HouseMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <g
        stroke="#C2B2A0"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: holding ? 0.28 : 0.7, transition: 'opacity 0.3s ease' }}
      >
        {lines(false)}
      </g>
      <g
        ref={drawRef}
        stroke="#C2B2A0"
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="round"
        style={DRAWN_STYLE}
      >
        {lines(true)}
      </g>
    </svg>
  );
}
