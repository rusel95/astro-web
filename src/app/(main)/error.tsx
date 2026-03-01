'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-2xl font-display font-bold text-white">Щось пішло не так</h2>
        <p className="text-white/50 text-sm">Ми вже отримали сповіщення про помилку та працюємо над її виправленням.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-zorya-violet/80 hover:bg-zorya-violet text-white text-sm font-medium transition-colors"
          >
            Спробувати ще раз
          </button>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
          >
            На головну
          </a>
        </div>
      </div>
    </div>
  );
}
