'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MoonPhase } from '@/types/moon';
import { ZODIAC_NAMES_UK } from '@/lib/constants';
import { ZodiacSign } from '@/types/astrology';

interface MoonPhaseCardProps {
  phase: MoonPhase;
}

export function MoonPhaseCard({ phase }: MoonPhaseCardProps) {
  const phaseIcon = getPhaseIcon(phase.phase);
  const phaseName = getPhaseName(phase.phase);
  const date = new Date(phase.date).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-4xl mb-2">{phaseIcon}</div>
          <h3 className="font-semibold mb-1">{phaseName}</h3>
          <p className="text-sm text-muted-foreground mb-2">{date}</p>
          <p className="text-sm">
            {ZODIAC_NAMES_UK[phase.zodiac_sign as ZodiacSign] || phase.zodiac_sign} {Math.floor(phase.degree)}°
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getPhaseIcon(phase: MoonPhase['phase']): string {
  const icons: Record<MoonPhase['phase'], string> = {
    new_moon: '🌑',
    waxing_crescent: '🌒',
    first_quarter: '🌓',
    waxing_gibbous: '🌔',
    full_moon: '🌕',
    waning_gibbous: '🌖',
    last_quarter: '🌗',
    waning_crescent: '🌘',
  };
  return icons[phase] || '🌙';
}

function getPhaseName(phase: MoonPhase['phase']): string {
  const names: Record<MoonPhase['phase'], string> = {
    new_moon: 'Новий Місяць',
    waxing_crescent: 'Зростаючий серп',
    first_quarter: 'Перша чверть',
    waxing_gibbous: 'Зростаючий горб',
    full_moon: 'Повний Місяць',
    waning_gibbous: 'Спадний горб',
    last_quarter: 'Остання чверть',
    waning_crescent: 'Спадний серп',
  };
  return names[phase] || phase;
}
