import { Suspense } from 'react';
import { MoonCalendar } from '@/components/moon/MoonCalendar';
import { VoidPeriodAlert } from '@/components/moon/VoidPeriodAlert';
import { MoonTransitCard } from '@/components/moon/MoonTransitCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const runtime = 'edge';
export const revalidate = 900; // Revalidate every 15 minutes

async function getMoonData() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    || process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`
    || 'http://localhost:3000';

  try {
    const [currentRes, phasesRes, voidRes] = await Promise.all([
      fetch(`${baseUrl}/api/moon/current`, { next: { revalidate: 900 } }),
      fetch(`${baseUrl}/api/moon/phases`, { next: { revalidate: 86400 } }),
      fetch(`${baseUrl}/api/moon/void-of-course`, { next: { revalidate: 3600 } }),
    ]);

    if (!currentRes.ok) {
      throw new Error('Failed to fetch current moon data');
    }

    const currentData = await currentRes.json();

    const phasesData = phasesRes.ok ? await phasesRes.json() : { phases: [] };
    const voidData = voidRes.ok ? await voidRes.json() : { void_periods: [] };

    return {
      current: currentData.current,
      phases: phasesData.phases || [],
      voidPeriods: voidData.void_periods || [],
    };
  } catch (error) {
    console.error('Error fetching moon data:', error);
    return null;
  }
}

export default async function MoonPage() {
  const moonData = await getMoonData();

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
          Фази Місяця, Void of Course періоди та персональні рекомендації
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
          <h3 className="font-semibold text-lg">📌 Що таке Void of Course?</h3>
          <p className="text-sm text-muted-foreground">
            Void of Course (VoC) — це період коли Місяць не формує жодних major аспектів 
            перед переходом в наступний знак. Під час VoC не рекомендується:
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
  description: 'Фази Місяця, Void of Course періоди та персональні місячні транзити. Дізнайтеся коли краще починати справи і коли варто почекати.',
};
