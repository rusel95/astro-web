'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';

const BG = 'linear-gradient(to bottom, #0f0a1e, #1a0e35)';
const BTN_GRAD = 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const err = searchParams.get('error');
    if (err === 'auth_callback_failed') {
      setError('Помилка авторизації. Спробуйте ще раз.');
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    if (!configured) return;
    setGoogleLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка входу через Google');
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured || !email || !password) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const supabase = createClient();
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          },
        });
        if (error) throw error;
        setSuccess('Перевірте пошту та підтвердіть реєстрацію ✦');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка авторизації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: BG }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 text-3xl"
          style={{ background: 'rgba(108,60,225,0.25)', border: '1px solid rgba(108,60,225,0.4)' }}
        >
          ✦
        </div>
        <h1 className="text-3xl font-bold" style={{ color: '#d4af37' }}>Зоря</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Натальна карта з AI-інтерпретацією
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl p-7 space-y-5"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(108,60,225,0.25)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <h2 className="text-xl font-bold text-center text-white">
          {mode === 'login' ? 'Увійти в акаунт' : 'Створити акаунт'}
        </h2>

        {!configured && (
          <div
            className="rounded-xl px-4 py-3 text-sm text-center"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37' }}
          >
            ⚠️ Supabase ще не налаштовано.<br />
            Авторизація тимчасово недоступна.
          </div>
        )}

        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm text-center"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="rounded-xl px-4 py-3 text-sm text-center"
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}
          >
            {success}
          </div>
        )}

        {/* Google OAuth button */}
        <button
          onClick={handleGoogleLogin}
          disabled={!configured || googleLoading}
          className="w-full py-3 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all"
          style={{
            background: configured ? BTN_GRAD : 'rgba(255,255,255,0.06)',
            opacity: configured ? 1 : 0.5,
            cursor: configured ? 'pointer' : 'not-allowed',
            boxShadow: configured ? '0 4px 20px rgba(108,60,225,0.4)' : 'none',
          }}
        >
          {googleLoading ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="rgba(255,255,255,0.8)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="rgba(255,255,255,0.6)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="rgba(255,255,255,0.9)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {googleLoading ? 'Зачекайте...' : 'Увійти через Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>або</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Електронна пошта
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={!configured}
              className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={!configured}
              className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!configured || loading || !email || !password}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: configured && email && password ? 'rgba(108,60,225,0.6)' : 'rgba(255,255,255,0.05)',
              color: configured && email && password ? '#fff' : 'rgba(255,255,255,0.3)',
              border: '1px solid rgba(108,60,225,0.3)',
              cursor: configured && email && password ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Зачекайте...' : (mode === 'login' ? 'Увійти' : 'Зареєструватися')}
          </button>
        </form>

        {/* Toggle mode */}
        <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {mode === 'login' ? 'Немає акаунту? ' : 'Вже є акаунт? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
            className="font-semibold hover:underline transition-colors"
            style={{ color: '#d4af37' }}
          >
            {mode === 'login' ? 'Створити' : 'Увійти'}
          </button>
        </p>

        {/* Back to home */}
        <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <a href="/" className="hover:text-white/50 transition-colors">← Повернутись на головну</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #0f0a1e, #1a0e35)' }}>
        <div className="text-white/40">Завантаження...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
