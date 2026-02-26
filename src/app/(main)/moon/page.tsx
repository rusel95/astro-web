import { Suspense } from 'react';
import Link from 'next/link';
import { MoonCalendar } from '@/components/moon/MoonCalendar';
import { VoidPeriodAlert } from '@/components/moon/VoidPeriodAlert';
import { MoonTransitCard } from '@/components/moon/MoonTransitCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getMoonPosition, getMoonPhase, getZodiacSign } from '@/lib/moon/ephemeris';
import { isCurrentlyVoid, getNextVoidPeriod, findVoidPeriods } from '@/lib/moon/void-calculator';
import type { ZodiacSign } from '@/types/astrology';
import type { CurrentMoon, MoonPhaseType } from '@/types/moon';

export const runtime = 'nodejs';
export const revalidate = 900; // Revalidate every 15 minutes

function getCurrentMoon(): CurrentMoon {
  const now = new Date();
  const moonPos = getMoonPosition(now);
  const moonSign = getZodiacSign(moonPos.longitude) as ZodiacSign;
  const phase = getMoonPhase(now);
  const isVoid = isCurrentlyVoid(now);
  const nextVoid = getNextVoidPeriod(now);

  return {
    longitude: moonPos.longitude,
    sign: moonSign,
    house: 1,
    phase: phase.phase as MoonPhaseType,
    illumination: phase.illumination,
    is_void: isVoid,
    next_void: nextVoid ? {
      start: nextVoid.start.toISOString(),
      end: nextVoid.end.toISOString(),
      last_aspect: {
        planet: nextVoid.lastAspect.planet as any,
        type: nextVoid.lastAspect.type as any,
        time: nextVoid.lastAspect.time.toISOString(),
      },
      sign_ingress: {
        to_sign: nextVoid.nextSign as ZodiacSign,
        time: nextVoid.end.toISOString(),
      },
    } : undefined,
  };
}

function getPhases(days: number = 90) {
  const phases = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // Start 30 days in the past
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const moonPos = getMoonPosition(date);
    const phase = getMoonPhase(date);
    phases.push({
      date: date.toISOString().split('T')[0],
      phase: phase.phase as MoonPhaseType,
      illumination: Math.round(phase.illumination),
      zodiac_sign: getZodiacSign(moonPos.longitude) as ZodiacSign,
      degree: Math.round(moonPos.longitude % 30 * 10) / 10,
    });
  }
  return phases;
}

function getVoidPeriods(days: number = 30) {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + Math.min(days, 7));

  return findVoidPeriods(start, end).map((v) => ({
    start: v.start.toISOString(),
    end: v.end.toISOString(),
    last_aspect: {
      planet: v.lastAspect.planet as any,
      type: v.lastAspect.type as any,
      time: v.lastAspect.time.toISOString(),
    },
    sign_ingress: {
      to_sign: v.nextSign as ZodiacSign,
      time: v.end.toISOString(),
    },
    moon_sign: v.moonSign,
    duration_minutes: v.durationMinutes,
  }));
}

function getMoonData() {
  try {
    return {
      current: getCurrentMoon(),
      phases: getPhases(90),
      voidPeriods: getVoidPeriods(30),
    };
  } catch (error) {
    console.error('Error computing moon data:', error);
    return null;
  }
}

export default async function MoonPage() {
  const moonData = getMoonData();

  if (!moonData) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Не вдалося завантажити місячні дані. Спробуйте пізніше.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { current, phases, voidPeriods } = moonData;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">🌙 Місячний Календар</h1>
        <p className="text-muted-foreground">
          Фази Місяця, періоди бездіяльності та персональні рекомендації
        </p>
      </div>

      {/* Current Moon Position */}
      <MoonTransitCard moon={current} />

      {/* Void Warning if active */}
      {current.is_void && current.next_void && (
        <VoidPeriodAlert period={current.next_void} />
      )}

      {/* Calendar */}
      <Suspense fallback={<CalendarSkeleton />}>
        <MoonCalendar phases={phases} voidPeriods={voidPeriods} />
      </Suspense>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg space-y-2">
          <h3 className="font-semibold text-lg">📌 Що таке «Місяць без курсу»?</h3>
          <p className="text-sm text-muted-foreground">
            Місяць без курсу — це період коли Місяць не формує жодних важливих аспектів
            перед переходом у наступний знак зодіаку. В цей час не рекомендується:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Підписувати важливі договори</li>
            <li>Починати нові проєкти</li>
            <li>Приймати важливі життєві рішення</li>
            <li>Робити великі покупки</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Краще використати цей час для: відпочинку, медитації, завершення старих справ.
          </p>
        </div>

        <div className="p-6 border rounded-lg space-y-2">
          <h3 className="font-semibold text-lg">🌙 Фази Місяця</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>
              <strong>Новий Місяць 🌑:</strong> Час для нових намірів, початку проєктів
            </li>
            <li>
              <strong>Зростаючий Місяць 🌒🌓🌔:</strong> Розвиток, зростання, накопичення
            </li>
            <li>
              <strong>Повний Місяць 🌕:</strong> Кульмінація, завершення, відпускання
            </li>
            <li>
              <strong>Спадний Місяць 🌖🌗🌘:</strong> Очищення, рефлексія, підготовка
            </li>
          </ul>
        </div>
      </div>

      {/* Cross-sell CTA */}
      <Link href="/horoscope/calendar" className="block">
        <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
          <div className="flex items-center gap-3">
            <span className="text-xl">📅</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Персональний Місячний Календар</p>
              <p className="text-xs text-muted-foreground mt-0.5">Індивідуальний прогноз місячних транзитів для вашої натальної карти</p>
            </div>
            <span className="text-muted-foreground text-lg">→</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[400px] w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[150px]" />
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Місячний Календар | Зоря',
  description: 'Фази Місяця, періоди «Місяць без курсу» та персональні місячні транзити. Дізнайтеся коли краще починати справи і коли варто почекати.',
};
