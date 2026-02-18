'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface User {
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface Props {
  user: User | null;
}

export default function AuthNav({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
      router.push('/');
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <a
        href="/auth/login"
        className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80"
        style={{
          border: '1px solid rgba(108,60,225,0.5)',
          color: '#9966E6',
        }}
      >
        Увійти
      </a>
    );
  }

  const displayName = user.user_metadata?.full_name ?? user.email ?? '';
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)' }}
          >
            {initials}
          </div>
        )}
        <span className="text-sm font-medium text-white/80 hidden sm:block max-w-[100px] truncate">
          {displayName}
        </span>
      </a>
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
        style={{
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        {loading ? '...' : 'Вийти'}
      </button>
    </div>
  );
}
