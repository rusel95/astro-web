'use client';

import { motion } from 'framer-motion';
import { User, Briefcase, Heart, Activity, TrendingUp, Sparkles, Globe2, Star, Bot, Lock, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ChartsCounter from '@/components/ChartsCounter';

const ZODIAC_RING = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

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
      <section className="relative overflow-hidden bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-700">
        {/* Decorative orbs */}
        <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-zorya-purple/10 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-zorya-violet/10 blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          {/* Animated zodiac ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.12]">
            <motion.div
              className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]"
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            >
              {ZODIAC_RING.map((s, i) => {
                const angle = (i / 12) * 360;
                const rad = (angle * Math.PI) / 180;
                return (
                  <span
                    key={i}
                    className="absolute text-zorya-violet text-3xl md:text-4xl font-bold"
                    style={{
                      left: `${50 + 45 * Math.cos(rad)}%`,
                      top: `${50 + 45 * Math.sin(rad)}%`,
                      transform: 'translate(-50%,-50%)',
                    }}
                  >
                    {s}
                  </span>
                );
              })}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-zorya-violet text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span>✦</span> Зоря — AI-астрологія
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6">
              Ваша натальна карта<br />
              <span className="bg-gradient-to-r from-zorya-purple to-zorya-violet bg-clip-text text-transparent">
                з AI-інтерпретацією
              </span><br />
              у всіх сферах життя
            </h1>

            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Розкрийте таємниці своєї натури через астрономічно точні розрахунки 
              та AI-аналіз вашої натальної карти
            </p>

            <motion.a
              href="/chart/new"
              className="btn-primary px-10 py-4 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✦ Розрахувати карту безкоштовно
            </motion.a>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-text-muted">
              <span className="flex items-center gap-1.5"><Clock size={14} strokeWidth={1.75} /> Менше 2 хвилин</span>
              <span className="flex items-center gap-1.5"><Lock size={14} strokeWidth={1.75} /> Приватність гарантована</span>
              <span className="flex items-center gap-1.5"><Bot size={14} strokeWidth={1.75} /> Професійний AI</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== QUESTIONS SECTION ===== */}
      <section className="py-16 md:py-20 bg-cosmic-800">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Вас щось турбує і ви задаєтесь питаннями:
            </h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {QUESTIONS.map((q, i) => (
              <motion.div
                key={q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 text-text-primary px-5 py-3 rounded-2xl text-sm md:text-base font-medium backdrop-blur-sm"
              >
                {q}
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-text-secondary mt-8 text-lg"
          >
            Відповіді записані у вашій натальній карті — і <strong className="text-zorya-violet">Зоря</strong> допоможе їх прочитати.
          </motion.p>
        </div>
      </section>

      {/* ===== HOW WE KNOW ===== */}
      <section className="py-16 md:py-20 bg-cosmic-900">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Як ми це знаємо?
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Поєднання тисячолітньої мудрості та сучасних технологій
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: Globe2, title: 'Астрономічна точність', desc: 'Розрахунки на основі реальних позицій планет з точністю до секунди дуги. Використовуємо Swiss Ephemeris — золотий стандарт астрономічних обчислень.' },
              { Icon: Star, title: 'База знань', desc: 'AI навчений на класичних та сучасних астрологічних текстах. Кожна інтерпретація базується на авторитетних джерелах.' },
              { Icon: Bot, title: 'AI інтерпретація', desc: 'Штучний інтелект аналізує всі елементи вашої карти разом — планети, доми, аспекти — для цілісного, персоналізованого аналізу.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <f.Icon size={36} strokeWidth={1.25} className="text-zorya-violet" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCT GRID ===== */}
      <section className="py-16 md:py-20 bg-cosmic-800">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Оберіть сферу для аналізу
            </h2>
            <p className="text-text-secondary text-lg">
              Кожна сфера — глибокий персоналізований звіт на основі вашої натальної карти
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => (
              <motion.a
                key={p.title}
                href="/chart/new"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 group cursor-pointer hover:border-zorya-purple/30 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                  <p.Icon size={26} strokeWidth={1.5} className="text-zorya-violet group-hover:text-zorya-gold transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3 group-hover:text-zorya-violet transition-colors">
                  {p.title}
                </h3>
                <ul className="space-y-2">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-zorya-violet mt-0.5">✦</span>
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
      <section className="py-16 md:py-20 bg-gradient-to-br from-cosmic-600 via-zorya-purple/80 to-cosmic-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Кожна натальна карта — книга вашого життя
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-12 mb-8">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zorya-gold">6</div>
                <div className="text-xs sm:text-sm md:text-base text-white/70 mt-1">сфер аналізу</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zorya-gold">10+</div>
                <div className="text-xs sm:text-sm md:text-base text-white/70 mt-1">сторінок звіту</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zorya-gold">AI</div>
                <div className="text-xs sm:text-sm md:text-base text-white/70 mt-1">персоналізація</div>
              </div>
            </div>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Персоналізований аналіз кожної планети, аспекту та дому у вашій натальній карті. 
              Конкретні рекомендації, а не загальні фрази.
            </p>
            <a
              href="/chart/new"
              className="inline-block px-10 py-4 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm shadow-glow"
            >
              Отримати свою карту
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 md:py-20 bg-cosmic-900">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Що кажуть наші користувачі
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-zorya-gold">★</span>
                  ))}
                  {Array.from({ length: 5 - t.rating }).map((_, j) => (
                    <span key={j} className="text-white/20">★</span>
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                <p className="text-text-primary font-semibold text-sm">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 md:py-20 bg-cosmic-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {/* Charts counter — real data */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="text-center"
            >
              <ChartsCounter />
              <div className="text-text-muted text-sm mt-1">карт розраховано</div>
            </motion.div>
            {[
              { value: '97%', label: 'задоволених' },
              { value: '6', label: 'сфер аналізу' },
              { value: '2 хв', label: 'час на розрахунок' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i + 1) * 0.1 }}
              >
                <div className="text-2xl md:text-3xl font-extrabold text-zorya-violet">{s.value}</div>
                <div className="text-text-muted text-sm mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 md:py-20 bg-cosmic-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Готові дізнатися більше про себе?
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            Розрахунок натальної карти займає менше 2 хвилин. Спробуйте прямо зараз!
          </p>
          <a
            href="/chart/new"
            className="btn-primary px-12 py-4 text-lg"
          >
            ✦ Розрахувати карту безкоштовно
          </a>
        </div>
      </section>
    </div>
  );
}
