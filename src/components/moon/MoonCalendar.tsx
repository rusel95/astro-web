'use client';

import { useState, useCallback, useRef } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { MoonPhase, VoidPeriod } from '@/types/moon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoonPhaseCard } from './MoonPhaseCard';
import { Loader2 } from 'lucide-react';

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

export function MoonCalendar({ phases: initialPhases, voidPeriods }: MoonCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [allPhases, setAllPhases] = useState<MoonPhase[]>(initialPhases);
  const [loading, setLoading] = useState(false);
  const fetchedMonths = useRef<Set<string>>(new Set());

  // Track which months we already have data for
  if (fetchedMonths.current.size === 0 && initialPhases.length > 0) {
    for (const p of initialPhases) {
      fetchedMonths.current.add(p.date.slice(0, 7)); // "YYYY-MM"
    }
  }

  const fetchMonthPhases = useCallback(async (month: Date) => {
    const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    if (fetchedMonths.current.has(monthKey)) return;

    fetchedMonths.current.add(monthKey);
    setLoading(true);
    try {
      const startDate = `${monthKey}-01`;
      const res = await fetch(`/api/moon/phases?start=${startDate}&days=31`);
      if (res.ok) {
        const data = await res.json();
        if (data.phases?.length) {
          setAllPhases(prev => {
            const existingDates = new Set(prev.map(p => p.date));
            const newPhases = data.phases.filter((p: MoonPhase) => !existingDates.has(p.date));
            return [...prev, ...newPhases].sort((a, b) => a.date.localeCompare(b.date));
          });
        }
      }
    } catch {
      fetchedMonths.current.delete(monthKey);
    } finally {
      setLoading(false);
    }
  }, []);

  const newMoonDates = allPhases
    .filter(p => p.phase === 'new_moon')
    .map(p => parseLocalDate(p.date));

  const fullMoonDates = allPhases
    .filter(p => p.phase === 'full_moon')
    .map(p => parseLocalDate(p.date));

  const voidDates = voidPeriods
    .map(v => parseLocalDate(v.start.split('T')[0]));

  // Deduplicate major phases: only keep first day of each phase transition, future only
  const todayStr = formatLocalDate(new Date());
  const upcomingPhases: MoonPhase[] = [];
  const majorTypes = ['new_moon', 'first_quarter', 'full_moon', 'last_quarter'];
  let lastPhase = '';
  for (const p of allPhases) {
    if (majorTypes.includes(p.phase) && p.phase !== lastPhase && p.date >= todayStr) {
      upcomingPhases.push(p);
    }
    lastPhase = p.phase;
  }

  // Find phase data for selected date (use local timezone to match server dates)
  const selectedDateStr = selectedDate ? formatLocalDate(selectedDate) : undefined;
  const selectedPhase = allPhases.find(p => p.date === selectedDateStr);

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Місячний Календар
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                onMonthChange={fetchMonthPhases}
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
              {loading && !selectedPhase ? (
                <div className="p-4 rounded-lg border flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Завантаження...</span>
                </div>
              ) : selectedPhase ? (
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
                    Місяць без курсу — не починати важливе
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
