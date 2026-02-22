'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { MoonPhase, VoidPeriod } from '@/types/moon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoonPhaseCard } from './MoonPhaseCard';

interface MoonCalendarProps {
  phases: MoonPhase[];
  voidPeriods: VoidPeriod[];
}

export function MoonCalendar({ phases, voidPeriods }: MoonCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const newMoonDates = phases
    .filter(p => p.phase === 'new_moon')
    .map(p => new Date(p.date));
  
  const fullMoonDates = phases
    .filter(p => p.phase === 'full_moon')
    .map(p => new Date(p.date));
  
  const voidDates = voidPeriods
    .map(v => new Date(v.start));

  const majorPhases = phases.filter(p => 
    p.phase === 'new_moon' || p.phase === 'full_moon' || 
    p.phase === 'first_quarter' || p.phase === 'last_quarter'
  );

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
            
            {/* Legend */}
            <div className="space-y-4">
              <h3 className="font-semibold">Легенда</h3>
              <div className="space-y-3">
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

              <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
                <h4 className="font-semibold mb-2">Підказки:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>🌑 Новий Місяць — час для намірів</li>
                  <li>🌕 Повний Місяць — завершення справ</li>
                  <li>⚠️ Void — відкласти важливі рішення</li>
                </ul>
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
            {majorPhases.slice(0, 4).map((phase, idx) => (
              <MoonPhaseCard key={idx} phase={phase} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
