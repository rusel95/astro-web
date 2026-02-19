'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Gift, Cake } from 'lucide-react';

const BG = 'linear-gradient(to bottom, #0f0a1e, #1a0e35)';
const BTN_GRAD = 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)';

function isBirthdayToday(birthDate: string): boolean {
  const birth = new Date(birthDate);
  const today = new Date();
  return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
}

function isBirthdaySoon(birthDate: string): { isSoon: boolean; daysUntil: number } {
  const birth = new Date(birthDate);
  const today = new Date();
  const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return { isSoon: daysUntil <= 14 && daysUntil > 0, daysUntil };
}

interface Chart {
  id: string;
  name: string;
  birth_date: string;
  city: string;
  country_code: string;
  gender: string;
  created_at: string;
}

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface Props {
  user: User;
  charts: Chart[];
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default function DashboardClient({ user, charts }: Props) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const displayName = user.user_metadata?.full_name ?? user.email ?? 'Користувач';
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: BG }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white"
                style={{ background: BTN_GRAD }}
              >
                {initials}
              </div>
            )}
            <div>
              <p className="font-semibold text-white">{displayName}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            {signingOut ? 'Вихід...' : 'Вийти'}
          </button>
        </div>

        {/* Page title */}
        <h1 className="text-3xl font-bold text-white mb-2">Мої карти</h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Збережені натальні карти вашого акаунту
        </p>

        {/* New chart button */}
        <a
          href="/chart/new"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-semibold text-white mb-8 transition-all hover:opacity-90"
          style={{ background: BTN_GRAD, boxShadow: '0 4px 24px rgba(108,60,225,0.4)' }}
        >
          <span className="text-xl">✦</span>
          Нова карта
        </a>

        {/* Charts list */}
        {charts.length === 0 ? (
          <div
            className="rounded-3xl p-12 text-center"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px dashed rgba(255,255,255,0.12)',
            }}
          >
            <div className="text-5xl mb-4">🌌</div>
            <p className="text-white font-semibold text-lg mb-2">Карт ще немає</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Розрахуйте вашу першу натальну карту — і вона з&apos;явиться тут
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {charts.map((chart) => {
              const isToday = isBirthdayToday(chart.birth_date);
              const { isSoon, daysUntil } = isBirthdaySoon(chart.birth_date);
              
              return (
                <a
                  key={chart.id}
                  href={`/chart/${chart.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl transition-all hover:bg-white/5 group"
                  style={{
                    background: isToday ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.04)',
                    border: isToday ? '2px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: isToday ? 'rgba(212,175,55,0.2)' : 'rgba(108,60,225,0.2)', 
                        border: isToday ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(108,60,225,0.3)' 
                      }}
                    >
                      {isToday ? (
                        <Cake size={20} className="text-yellow-400" />
                      ) : (
                        <span className="text-lg">{chart.gender === 'female' ? '♀' : '♂'}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {chart.name}
                        </p>
                        {isToday && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                            🎂 ДН!
                          </span>
                        )}
                        {!isToday && isSoon && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                            🎁 {daysUntil} дн.
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {formatDate(chart.birth_date)} · {chart.city}, {chart.country_code}
                      </p>
                    </div>
                  </div>
                  <div className="text-white/30 group-hover:text-white/60 transition-colors">→</div>
                </a>
              );
            })}
          </div>
        )}

        {/* Back link */}
        <p className="text-center mt-10 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <a href="/" className="hover:text-white/50 transition-colors">← На головну</a>
        </p>
      </div>
    </div>
  );
}
