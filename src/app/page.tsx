'use client';

import { motion } from 'framer-motion';
import { User, Briefcase, Heart, Activity, TrendingUp, Sparkles, Globe2, Star, Bot, Lock, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ChartsCounter from '@/components/ChartsCounter';

const ZODIAC_RING = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

const BIRTHDAY_CTA = {
  title: '🎂 Сьогодні ваш день народження?',
  subtitle: 'Отримайте персональний прогноз на наступний рік життя',
};

const PRODUCTS: { Icon: LucideIcon; title: string; bullets: string[] }[] = [
  {
    Icon: User,
    title: 'Особистість',
    bullets: ['Глибинний портрет характеру', 'Сильні та слабкі сторони', 'Ваша життєва місія'],
  },
  {
    Icon: Briefcase,
    title: 'Кар\'єра',
    bullets: ['Професійне покликання', 'Стиль роботи та лідерства', 'Найкращі галузі для вас'],
  },
  {
    Icon: Heart,
    title: 'Стосунки',
    bullets: ['Ваш стиль кохання', 'Ідеальний партнер', 'Ключі до гармонії в парі'],
  },
  {
    Icon: Activity,
    title: 'Здоров\'я',
    bullets: ['Вразливі зони організму', 'Емоційне благополуччя', 'Рекомендації до способу життя'],
  },
  {
    Icon: TrendingUp,
    title: 'Фінанси',
    bullets: ['Фінансові таланти', 'Стратегії заробітку', 'Інвестиційні схильності'],
  },
  {
    Icon: Sparkles,
    title: 'Духовність',
    bullets: ['Духовний шлях та карма', 'Вузли Місяця — місія душі', 'Медитативні практики'],
  },
];

const TESTIMONIALS = [
  { name: 'Олена К.', text: 'Дуже точний аналіз! Все про мою кар\'єру збіглося. Рекомендую кожному!', rating: 5 },
  { name: 'Андрій М.', text: 'Нарешті зрозумів, чому в стосунках постійно повторюються одні й ті ж ситуації. Дякую Зоря!', rating: 5 },
  { name: 'Марія Д.', text: 'Замовила аналіз фінансів — отримала конкретні поради. Вже застосовую!', rating: 5 },
  { name: 'Ігор В.', text: 'Скептично ставився, але результат вразив. Дуже глибоко та професійно.', rating: 4 },
];

const QUESTIONS = [
  'Що мене чекає у майбутньому?',
  'Коли зустріну кохання?',
  'Хто я насправді?',
  'Яке моє покликання?',
  'Чому мені не щастить?',
];

export default function Home() {
  return (
    <div className="bg-cosmic-900">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Deep gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0820] via-[#0e0b25] to-[#08081a]" />

        {/* Decorative orbs */}
        <div className="absolute top-[-180px] right-[-180px] w-[550px] h-[550px] rounded-full bg-zorya-purple/10 blur-[100px]" />
        <div className="absolute bottom-[-100px] left-[-120px] w-[420px] h-[420px] rounded-full bg-zorya-violet/8 blur-[90px]" />
        <div className="absolute top-[30%] left-[20%] w-[280px] h-[280px] rounded-full bg-zorya-gold/4 blur-[80px]" />

        {/* Animated zodiac ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] opacity-[0.08]"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          >
            {ZODIAC_RING.map((s, i) => {
              const angle = (i / 12) * 360;
              const rad = (angle * Math.PI) / 180;
              return (
                <span
                  key={i}
                  className="absolute font-display font-bold text-zorya-violet"
                  style={{
                    fontSize: '2rem',
                    left: `${50 + 46 * Math.cos(rad)}%`,
                    top:  `${50 + 46 * Math.sin(rad)}%`,
                    transform: 'translate(-50%,-50%)',
                  }}
                >
                  {s}
                </span>
              );
            })}
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-32 text-center">
          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="section-badge">
                <span>✦</span> Зоря — AI-астрологія нового покоління
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-text-primary leading-[1.08] mb-6 tracking-tight"
            >
              Ваша натальна карта{' '}
              <span className="block mt-1 bg-gradient-to-r from-zorya-violet via-zorya-gold to-zorya-purple bg-clip-text text-transparent">
                з AI-інтерпретацією
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-text-secondary text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-light"
            >
              Розкрийте таємниці своєї натури через астрономічно точні розрахунки
              та AI-аналіз вашої натальної карти
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
            >
              <motion.a
                href="/chart/new"
                className="btn-primary text-base px-10 inline-flex"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                ✦ Розрахувати карту безкоштовно
              </motion.a>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-text-muted"
            >
              <span className="flex items-center gap-1.5"><Clock size={14} strokeWidth={1.75} /> Менше 2 хвилин</span>
              <span className="text-zorya-purple/40">·</span>
              <span className="flex items-center gap-1.5"><Lock size={14} strokeWidth={1.75} /> Приватність гарантована</span>
              <span className="text-zorya-purple/40">·</span>
              <span className="flex items-center gap-1.5"><Bot size={14} strokeWidth={1.75} /> Професійний AI</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <hr className="divider-cosmic mx-8 md:mx-auto md:max-w-4xl" />

      {/* ===== BIRTHDAY CTA ===== */}
      <section className="py-8 bg-cosmic-900">
        <div className="max-w-4xl mx-auto px-4">
          <motion.a
            href="/chart/new"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="block glass-card p-5 border border-zorya-gold/30 bg-gradient-to-r from-zorya-gold/5 to-zorya-purple/5 hover:from-zorya-gold/10 hover:to-zorya-purple/10 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zorya-gold/20 flex items-center justify-center text-2xl">
                  🎂
                </div>
                <div>
                  <p className="text-zorya-gold font-semibold text-lg">{BIRTHDAY_CTA.title}</p>
                  <p className="text-text-secondary text-sm">{BIRTHDAY_CTA.subtitle}</p>
                </div>
              </div>
              <div className="text-zorya-gold group-hover:translate-x-1 transition-transform">→</div>
            </div>
          </motion.a>
        </div>
      </section>

      {/* ===== QUESTIONS SECTION ===== */}
      <section className="py-16 md:py-24 bg-cosmic-800">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-primary mb-3">
              Вас щось турбує і ви запитуєте:
            </h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {QUESTIONS.map((q, i) => (
              <motion.div
                key={q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="glass-card px-5 py-3 text-sm md:text-base font-medium text-text-primary"
              >
                {q}
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center text-text-secondary mt-8 text-lg font-light"
          >
            Відповіді записані у вашій натальній карті — і{' '}
            <strong className="text-zorya-violet font-semibold">Зоря</strong> допоможе їх прочитати.
          </motion.p>
        </div>
      </section>

      {/* ===== HOW WE KNOW ===== */}
      <section className="py-16 md:py-24 bg-cosmic-900">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="section-badge mb-5 inline-flex">Наш підхід</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-text-primary mt-4">
              Як ми це знаємо?
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto mt-3 font-light">
              Поєднання тисячолітньої мудрості та сучасних технологій
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                Icon: Globe2,
                title: 'Астрономічна точність',
                desc: 'Розрахунки на основі реальних позицій планет з точністю до секунди дуги. Використовуємо Swiss Ephemeris — золотий стандарт астрономічних обчислень.',
              },
              {
                Icon: Star,
                title: 'База знань',
                desc: 'AI навчений на класичних та сучасних астрологічних текстах. Кожна інтерпретація базується на авторитетних джерелах.',
              },
              {
                Icon: Bot,
                title: 'AI інтерпретація',
                desc: 'Штучний інтелект аналізує всі елементи вашої карти разом — планети, доми, аспекти — для цілісного, персоналізованого аналізу.',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-7 text-center group"
              >
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-zorya-purple/10 border border-zorya-purple/20 flex items-center justify-center group-hover:bg-zorya-purple/20 transition-colors">
                    <f.Icon size={26} strokeWidth={1.25} className="text-zorya-violet" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCT GRID ===== */}
      <section className="py-16 md:py-24 bg-cosmic-800">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="section-badge mb-5 inline-flex">Сфери аналізу</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-text-primary mt-4">
              Оберіть сферу для аналізу
            </h2>
            <p className="text-text-secondary text-lg mt-3 font-light">
              Кожна сфера — глибокий персоналізований звіт на основі вашої натальної карти
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p, i) => (
              <motion.a
                key={p.title}
                href="/chart/new"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card p-6 group cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center mb-4 group-hover:bg-zorya-purple/15 group-hover:border-zorya-purple/25 transition-all">
                  <p.Icon size={22} strokeWidth={1.5} className="text-zorya-violet group-hover:text-zorya-gold transition-colors" />
                </div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-3 group-hover:text-zorya-violet transition-colors">
                  {p.title}
                </h3>
                <ul className="space-y-2">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-zorya-violet mt-0.5 flex-shrink-0">✦</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOOK OF LIFE ===== */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Rich gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#1a0a2e] to-[#0e0b25]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zorya-purple/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zorya-purple/40 to-transparent" />
        {/* Decorative orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-zorya-purple/8 blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-8">
              Кожна натальна карта —<br />
              <span className="text-zorya-gold">книга вашого життя</span>
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:gap-8 mb-10 max-w-2xl mx-auto">
              {[
                { value: '6',    label: 'сфер аналізу' },
                { value: '10+',  label: 'сторінок звіту' },
                { value: 'AI',   label: 'персоналізація' },
              ].map(({ value, label }) => (
                <div key={label} className="glass-card p-4 md:p-6">
                  <div className="font-display text-3xl md:text-4xl font-bold text-zorya-gold">{value}</div>
                  <div className="text-white/60 text-xs md:text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Персоналізований аналіз кожної планети, аспекту та дому у вашій натальній карті.{' '}
              Конкретні рекомендації, а не загальні фрази.
            </p>
            <motion.a
              href="/chart/new"
              className="inline-flex items-center gap-2 px-10 py-4 text-white font-semibold text-base rounded-full transition-colors border border-white/20 bg-white/8 hover:bg-white/15"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              ✦ Отримати свою карту
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 md:py-24 bg-cosmic-900">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="section-badge mb-5 inline-flex">Відгуки</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-text-primary mt-4">
              Що кажуть наші користувачі
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-zorya-gold text-lg">★</span>
                  ))}
                  {Array.from({ length: 5 - t.rating }).map((_, j) => (
                    <span key={j} className="text-white/15 text-lg">★</span>
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="text-text-primary font-semibold text-sm">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-14 md:py-20 bg-cosmic-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.4 }}
              className="glass-card p-5"
            >
              <ChartsCounter />
              <div className="text-text-muted text-xs mt-1.5">карт розраховано</div>
            </motion.div>
            {[
              { value: '97%',  label: 'задоволених' },
              { value: '6',    label: 'сфер аналізу' },
              { value: '2 хв', label: 'на розрахунок' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i + 1) * 0.1, duration: 0.4 }}
                className="glass-card p-5"
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-zorya-violet">{s.value}</div>
                <div className="text-text-muted text-xs mt-1.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 md:py-28 bg-cosmic-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-text-primary mb-5 leading-tight">
              Готові дізнатися більше про себе?
            </h2>
            <p className="text-text-secondary text-lg mb-10 font-light">
              Розрахунок натальної карти займає менше 2 хвилин. Спробуйте прямо зараз!
            </p>
            <motion.a
              href="/chart/new"
              className="btn-primary px-12 text-base inline-flex"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              ✦ Розрахувати карту безкоштовно
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
