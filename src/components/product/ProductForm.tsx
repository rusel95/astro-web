'use client';

import { useState, useEffect } from 'react';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  name: string;
  gender: 'male' | 'female' | '';
  birthDate: string;
  birthTime: string;
  city: string;
  email: string;
}

export default function ProductForm({ productSlug }: { productSlug: string }) {
  const [form, setForm] = useState<FormData>({
    name: '',
    gender: '',
    birthDate: '',
    birthTime: '',
    city: '',
    email: '',
  });
  const [tracked, setTracked] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  // Pre-fill from auth session + chart data, then quiz session as fallback
  useEffect(() => {
    async function prefillFromAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Get the user's most recent chart for birth data
          const { data: chart } = await supabase
            .from('charts')
            .select('name, birth_date, birth_time, city, gender')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const authData: Partial<FormData> = {
            email: user.email || '',
          };

          if (chart) {
            if (chart.name) authData.name = chart.name;
            if (chart.gender === 'male' || chart.gender === 'female') authData.gender = chart.gender;
            if (chart.birth_date) authData.birthDate = chart.birth_date;
            if (chart.birth_time) authData.birthTime = chart.birth_time;
            if (chart.city) authData.city = chart.city;
          }

          // Also check profile name as fallback
          if (!authData.name) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', user.id)
              .single();
            if (profile?.name) authData.name = profile.name;
          }

          setForm((prev) => ({ ...prev, ...authData }));
          setPrefilled(true);
          return;
        }
      } catch {
        // Auth not available, fall through to quiz data
      }

      // Fallback: pre-fill from quiz session storage
      try {
        const stored = sessionStorage.getItem('zorya_quiz_state');
        if (stored) {
          const quiz = JSON.parse(stored);
          setForm((prev) => ({
            ...prev,
            name: quiz.name || prev.name,
            gender: quiz.gender || prev.gender,
            birthDate:
              quiz.birthYear && quiz.birthMonth && quiz.birthDay
                ? `${quiz.birthYear}-${String(quiz.birthMonth).padStart(2, '0')}-${String(quiz.birthDay).padStart(2, '0')}`
                : prev.birthDate,
            birthTime: quiz.birthTime || prev.birthTime,
            city: quiz.city || prev.city,
            email: quiz.email || prev.email,
          }));
        }
      } catch {
        // ignore
      }
    }

    prefillFromAuth();
  }, []);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (!tracked) {
      track(ANALYTICS_EVENTS.PRODUCT_FORM_STARTED, { product_slug: productSlug });
      setTracked(true);
    }
  };

  const handleCtaClick = () => {
    track(ANALYTICS_EVENTS.PAYWALL_CTA_CLICKED, {
      product_slug: productSlug,
      action: 'product_form_submit',
    });
    // Navigate to chart creation with pre-filled data
    const params = new URLSearchParams();
    if (form.name) params.set('name', form.name);
    if (form.birthDate) params.set('birthDate', form.birthDate);
    if (form.birthTime) params.set('birthTime', form.birthTime);
    if (form.city) params.set('city', form.city);
    window.location.href = `/chart/new?${params.toString()}`;
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <h3 className="text-lg font-display font-semibold text-text-primary mb-6">
        Ваші дані для гороскопу
      </h3>
      {prefilled && (
        <p className="text-xs text-zorya-violet mb-4">
          ✦ Дані заповнені автоматично з вашого профілю
        </p>
      )}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">Ім&apos;я</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ваше ім'я"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] text-text-primary placeholder-text-muted focus:outline-none focus:border-zorya-violet/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">Стать</label>
            <select
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] text-text-primary focus:outline-none focus:border-zorya-violet/50 transition-colors appearance-none"
            >
              <option value="">Оберіть</option>
              <option value="female">Жіноча</option>
              <option value="male">Чоловіча</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">Дата народження</label>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] text-text-primary focus:outline-none focus:border-zorya-violet/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">Час народження</label>
            <input
              type="time"
              value={form.birthTime}
              onChange={(e) => handleChange('birthTime', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] text-text-primary focus:outline-none focus:border-zorya-violet/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">Місто народження</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Місто"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] text-text-primary placeholder-text-muted focus:outline-none focus:border-zorya-violet/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
              readOnly={prefilled && !!form.email}
              className={`w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] text-text-primary placeholder-text-muted focus:outline-none focus:border-zorya-violet/50 transition-colors ${prefilled && form.email ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>
      </div>

      <p className="text-text-muted text-xs mt-4">
        Дані використовуються виключно для розрахунку вашого персонального гороскопу.
      </p>

      {/* CTA Button */}
      <button
        onClick={handleCtaClick}
        className="mt-6 w-full py-3.5 bg-gradient-to-r from-zorya-violet to-zorya-blue text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
      >
        Продовжити
      </button>

    </div>
  );
}
