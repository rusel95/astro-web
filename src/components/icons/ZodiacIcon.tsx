import React from 'react';

type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

interface ZodiacIconProps {
  sign: ZodiacSign | string;
  size?: number;
  color?: string;
  className?: string;
}

// Custom SVG paths for each zodiac sign — thin elegant line art
const PATHS: Record<string, string> = {
  // Aries ♈ — ram horns
  Aries: 'M6 20c0-8 4-14 6-16s6 8 6 16M12 4v0',
  // Taurus ♉ — bull head with circle
  Taurus: 'M4 6c0-3 3.5-4 5-2s3.5 2 5-0c1.5-2 5-1 5 2M7 8a5 5 0 1 0 10 0a5 5 0 1 0-10 0',
  // Gemini ♊ — twins pillars
  Gemini: 'M4 4h16M4 20h16M8 4v16M16 4v16',
  // Cancer ♋ — crab claws (two 6/9 spirals)
  Cancer: 'M5 10a5 5 0 0 1 7-4a5 5 0 0 1 7 4M19 14a5 5 0 0 1-7 4a5 5 0 0 1-7-4',
  // Leo ♌ — lion's mane swirl
  Leo: 'M6 18a4 4 0 0 1 4-4a4 4 0 1 0-4-4c0-4 4-8 8-8s4 2 4 4-2 4-2 4',
  // Virgo ♍ — maiden with wheat ear
  Virgo: 'M4 4v12c0 4 4 4 4 0V4M12 4v12c0 4 4 4 4 0V4M20 4v16M16 12l4 4',
  // Libra ♎ — scales
  Libra: 'M4 18h16M12 18v-4M5 10a7 4 0 0 1 14 0M12 6V2',
  // Scorpio ♏ — scorpion tail with arrow
  Scorpio: 'M4 4v12c0 4 4 4 4 0V4M12 4v12c0 4 4 4 4 0V4M20 4v14l-3-3M20 18l3-3',
  // Sagittarius ♐ — arrow
  Sagittarius: 'M4 20L20 4M20 4h-8M20 4v8M8 12l4 4',
  // Capricorn ♑ — sea-goat
  Capricorn: 'M4 4v10c0 4 4 6 8 6h2c3 0 4-2 4-4v-2c0-2-2-4-4-2s-2 4 0 6c2 2 4 2 6 0',
  // Aquarius ♒ — waves
  Aquarius: 'M3 9l3-3 3 3 3-3 3 3 3-3M3 15l3-3 3 3 3-3 3 3 3-3',
  // Pisces ♓ — two fish
  Pisces: 'M5 4c4 3 4 5 4 8s0 5-4 8M19 4c-4 3-4 5-4 8s0 5 4 8M3 12h18',
};

export default function ZodiacIcon({ sign, size = 24, color = 'currentColor', className }: ZodiacIconProps) {
  const path = PATHS[sign];
  if (!path) return <span>{sign}</span>;

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
      aria-label={sign}
    >
      <path d={path} />
    </svg>
  );
}

export { PATHS as ZODIAC_SVG_PATHS };
export type { ZodiacSign as ZodiacSignType };
