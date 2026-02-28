'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="uk">
      <body style={{ background: '#08081a', color: '#fff', fontFamily: 'system-ui', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Щось пішло не так</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>Ми вже працюємо над вирішенням проблеми</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{ padding: '0.75rem 2rem', background: '#6C3CE1', color: '#fff', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Спробувати ще раз
            </button>
            <a
              href="/"
              style={{ padding: '0.75rem 2rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '9999px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
            >
              На головну
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
