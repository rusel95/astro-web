'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { VoidPeriod } from '@/types/moon';

interface VoidPeriodAlertProps {
  period: VoidPeriod;
}

export function VoidPeriodAlert({ period }: VoidPeriodAlertProps) {
  const endTime = new Date(period.end).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Місяць зараз Void of Course</strong> до {endTime}
        <br />
        <span className="text-sm">
          Не рекомендується: підписувати договори, починати нові справи, приймати важливі рішення.
        </span>
      </AlertDescription>
    </Alert>
  );
}
