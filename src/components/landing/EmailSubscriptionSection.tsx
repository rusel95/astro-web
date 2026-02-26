'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

export default function EmailSubscriptionSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('Дякуємо! Ви підписані на оновлення.');
        track(ANALYTICS_EVENTS.EMAIL_SUBSCRIPTION_SUBMITTED, { source: 'landing' });
        setEmail('');
        setName('');
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.error || 'Щось пішло не так');
      }
    } catch {
      setStatus('error');
      setMessage('Помилка з\'єднання. Спробуйте пізніше.');
    }
  };

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Астрологічні оновлення на пошту
        </h2>
        <p className="text-text-secondary mb-8">
          Отримуйте щотижневі астрологічні прогнози, поради та цікаві факти
        </p>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8"
          >
            <div className="text-4xl mb-4">✉️</div>
            <p className="text-text-primary font-medium">{message}</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше ім'я"
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] text-text-primary placeholder-text-muted focus:outline-none focus:border-zorya-violet/50 transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] text-text-primary placeholder-text-muted focus:outline-none focus:border-zorya-violet/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full"
            >
              {status === 'loading' ? 'Підписуємо...' : 'Підписатися'}
            </button>
            {status === 'error' && (
              <p className="text-red-400 text-sm mt-3">{message}</p>
            )}
            <p className="text-text-muted text-xs mt-3">
              Без спаму. Відписатись можна в будь-який момент.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
