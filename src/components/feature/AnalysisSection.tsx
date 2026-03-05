'use client';

import { useState } from 'react';

// Ukrainian labels for common API keys
const UK_LABELS: Record<string, string> = {
  // Life areas & themes
  general: 'Загальне',
  love: 'Кохання',
  career: 'Кар\'єра',
  health: 'Здоров\'я',
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
  day_ruler_activities: 'Активності дня',
  power_hours: 'Години сили',
  times: 'Час',

  // Moon
  moon: 'Місяць',
  moon_phase: 'Фаза Місяця',
  moon_sign: 'Знак Місяця',
  illumination: 'Освітленість',
  phase: 'Фаза',
  ingress_today: 'Інгрес сьогодні',
  next_sign: 'Наступний знак',
  void_of_course_moon: 'Місяць без курсу',

  // Planetary influences
  planetary_influences: 'Планетарні впливи',
  planet: 'Планета',
  aspect_type: 'Тип аспекту',
  aspect_name: 'Назва аспекту',
  strength: 'Сила',
  natal_planet: 'Натальна планета',

  // Tips
  tips: 'Поради',

  // Chart anatomy
  compatibility: 'Сумісність',
  description: 'Опис',
  summary: 'Резюме',
  overview: 'Огляд',
  analysis: 'Аналіз',
  advice: 'Порада',
  rating: 'Рейтинг',
  score: 'Оцінка',
  overall_score: 'Загальна оцінка',
  score_description: 'Опис оцінки',
  is_destiny_sign: 'Знак долі',
  strengths: 'Сильні сторони',
  weaknesses: 'Слабкі сторони',
  challenges: 'Виклики',
  opportunities: 'Можливості',
  recommendations: 'Рекомендації',
  interpretation: 'Інтерпретація',
  conclusion: 'Висновок',
  aspects: 'Аспекти',
  planets: 'Планети',
  houses: 'Будинки',
  sign: 'Знак',
  element: 'Стихія',
  modality: 'Модальність',
  ruler: 'Управитель',
  dignity: 'Гідність',
  detriment: 'Вигнання',
  exaltation: 'Екзальтація',
  fall: 'Падіння',
  retrograde: 'Ретроградність',
  orb: 'Орб',
  applying: 'Застосовний',
  separating: 'Розділяючий',
  degree: 'Градус',
  minute: 'Хвилина',
  longitude: 'Довгота',
  latitude: 'Широта',
  declination: 'Схилення',
  speed: 'Швидкість',
  house: 'Будинок',
  cusp: 'Куспід',

  // Planet names
  sun: 'Сонце',
  moon_planet: 'Місяць',
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
  mean_lilith: 'Середня Ліліт',
  north_node: 'Північний вузол',
  south_node: 'Південний вузол',
  ascendant: 'Асцендент',
  midheaven: 'Середина неба',
  mc: 'MC',
  ic: 'IC',
  vertex: 'Вертекс',
  part_of_fortune: 'Точка Фортуни',

  // Aspect names
  conjunction: 'Кон\'юнкція',
  opposition: 'Опозиція',
  trine: 'Трін',
  square: 'Квадрат',
  sextile: 'Секстиль',
  quincunx: 'Квінконс',
  semi_sextile: 'Напівсекстиль',
  semi_square: 'Напівквадрат',
  sesquiquadrate: 'Сесквіквадрат',
  quintile: 'Квінтиль',
  biquintile: 'Біквінтиль',

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
  brief_analysis: 'Короткий аналіз',
  natal_analysis: 'Натальний аналіз',
  transit_analysis: 'Транзитний аналіз',
  synastry_analysis: 'Аналіз синастрії',
  composite_analysis: 'Композитний аналіз',
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
  start_date: 'Дата початку',
  end_date: 'Дата завершення',

  // Relationships
  red_flags: 'Тривожні знаки',
  love_languages: 'Мови кохання',
  body_mapping: 'Карта тіла',
  communication_style: 'Стиль спілкування',
  emotional_needs: 'Емоційні потреби',
  attachment_style: 'Стиль прив\'язаності',
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
  wellness_timing: 'Час для здоров\'я',
  wellness_score: 'Оцінка здоров\'я',
  physical: 'Фізичне',
  emotional: 'Емоційне',
  intellectual: 'Інтелектуальне',
  spiritual: 'Духовне',
  energy: 'Енергія',
  vitality: 'Життєва сила',
  stress: 'Стрес',
  recovery: 'Відновлення',

  // Financial / business
  market_timing: 'Час для ринку',
  personal_trading: 'Особисті фінанси',
  gann_analysis: 'Аналіз Ганна',
  bradley_siderograph: 'Сидерограф Бредлі',
  investment: 'Інвестиції',
  risk: 'Ризик',
  profit: 'Прибуток',
  loss: 'Втрата',
  growth: 'Зростання',
  expansion: 'Розширення',
  contraction: 'Скорочення',
  leadership: 'Лідерство',
  networking: 'Нетворкінг',
  innovation: 'Інновація',
  strategy: 'Стратегія',

  // Numerology
  core_numbers: 'Основні числа',
  comprehensive_report: 'Повний звіт',
  life_path: 'Число життєвого шляху',
  expression: 'Число вираження',
  soul_urge: 'Число душі',
  personality: 'Число особистості',
  birthday: 'Число дня народження',
  maturity: 'Число зрілості',
  personal_year: 'Персональний рік',
  personal_month: 'Персональний місяць',
  personal_day: 'Персональний день',
  karmic_debt: 'Кармічний борг',
  karmic_lessons: 'Кармічні уроки',
  master_number: 'Майстер-число',
  pinnacles: 'Піки',
  cycles: 'Цикли',

  // Transit & progressions
  transits: 'Транзити',
  natal_transits: 'Натальні транзити',
  transit_chart: 'Транзитна карта',
  progressions: 'Прогресії',
  secondary_progressions: 'Вторинні прогресії',
  solar_arc: 'Сонячна дуга',
  profections: 'Профекції',
  profection_year: 'Рік профекції',
  profected_house: 'Профецирований будинок',
  time_lord: 'Хронократор',
  solar_return: 'Повернення Сонця',
  lunar_return: 'Повернення Місяця',
  directions: 'Дирекції',
  primary_directions: 'Первинні дирекції',

  // Chinese astrology
  animal: 'Тварина',
  yin_yang: 'Інь-Ян',
  heavenly_stem: 'Небесний стовбур',
  earthly_branch: 'Земна гілка',
  five_elements: 'П\'ять елементів',
  bazi: 'Бацзи',
  pillar: 'Стовп',
  year_pillar: 'Стовп року',
  month_pillar: 'Стовп місяця',
  day_pillar: 'Стовп дня',
  hour_pillar: 'Стовп години',

  // Astrocartography
  lines: 'Лінії',
  locations: 'Локації',
  best_places: 'Найкращі місця',
  challenging_places: 'Складні місця',
  relocation: 'Релокація',
  map: 'Карта',
  city: 'Місто',
  country: 'Країна',
  region: 'Регіон',

  // Tarot
  card: 'Карта',
  cards: 'Карти',
  card_name: 'Назва карти',
  position: 'Позиція',
  meaning: 'Значення',
  reversed: 'Перевернута',
  upright: 'Пряма',
  major_arcana: 'Старші аркани',
  minor_arcana: 'Молодші аркани',
  suit: 'Масть',
  wands: 'Жезли',
  cups: 'Чаші',
  swords: 'Мечі',
  pentacles: 'Пентаклі',

  // Eclipses & fixed stars
  eclipse: 'Затемнення',
  eclipses: 'Затемнення',
  solar_eclipse: 'Сонячне затемнення',
  lunar_eclipse: 'Місячне затемнення',
  fixed_stars: 'Нерухомі зірки',
  star_name: 'Назва зірки',
  constellation: 'Сузір\'я',
  magnitude: 'Величина',
  nature: 'Природа',
  influence: 'Вплив',

  // Misc structure
  name: 'Ім\'я',
  type: 'Тип',
  category: 'Категорія',
  level: 'Рівень',
  status: 'Статус',
  result: 'Результат',
  results: 'Результати',
  details: 'Деталі',
  notes: 'Примітки',
  warning: 'Попередження',
  info: 'Інформація',
  text: 'Текст',
  format: 'Формат',
  word_count: 'Кількість слів',
  metadata: 'Метадані',
  extra: 'Додатково',
  data: 'Дані',
  value: 'Значення',
  key: 'Ключ',
  label: 'Позначка',
  percentage: 'Відсотки',
  count: 'Кількість',
  total: 'Всього',
  average: 'Середнє',
  minimum: 'Мінімум',
  maximum: 'Максимум',
  true_val: 'Так',
  false_val: 'Ні',
  yes: 'Так',
  no: 'Ні',
  positive: 'Позитивне',
  negative: 'Негативне',
  neutral: 'Нейтральне',
};

export function getLabel(key: string): string {
  return UK_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

interface AnalysisSectionProps {
  title: string;
  data: Record<string, unknown> | unknown[] | null;
  loading?: boolean;
  defaultCollapsed?: boolean;
}

function RenderValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) return null;

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
      // Short items (< 40 chars) render as tags, longer ones as list
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
    // Skip internal SDK fields that contain raw chart data / unknown structures
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
    // Render score-like numbers (0-100 or 0-10) as inline bar
    const isScore = typeof value === 'number' &&
      (label.toLowerCase().includes('оцінка') || label.toLowerCase().includes('рейтинг') ||
       label.toLowerCase().includes('score') || label.toLowerCase().includes('rating') ||
       label.toLowerCase().includes('сила') || label.toLowerCase().includes('strength'));
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
