'use client';

import { useEffect, useState } from 'react';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';

interface TarotCard {
  name?: string;
  name_uk?: string;
  suit?: string;
  reversed?: boolean;
  image_url?: string;
  imageUrl?: string;
  meaning?: string;
}

const SPREADS = [
  { href: '/tarot/single', label: 'Одна карта', description: 'Відповідь на одне запитання', icon: '✦' },
  { href: '/tarot/three-card', label: 'Три карти', description: 'Минуле · Теперішнє · Майбутнє', icon: '✦✦✦' },
  { href: '/tarot/celtic-cross', label: 'Кельтський хрест', description: '10 карт · Глибокий аналіз ситуації', icon: '✤' },
  { href: '/tarot/houses', label: 'Гороскопний розклад', description: '12 карт · 12 сфер життя', icon: '⊙' },
  { href: '/tarot/tree-of-life', label: 'Дерево Сефіротів', description: 'Каббалістичний розклад', icon: '🌳' },
  { href: '/tarot/birth-cards', label: 'Карти народження', description: 'Карта особистості та душі', icon: '★' },
  { href: '/tarot/synastry', label: 'Синастрійне таро', description: 'Розклад для пари', icon: '♥' },
  { href: '/tarot/transit', label: 'Транзитне таро', description: 'Поєднання астрології та таро', icon: '◎' },
];

export default function TarotHubClient() {
  const [dailyCard, setDailyCard] = useState<{ dailyCard?: TarotCard } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tarot/daily')
      .then(r => r.json())
      .then(data => setDailyCard(data))
      .catch(() => setDailyCard(null))
      .finally(() => setLoading(false));
  }, []);

  const card = dailyCard?.dailyCard;
  const imageUrl = (card as any)?.image_url || (card as any)?.imageUrl;
  const cardName = (card as any)?.name_uk || (card as any)?.name;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white">Таро</h1>
          <p className="text-white/50 text-sm sm:text-base">
            Карткові розклади, щоденна карта та містичні інсайти
          </p>
        </div>

        {/* Daily card */}
        <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <h2 className="text-lg font-semibold text-white mb-4">Карта дня</h2>
          {loading ? (
            <div className="h-24 flex items-center justify-center text-white/30 text-sm">Завантаження...</div>
          ) : card ? (
            <div className="flex gap-4 items-start">
              {imageUrl ? (
                <img src={imageUrl} alt={cardName || 'Карта дня'} className="w-20 rounded-lg object-cover" />
              ) : (
                <div className="w-20 h-28 rounded-lg flex items-center justify-center text-zorya-violet text-3xl"
                  style={{ background: 'rgba(108,60,225,0.15)' }}>
                  ✦
                </div>
              )}
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-white text-base">{cardName || 'Невідома карта'}</p>
                {(card as any)?.suit && <p className="text-xs text-white/40">{(card as any).suit}</p>}
                {(card as any)?.meaning && (
                  <p className="text-sm text-white/60">{(card as any).meaning}</p>
                )}
                {!!(card as any)?.interpretation && (
                  <SectionCard title="Інтерпретація" defaultCollapsed>
                    <ReportRenderer content={(card as any).interpretation} />
                  </SectionCard>
                )}
              </div>
            </div>
          ) : (
            <div className="text-white/30 text-sm text-center py-4">Карта дня недоступна</div>
          )}
        </div>

        {/* Spreads grid */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Розклади</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SPREADS.map(spread => (
              <a
                key={spread.href}
                href={spread.href}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] hover:border-zorya-violet/40 transition-all group"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <span className="text-2xl text-zorya-violet w-8 text-center">{spread.icon}</span>
                <div>
                  <p className="font-medium text-white group-hover:text-zorya-violet transition-colors">{spread.label}</p>
                  <p className="text-xs text-white/40">{spread.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Introduction */}
        <div className="rounded-2xl border border-white/[0.06] p-6 space-y-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h2 className="text-base font-semibold text-white/80">Що таке Таро?</h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Таро — це система з 78 карт, що використовується для інтроспекції, прийняття рішень та розуміння архетипових сил.
            Великий Аркан (22 карти) відображає великі життєві теми, Малий Аркан (56 карт) — повсякденні ситуації.
          </p>
          <p className="text-sm text-white/50 leading-relaxed">
            Карти не передбачають майбутнє з точністю — вони допомагають краще зрозуміти поточний момент
            та можливі тенденції розвитку подій.
          </p>
        </div>
      </div>
    </div>
  );
}
