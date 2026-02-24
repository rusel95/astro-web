import React from 'react';

interface PlanetIconProps {
  planet: string;
  size?: number;
  color?: string;
  className?: string;
}

// Custom SVG paths for each planet — clean, elegant line art
const PATHS: Record<string, string> = {
  // Sun ☉ — circle with dot
  Sun: 'M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0M12 12m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0',
  // Moon ☽ — crescent
  Moon: 'M18 12a8 8 0 0 1-12.4 6.7A8 8 0 0 1 5.6 5.3 8 8 0 0 0 18 12z',
  // Mercury ☿ — winged circle with cross
  Mercury: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 16v5M9 19h6M8 4.5l4 3 4-3',
  // Venus ♀ — circle with cross below
  Venus: 'M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 13v8M9 18h6',
  // Mars ♂ — circle with arrow
  Mars: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM17 3l4 0 0 4M21 3l-6 6',
  // Jupiter ♃ — stylized 4
  Jupiter: 'M8 3v18M4 13h12M16 3c0 5-4 10-8 10',
  // Saturn ♄ — cross with crescent
  Saturn: 'M6 3h8M10 3v18M10 11c5-1 8-4 8-8M7 17a4 4 0 0 0 7 0',
  // Uranus ♅ — circle with H-bar
  Uranus: 'M12 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12V4M8 4v6M16 4v6',
  // Neptune ♆ — trident
  Neptune: 'M12 3v18M5 8l7-5 7 5M5 8v3M19 8v3M12 8v-5',
  // Pluto ♇ — semicircle with cross
  Pluto: 'M8 8a6 4 0 0 1 8 0M12 8v12M8 16h8M12 4v4',
  // Nodes
  TrueNode: 'M6 18a6 6 0 0 1 6-6 6 6 0 0 1 6 6M12 12V6M9 9l3-3 3 3',
  SouthNode: 'M6 6a6 6 0 0 0 6 6 6 6 0 0 0 6-6M12 12v6M9 15l3 3 3-3',
  Lilith: 'M12 4a4 4 0 0 1 0 8M12 4a4 4 0 0 0 0 8M12 12v8M9 17h6',
};

export default function PlanetIcon({ planet, size = 20, color = 'currentColor', className }: PlanetIconProps) {
  const path = PATHS[planet];
  if (!path) return <span>{planet}</span>;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={planet}
    >
      <path d={path} />
    </svg>
  );
}
