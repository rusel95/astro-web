'use client';

import { useState } from 'react';

// Ukrainian labels for common API keys (astrology terms use proper Ukrainian astrology terminology)
const UK_LABELS: Record<string, string> = {
  // Life areas & themes
  general: 'Загальне',
  love: 'Кохання',
  career: "Кар'єра",
  health: "Здоров'я",
  money: 'Фінанси',
  finances: 'Фінанси',
  finance: 'Фінанси',
  spirituality: 'Духовність',
  mood: 'Настрій',
  identity: 'Особистість',
  relationships: 'Стосунки',
  creativity: 'Творчість',
  home: 'Дім',
  learning: 'Навчання',
  communication: 'Спілкування',
  travel: 'Подорожі',
  family: 'Родина',
  friendship: 'Дружба',
  education: 'Освіта',
  work: 'Робота',
  business: 'Бізнес',
  wellness: 'Самопочуття',

  // Horoscope structure
  overall_theme: 'Загальна тема',
  overall_rating: 'Загальна оцінка',
  life_areas: 'Сфери життя',
  prediction: 'Прогноз',
  area: 'Сфера',
  title: 'Назва',
  keywords: 'Ключові слова',
  reasoning: 'Обґрунтування',
  context_modifier: 'Контекст',
  horoscope: 'Гороскоп',
  horoscopeText: 'Текст гороскопу',
  timeframe: 'Період',
  time_window: 'Часовий проміжок',
  start: 'Початок',
  end: 'Кінець',
  days: 'Дні',

  // Lucky elements
  lucky_elements: 'Щасливі елементи',
  lucky_number: 'Щасливе число',
  lucky_numbers: 'Щасливі числа',
  lucky_colors: 'Щасливі кольори',
  colors: 'Кольори',
  color: 'Колір',
  numbers: 'Числа',
  stones: 'Камені',
  directions: 'Напрямки',
  day_ruler: 'Планета дня',
  day_ruler_activities: 'Сприятливі справи',
  power_hours: 'Години сили',
  times: 'Час',

  // Moon
  moon: 'Місяць',
  moon_phase: 'Фаза Місяця',
  moon_sign: 'Місяць у знаку',
  illumination: 'Освітленість',
  phase: 'Фаза',
  ingress_today: 'Перехід сьогодні',
  next_sign: 'Наступний знак',
  void_of_course_moon: 'Місяць без курсу',

  // Planetary influences
  planetary_influences: 'Планетарні впливи',
  planet: 'Планета',
  aspect_type: 'Тип аспекту',
  aspect_name: 'Аспект',
  strength: 'Сила',
  natal_planet: 'Натальна планета',

  // Tips
  tips: 'Поради',

  // Chart anatomy
  compatibility: 'Сумісність',
  description: 'Опис',
  summary: 'Підсумок',
  overview: 'Огляд',
  analysis: 'Аналіз',
  advice: 'Порада',
  rating: 'Оцінка',
  score: 'Бал',
  overall_score: 'Загальний бал',
  score_description: 'Опис оцінки',
  is_destiny_sign: 'Знак долі',
  strengths: 'Сильні сторони',
  weaknesses: 'Слабкі сторони',
  challenges: 'Виклики',
  opportunities: 'Можливості',
  recommendations: 'Рекомендації',
  interpretation: 'Тлумачення',
  conclusion: 'Висновок',
  aspects: 'Аспекти',
  planets: 'Планети',
  houses: 'Будинки',
  sign: 'Знак',
  element: 'Стихія',
  modality: 'Хрест',
  ruler: 'Керівник',
  dignity: 'Гідність',
  detriment: 'Вигнання',
  exaltation: 'Екзальтація',
  fall: 'Падіння',
  retrograde: 'Ретроградність',
  orb: 'Орбіс',
  applying: 'Аплікативний',
  separating: 'Сепаративний',
  degree: 'Градус',
  minute: 'Хвилина',
  longitude: 'Довгота',
  latitude: 'Широта',

  // Planet names
  sun: 'Сонце',
  mercury: 'Меркурій',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпітер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
  chiron: 'Хірон',
  lilith: 'Ліліт',
  north_node: 'Висхідний вузол',
  south_node: 'Низхідний вузол',
  ascendant: 'Асцендент',
  midheaven: 'Середина Неба (MC)',
  vertex: 'Вертекс',

  // Aspect names
  conjunction: "Кон'юнкція",
  opposition: 'Опозиція',
  trine: 'Тригон',
  square: 'Квадратура',
  sextile: 'Секстиль',
  quincunx: 'Квінконс',

  // Zodiac signs
  aries: 'Овен',
  taurus: 'Телець',
  gemini: 'Близнюки',
  cancer: 'Рак',
  leo: 'Лев',
  virgo: 'Діва',
  libra: 'Терези',
  scorpio: 'Скорпіон',
  sagittarius: 'Стрілець',
  capricorn: 'Козеріг',
  aquarius: 'Водолій',
  pisces: 'Риби',

  // Analysis & reports
  key_influences: 'Ключові впливи',
  detailed_analysis: 'Детальний аналіз',
  report: 'Звіт',
  natal_report: 'Натальний звіт',
  transit_report: 'Транзитний звіт',
  synastry_report: 'Синастрійний звіт',
  composite_report: 'Композитний звіт',

  // Time periods
  daily: 'Щоденний',
  weekly: 'Тижневий',
  monthly: 'Місячний',
  yearly: 'Річний',
  personal: 'Особистий',
  timing: 'Час',
  date: 'Дата',
  period: 'Період',
  duration: 'Тривалість',

  // Relationships
  red_flags: 'Тривожні сигнали',
  love_languages: 'Мови кохання',
  body_mapping: 'Карта тіла',
  communication_style: 'Стиль спілкування',
  emotional_needs: 'Емоційні потреби',
  conflict_resolution: 'Вирішення конфліктів',
  shared_values: 'Спільні цінності',
  growth_areas: 'Зони розвитку',
  intimacy: 'Близькість',
  trust: 'Довіра',
  passion: 'Пристрасть',
  stability: 'Стабільність',

  // Wellness & health
  biorhythms: 'Біоритми',
  energy_patterns: 'Енергетичні патерни',
  wellness_timing: "Сприятливий час для здоров'я",
  wellness_score: "Оцінка здоров'я",
  physical: 'Фізичне',
  emotional: 'Емоційне',
  intellectual: 'Інтелектуальне',
  energy: 'Енергія',
  vitality: 'Життєва сила',

  // Financial / business
  market_timing: 'Ринковий час',
  personal_trading: 'Особисті фінанси',
  gann_analysis: 'Аналіз Ганна',
  bradley_siderograph: 'Сидерограф Бредлі',
  investment: 'Інвестиції',
  risk: 'Ризик',
  growth: 'Зростання',
  leadership: 'Лідерство',
  strategy: 'Стратегія',

  // Numerology
  core_numbers: 'Основні числа',
  comprehensive_report: 'Повний звіт',
  life_path: 'Число Життєвого Шляху',
  expression: 'Число Вираження',
  soul_urge: 'Число Душі',
  personality: 'Число Особистості',
  birthday: 'Число Дня Народження',
  maturity: 'Число Зрілості',
  personal_year: 'Персональний рік',
  karmic_debt: 'Кармічний борг',
  karmic_lessons: 'Кармічні уроки',
  pinnacles: 'Вершини',
  cycles: 'Цикли',

  // Transit & progressions
  transits: 'Транзити',
  natal_transits: 'Натальні транзити',
  transit_chart: 'Транзитна карта',
  progressions: 'Прогресії',
  profections: 'Профекції',
  solar_return: 'Соляр',
  lunar_return: 'Лунар',
  primary_directions: 'Первинні дирекції',

  // Chinese astrology
  animal: 'Тварина',
  yin_yang: 'Інь-Ян',
  five_elements: "П'ять стихій",
  bazi: 'Ба-Цзи',

  // Astrocartography
  lines: 'Лінії',
  locations: 'Локації',
  best_places: 'Найкращі місця',
  relocation: 'Релокація',
  city: 'Місто',
  country: 'Країна',

  // Tarot
  card: 'Карта',
  cards: 'Карти',
  card_name: 'Назва карти',
  position: 'Позиція',
  meaning: 'Значення',
  reversed: 'Перевернута',
  upright: 'Пряма',
  major_arcana: 'Старші Аркани',
  minor_arcana: 'Молодші Аркани',

  // Eclipses & fixed stars
  eclipse: 'Затемнення',
  eclipses: 'Затемнення',
  fixed_stars: 'Нерухомі зірки',
  constellation: "Сузір'я",
  magnitude: 'Зоряна величина',
  nature: 'Природа',
  influence: 'Вплив',

  // Misc structure
  name: "Ім'я",
  type: 'Тип',
  category: 'Категорія',
  level: 'Рівень',
  status: 'Статус',
  result: 'Результат',
  results: 'Результати',
  details: 'Деталі',
  notes: 'Примітки',
  text: 'Текст',
  metadata: 'Метадані',
  data: 'Дані',
  value: 'Значення',
  percentage: 'Відсотки',
  count: 'Кількість',
  total: 'Всього',
  positive: 'Позитивне',
  negative: 'Негативне',
  neutral: 'Нейтральне',
};

