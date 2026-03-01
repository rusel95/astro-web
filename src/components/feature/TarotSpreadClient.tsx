'use client';

import { useState, useCallback } from 'react';
import AnalysisSection from './AnalysisSection';

interface TarotCard {
  name?: string;
  name_uk?: string;
  suit?: string;
  arcana?: string;
  reversed?: boolean;
  image_url?: string;
  imageUrl?: string;
  meaning?: string;
  position?: string;
}

interface TarotSpreadClientProps {
  spreadType: string;
  title: string;
  description: string;
  drawLabel?: string;
}

export default function TarotSpreadClient({
  spreadType,
  title,
  description,
  drawLabel = 'Витягнути карти',
}: TarotSpreadClientProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ cards: TarotCard[]; report: unknown } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmRedraw, setConfirmRedraw] = useState(false);

  const drawCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    setConfirmRedraw(false);
    try {
      const res = await fetch('/api/tarot/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spread_type: spreadType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Помилка розкладу');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [spreadType]);

  const handleRedrawClick = () => {
    if (result) {
      setConfirmRedraw(true);
    } else {
      void drawCards();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">{title}</h1>
          <p className="text-white/50 text-sm sm:text-base">{description}</p>
        </div>

        {/* Draw button */}
        {!result && (
          <div className="flex justify-center">
            <button
              onClick={() => void drawCards()}
              disabled={loading}
              className="px-8 py-3 rounded-full text-white font-semibold text-sm transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)',
                boxShadow: '0 2px 14px rgba(108, 60, 225, 0.4)',
              }}
            >
              {loading ? 'Перемішуємо колоду...' : drawLabel}
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Cards */}
        {result && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {result.cards.map((card, idx) => {
                const imageUrl = card.image_url || card.imageUrl;
                const cardName = card.name_uk || card.name || `Карта ${idx + 1}`;
                return (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={cardName}
                        className={`w-full object-cover ${card.reversed ? 'rotate-180' : ''}`}
                        style={{ maxHeight: '180px' }}
                      />
                    ) : (
                      <div
                        className="w-full flex items-center justify-center p-4 text-center"
                        style={{ minHeight: '120px', background: 'rgba(108,60,225,0.15)' }}
                      >
                        <span className="text-zorya-violet text-2xl">✦</span>
                      </div>
                    )}
                    <div className="p-3 space-y-1">
                      {card.position && (
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">{card.position}</p>
                      )}
                      <p className="text-sm text-white font-medium">
                        {cardName}
                        {card.reversed && <span className="ml-1 text-zorya-gold text-xs">(перевернута)</span>}
                      </p>
                      {card.suit && <p className="text-xs text-white/40">{card.suit}</p>}
                      {card.meaning && <p className="text-xs text-white/50 line-clamp-2">{card.meaning}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Report */}
            {!!result.report && (
              <AnalysisSection title="Інтерпретація розкладу" data={result.report as Record<string, unknown>} />
            )}

            {/* Re-draw confirmation */}
            {confirmRedraw ? (
              <div className="p-4 rounded-xl border border-zorya-violet/30 text-center space-y-3"
                style={{ background: 'rgba(108,60,225,0.08)' }}>
                <p className="text-white/80 text-sm">Бажаєте витягнути нові карти?</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => void drawCards()}
                    className="px-5 py-2 rounded-full text-sm text-white font-medium"
                    style={{ background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)' }}
                  >
                    Так, новий розклад
                  </button>
                  <button
                    onClick={() => setConfirmRedraw(false)}
                    className="px-5 py-2 rounded-full text-sm text-white/60 border border-white/20"
                  >
                    Залишити
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={handleRedrawClick}
                  disabled={loading}
                  className="px-6 py-2 rounded-full text-sm text-white/60 border border-white/20 hover:border-zorya-violet/50 hover:text-white transition-all"
                >
                  Новий розклад
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
