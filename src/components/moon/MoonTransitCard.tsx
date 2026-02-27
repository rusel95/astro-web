'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrentMoon } from '@/types/moon';
import { ZodiacSign } from '@/types/astrology';
import { ZODIAC_NAMES_UK } from '@/lib/constants';

interface MoonTransitCardProps {
  moon: CurrentMoon;
}

export function MoonTransitCard({ moon }: MoonTransitCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>🌙 Місяць зараз</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Знак</p>
            <p className="text-2xl font-bold">{ZODIAC_NAMES_UK[moon.sign]}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Фаза</p>
            <p className="text-lg">{formatPhase(moon.phase)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">У вашому чарті</p>
            <p className="text-lg">{moon.house} дім</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Освітлення</p>
            <p className="text-lg">{(moon.illumination * 100).toFixed(0)}%</p>
          </div>
        </div>
        
        {/* Персоналізована рекомендація */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            {getHouseRecommendation(moon.house, moon.sign)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function formatPhase(phase: CurrentMoon['phase']): string {
  const phases: Record<CurrentMoon['phase'], string> = {
    new_moon: '🌑 Новий Місяць',
    waxing_crescent: '🌒 Зростаючий серп',
    first_quarter: '🌓 Перша чверть',
    waxing_gibbous: '🌔 Зростаючий горб',
    full_moon: '🌕 Повний Місяць',
    waning_gibbous: '🌖 Спадний горб',
    last_quarter: '🌗 Остання чверть',
    waning_crescent: '🌘 Спадний серп',
  };
  return phases[phase] || phase;
}

function getHouseRecommendation(house: number, sign: ZodiacSign): string {
  const ukrainianSignName = ZODIAC_NAMES_UK[sign];
  const recommendations: Record<number, string> = {
    1: `Місяць у вашому 1 домі (${ukrainianSignName}) — час фокусуватись на собі, своєму іміджі та тілі.`,
    2: `Місяць у вашому 2 домі (${ukrainianSignName}) — увага на фінанси, цінності та матеріальну безпеку.`,
    3: `Місяць у вашому 3 домі (${ukrainianSignName}) — активна комунікація, навчання, короткі поїздки.`,
    4: `Місяць у вашому 4 домі (${ukrainianSignName}) — час для дому, родини, емоційної бази.`,
    5: `Місяць у вашому 5 домі (${ukrainianSignName}) — творчість, романтика, розваги та хобі.`,
    6: `Місяць у вашому 6 домі (${ukrainianSignName}) — здоров'я, рутина, робота та служіння.`,
    7: `Місяць у вашому 7 домі (${ukrainianSignName}) — фокус на стосунках, партнерствах та співпраці.`,
    8: `Місяць у вашому 8 домі (${ukrainianSignName}) — глибокі трансформації, інтимність, спільні ресурси.`,
    9: `Місяць у вашому 9 домі (${ukrainianSignName}) — подорожі, філософія, вища освіта та експансія.`,
    10: `Місяць у вашому 10 домі (${ukrainianSignName}) — кар'єра, публічний імідж та досягнення.`,
    11: `Місяць у вашому 11 домі (${ukrainianSignName}) — дружба, спільноти, мрії про майбутнє.`,
    12: `Місяць у вашому 12 домі (${ukrainianSignName}) — уединення, духовність, підсвідомість.`,
  };
  return recommendations[house] || `Місяць у ${house} домі (${ukrainianSignName}).`;
}