export function getLabel(key: string): string {
  return UK_LABELS[key] || UK_LABELS[key.toLowerCase()] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

interface AnalysisSectionProps {
  title: string;
  data: Record<string, unknown> | unknown[] | null;
  loading?: boolean;
  defaultCollapsed?: boolean;
}

function RenderValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) return null;

  // Safety: convert non-standard types to string to prevent .map() crashes
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean' && typeof value !== 'object') {
    return <span className="text-white/60 text-sm">{String(value)}</span>;
  }

  if (typeof value === 'string') {
    return <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{value}</p>;
  }

  if (typeof value === 'number') {
    return <span className="text-zorya-gold font-medium">{value}</span>;
  }

  if (typeof value === 'boolean') {
    return <span className="text-zorya-violet">{value ? 'Так' : 'Ні'}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    if (typeof value[0] === 'string' || typeof value[0] === 'number') {
      // Short items render as tags, longer ones as list
      const allShort = value.every(item => String(item).length < 40);
      if (allShort && value.length <= 12) {
        return (
          <div className="flex flex-wrap gap-1.5">
            {value.map((item, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-white/70 text-xs">
                {String(item)}
              </span>
            ))}
          </div>
        );
      }
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, i) => (
            <li key={i} className="text-white/80 text-sm">{String(item)}</li>
          ))}
        </ul>
      );
    }
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="pl-3 border-l border-white/10">
            <RenderValue value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object') {
    const SKIP_KEYS = new Set(['subject_data', 'directed_data', 'progressed_data', 'chart_data', 'target_data']);
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([k, v]) => v !== null && v !== undefined && !SKIP_KEYS.has(k)
    );
    if (entries.length === 0) return null;
    return (
      <div className="space-y-3">
        {entries.map(([key, val]) => (
          <CollapsibleEntry key={key} label={getLabel(key)} value={val} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return <span className="text-white/60 text-sm">{String(value)}</span>;
}

function CollapsibleEntry({
  label,
  value,
  depth,
}: {
  label: string;
  value: unknown;
  depth: number;
}) {
  const isComplex = typeof value === 'object' && value !== null;
  const hasMany = isComplex && (Array.isArray(value) ? value.length > 5 : Object.keys(value as object).length > 5);
  const [collapsed, setCollapsed] = useState(hasMany && depth > 0);

  if (!isComplex) {
    // Render score-like numbers as inline progress bar
    const lowerLabel = label.toLowerCase();
    const isScore = typeof value === 'number' &&
      (lowerLabel.includes('оцінка') || lowerLabel.includes('бал') ||
       lowerLabel.includes('score') || lowerLabel.includes('rating') ||
       lowerLabel.includes('сила') || lowerLabel.includes('strength'));
    if (isScore && typeof value === 'number') {
      const max = value <= 10 ? 10 : 100;
      const pct = Math.min(100, (value / max) * 100);
      const barColor = pct >= 70 ? 'bg-emerald-400' : pct >= 40 ? 'bg-zorya-gold' : 'bg-orange-400';
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-white/50 text-xs font-medium uppercase tracking-wide">{label}:</span>
          <div className="flex items-center gap-2 flex-1 min-w-[120px]">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[120px]">
              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-zorya-gold font-medium text-sm">{value}{max === 100 ? '%' : `/${max}`}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-white/50 text-xs font-medium uppercase tracking-wide">{label}:</span>
        <RenderValue value={value} depth={depth} />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors min-h-[44px] w-full text-left"
      >
        <span className="text-xs text-white/40">{collapsed ? '▶' : '▼'}</span>
        {label}
      </button>
      {!collapsed && (
        <div className="pl-4 mt-1">
          <RenderValue value={value} depth={depth} />
        </div>
      )}
    </div>
  );
}

export default function AnalysisSection({
  title,
  data,
  loading = false,
  defaultCollapsed = false,
}: AnalysisSectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-40 bg-white/[0.08] rounded" />
          <div className="h-4 w-full bg-white/[0.08] rounded" />
          <div className="h-4 w-3/4 bg-white/[0.08] rounded" />
          <div className="h-4 w-5/6 bg-white/[0.08] rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-2xl bg-white/[0.05] border border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors min-h-[44px]"
      >
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <span className="text-white/40 text-sm">{collapsed ? '▶' : '▼'}</span>
      </button>
      {!collapsed && (
        <div className="px-4 pb-4 space-y-3">
          <RenderValue value={data} />
        </div>
      )}
    </div>
  );
}
