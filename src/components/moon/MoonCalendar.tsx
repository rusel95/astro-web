'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { MoonPhase, VoidPeriod } from '@/types/moon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoonPhaseCard } from './MoonPhaseCard';

// Parse "YYYY-MM-DD" as local date (not UTC) to avoid timezone shift
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Format Date as "YYYY-MM-DD" using local timezone
function formatLocalDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

interface MoonCalendarProps {
  phases: MoonPhase[];
  voidPeriods: VoidPeriod[];
}

export function MoonCalendar({ phases, voidPeriods }: MoonCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const newMoonDates = phases
    .filter(p => p.phase === 'new_moon')
    .map(p => parseLocalDate(p.date));

  const fullMoonDates = phases
    .filter(p => p.phase === 'full_moon')
    .map(p => parseLocalDate(p.date));

  const voidDates = voidPeriods
    .map(v => parseLocalDate(v.start.split('T')[0]));

  // Deduplicate major phases: only keep first day of each phase transition
  const upcomingPhases: MoonPhase[] = [];
  const majorTypes = ['new_moon', 'first_quarter', 'full_moon', 'last_quarter'];
  let lastPhase = '';
  for (const p of phases) {
    if (majorTypes.includes(p.phase) && p.phase !== lastPhase) {
      upcomingPhases.push(p);
    }
    lastPhase = p.phase;
  }

  // Find phase data for selected date (use local timezone to match server dates)
  const selectedDateStr = selectedDate ? formatLocalDate(selectedDate) : undefined;
  const selectedPhase = phases.find(p => p.date === selectedDateStr);

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Місячний Календар</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  newMoon: newMoonDates,
                  fullMoon: fullMoonDates,
                  voidPeriod: voidDates,
                }}
                modifiersStyles={{
                  newMoon: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    fontWeight: 'bold',
                  },
                  fullMoon: {
                    backgroundColor: 'hsl(var(--warning))',
                    color: 'hsl(var(--warning-foreground))',
                    fontWeight: 'bold',
                  },
                  voidPeriod: {
                    border: '2px dashed hsl(var(--destructive))',
                  },
                }}
                className="rounded-md border"
              />
            </div>

            {/* Selected date info + Legend */}
            <div className="space-y-4">
              {selectedPhase ? (
                <div className="p-4 rounded-lg border space-y-2">
                  <h3 className="font-semibold">
                    {parseLocalDate(selectedPhase.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}
                  </h3>
                  <MoonPhaseCard phase={selectedPhase} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Оберіть дату щоб побачити деталі</p>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold">Легенда</h3>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                    🌑
                  </div>
                  <span className="text-sm">Новий Місяць — початок циклу</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-xs">
                    🌕
                  </div>
                  <span className="text-sm">Повний Місяць — кульмінація</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-2 border-destructive border-dashed rounded-full flex items-center justify-center text-xs">
                    ⚠️
                  </div>
                  <span className="text-sm text-destructive">
                    Void of Course — не починати важливе
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Major Phases */}
      <Card>
        <CardHeader>
          <CardTitle>Найближчі фази</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingPhases.slice(0, 4).map((phase, idx) => (
              <MoonPhaseCard key={idx} phase={phase} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
