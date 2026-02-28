'use client';

import { useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import DeleteAccountSection from '@/components/settings/DeleteAccountSection';

export default function SettingsClient() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email ?? null);
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Налаштування акаунта</h1>
        {email && <p className="text-white/50 mt-1 text-sm">{email}</p>}
      </div>

      <DeleteAccountSection />
    </div>
  );
}
