'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function DeleteAccountSection() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'ВИДАЛИТИ') {
      setError('Введіть "ВИДАЛИТИ" для підтвердження');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Помилка видалення акаунта');
      }

      // Sign out after deletion
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }

      router.push('/');
    } catch (e: any) {
      setError(e.message || 'Помилка видалення акаунта');
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-red-500/20 p-6" style={{ background: 'rgba(239,68,68,0.05)' }}>
      <h2 className="text-lg font-semibold text-white mb-1">Видалення акаунта</h2>
      <p className="text-sm text-white/50 mb-4">
        Видалення акаунта призводить до безповоротного видалення всіх ваших даних: карт, прогнозів та профілю. Цю дію неможливо скасувати.
      </p>

      {!showDialog ? (
        <button
          onClick={() => setShowDialog(true)}
          className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
        >
          Видалити акаунт
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-white/70">
            Введіть <span className="font-mono font-bold text-red-400">ВИДАЛИТИ</span> для підтвердження:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="ВИДАЛИТИ"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-red-500/30 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/60"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
            >
              {loading ? 'Видалення...' : 'Підтвердити видалення'}
            </button>
            <button
              onClick={() => { setShowDialog(false); setConfirmText(''); setError(null); }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/10 transition-colors"
            >
              Скасувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
