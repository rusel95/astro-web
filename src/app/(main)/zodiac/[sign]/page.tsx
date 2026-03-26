import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ZodiacIcon from '@/components/icons/ZodiacIcon';

const ZODIAC_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const ZODIAC_INFO: Record<string, {
  symbol: string;
  name: string;
  nameEn: string;
  color: string;
  dates: string;
  element: string;
  quality: string;
  ruler: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  compatibility: string[];
}> = {
  aries: {
    symbol: '♈',
    name: 'Овен',
    nameEn: 'Aries',
    color: '#ef4444',
    dates: '21 березня — 19 квітня',
    element: 'Вогонь',
    quality: 'Кардинальний',
    ruler: 'Марс',
    description: 'Овен — перший знак зодіаку, символ нових починань та сміливості. Представники цього знаку — природжені лідери, які не бояться викликів та завжди рухаються вперед.',
    strengths: ['Сміливість', 'Енергійність', 'Ентузіазм', 'Чесність', 'Впевненість'],
    weaknesses: ['Імпульсивність', 'Нетерплячість', 'Агресивність', 'Егоцентризм'],
    compatibility: ['Лев', 'Стрілець', 'Близнюки', 'Водолій'],
  },
  taurus: {
    symbol: '♉',
    name: 'Телець',
    nameEn: 'Taurus',
    color: '#22c55e',
    dates: '20 квітня — 20 травня',
    element: 'Земля',
    quality: 'Фіксований',
    ruler: 'Венера',
    description: 'Телець — знак стабільності та матеріального благополуччя. Представники цього знаку цінують комфорт, надійність та красу в усіх її проявах.',
    strengths: ['Надійність', 'Терпіння', 'Практичність', 'Відданість', 'Естетичний смак'],
    weaknesses: ['Впертість', 'Лінь', 'Матеріалізм', 'Ревнощі'],
    compatibility: ['Діва', 'Козеріг', 'Рак', 'Риби'],
  },
  gemini: {
    symbol: '♊',
    name: 'Близнюки',
    nameEn: 'Gemini',
    color: '#eab308',
    dates: '21 травня — 20 червня',
    element: 'Повітря',
    quality: 'Мутабельний',
    ruler: 'Меркурій',
    description: 'Близнюки — знак комунікації та інтелекту. Представники цього знаку — допитливі, адаптивні та завжди в пошуку нових знань і вражень.',
    strengths: ['Комунікабельність', 'Допитливість', 'Адаптивність', 'Розумність', 'Гумор'],
    weaknesses: ['Поверхневість', 'Непостійність', 'Тривожність', 'Нерішучість'],
    compatibility: ['Терези', 'Водолій', 'Овен', 'Лев'],
  },
  cancer: {
    symbol: '♋',
    name: 'Рак',
    nameEn: 'Cancer',
    color: '#94a3b8',
    dates: '21 червня — 22 липня',
    element: 'Вода',
    quality: 'Кардинальний',
    ruler: 'Місяць',
    description: 'Рак — знак емоцій та сім\'ї. Представники цього знаку — чутливі, дбайливі та глибоко емоційні, з сильною інтуїцією.',
    strengths: ['Емпатія', 'Інтуїція', 'Лояльність', 'Дбайливість', 'Уява'],
    weaknesses: ['Емоційність', 'Образливість', 'Песимізм', 'Маніпулятивність'],
    compatibility: ['Скорпіон', 'Риби', 'Телець', 'Діва'],
  },
  leo: {
    symbol: '♌',
    name: 'Лев',
    nameEn: 'Leo',
    color: '#d4af37',
    dates: '23 липня — 22 серпня',
    element: 'Вогонь',
    quality: 'Фіксований',
    ruler: 'Сонце',
    description: 'Лев — знак харизми та творчості. Представники цього знаку — природжені лідери, щедрі, драматичні та завжди в центрі уваги.',
    strengths: ['Харизма', 'Щедрість', 'Впевненість', 'Креативність', 'Вірність'],
    weaknesses: ['Гордість', 'Зарозумілість', 'Драматичність', 'Владність'],
    compatibility: ['Овен', 'Стрілець', 'Близнюки', 'Терези'],
  },
  virgo: {
    symbol: '♍',
    name: 'Діва',
    nameEn: 'Virgo',
    color: '#14b8a6',
    dates: '23 серпня — 22 вересня',
    element: 'Земля',
    quality: 'Мутабельний',
    ruler: 'Меркурій',
    description: 'Діва — знак служіння та досконалості. Представники цього знаку — аналітичні, працелюбні та завжди прагнуть до поліпшення.',
    strengths: ['Аналітичний розум', 'Старанність', 'Практичність', 'Надійність', 'Скромність'],
    weaknesses: ['Критичність', 'Перфекціонізм', 'Занепокоєння', 'Надмірна критика'],
    compatibility: ['Телець', 'Козеріг', 'Рак', 'Скорпіон'],
  },
  libra: {
    symbol: '♎',
    name: 'Терези',
    nameEn: 'Libra',
    color: '#ec4899',
    dates: '23 вересня — 22 жовтня',
    element: 'Повітря',
    quality: 'Кардинальний',
    ruler: 'Венера',
    description: 'Терези — знак гармонії та партнерства. Представники цього знаку — дипломатичні, справедливі та цінують красу і баланс.',
    strengths: ['Дипломатичність', 'Справедливість', 'Соціальність', 'Естетичний смак', 'Гармонійність'],
    weaknesses: ['Нерішучість', 'Уникнення конфліктів', 'Залежність від інших', 'Поверхневість'],
    compatibility: ['Близнюки', 'Водолій', 'Лев', 'Стрілець'],
  },
  scorpio: {
    symbol: '♏',
    name: 'Скорпіон',
    nameEn: 'Scorpio',
    color: '#dc2626',
    dates: '23 жовтня — 21 листопада',
    element: 'Вода',
    quality: 'Фіксований',
    ruler: 'Плутон, Марс',
    description: 'Скорпіон — знак трансформації та глибини. Представники цього знаку — пристрасні, рішучі та володіють надзвичайною внутрішньою силою.',
    strengths: ['Пристрасність', 'Рішучість', 'Лояльність', 'Інтуїція', 'Трансформація'],
    weaknesses: ['Ревнощі', 'Мстивість', 'Скритність', 'Одержимість'],
    compatibility: ['Рак', 'Риби', 'Діва', 'Козеріг'],
  },
  sagittarius: {
    symbol: '♐',
    name: 'Стрілець',
    nameEn: 'Sagittarius',
    color: '#f97316',
    dates: '22 листопада — 21 грудня',
    element: 'Вогонь',
    quality: 'Мутабельний',
    ruler: 'Юпітер',
    description: 'Стрілець — знак філософії та пригод. Представники цього знаку — оптимістичні, авантюрні та завжди в пошуку істини і нових горизонтів.',
    strengths: ['Оптимізм', 'Чесність', 'Авантюризм', 'Філософський склад розуму', 'Щедрість'],
    weaknesses: ['Нетактовність', 'Безвідповідальність', 'Нетерпіння', 'Нерозважливість'],
    compatibility: ['Овен', 'Лев', 'Терези', 'Водолій'],
  },
  capricorn: {
    symbol: '♑',
    name: 'Козеріг',
    nameEn: 'Capricorn',
    color: '#92400e',
    dates: '22 грудня — 19 січня',
    element: 'Земля',
    quality: 'Кардинальний',
    ruler: 'Сатурн',
    description: 'Козеріг — знак амбіцій та досягнень. Представники цього знаку — дисципліновані, відповідальні та невпинно йдуть до своєї мети.',
    strengths: ['Амбітність', 'Дисципліна', 'Відповідальність', 'Терпіння', 'Практичність'],
    weaknesses: ['Песимізм', 'Впертість', 'Холодність', 'Прагнення до контролю'],
    compatibility: ['Телець', 'Діва', 'Скорпіон', 'Риби'],
  },
  aquarius: {
    symbol: '♒',
    name: 'Водолій',
    nameEn: 'Aquarius',
    color: '#3b82f6',
    dates: '20 січня — 18 лютого',
    element: 'Повітря',
    quality: 'Фіксований',
    ruler: 'Уран, Сатурн',
    description: 'Водолій — знак інновацій та гуманізму. Представники цього знаку — незалежні, прогресивні та прагнуть зробити світ кращим.',
    strengths: ['Інноваційність', 'Незалежність', 'Гуманність', 'Інтелектуальність', 'Оригінальність'],
    weaknesses: ['Відчуженість', 'Непередбачуваність', 'Впертість', 'Емоційна холодність'],
    compatibility: ['Близнюки', 'Терези', 'Овен', 'Стрілець'],
  },
  pisces: {
    symbol: '♓',
    name: 'Риби',
    nameEn: 'Pisces',
    color: '#a855f7',
    dates: '19 лютого — 20 березня',
    element: 'Вода',
    quality: 'Мутабельний',
    ruler: 'Нептун, Юпітер',
    description: 'Риби — знак співчуття та духовності. Представники цього знаку — чутливі, креативні та глибоко емпатичні.',
    strengths: ['Співчуття', 'Інтуїція', 'Креативність', 'Доброта', 'Духовність'],
    weaknesses: ['Надмірна чутливість', 'Ескапізм', 'Нерішучість', 'Жертовність'],
    compatibility: ['Рак', 'Скорпіон', 'Телець', 'Козеріг'],
  },
};

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((sign) => ({
    sign,
  }));
}

export async function generateMetadata({ params }: { params: { sign: string } }): Promise<Metadata> {
  const zodiac = ZODIAC_INFO[params.sign];
  
  if (!zodiac) {
    return {
      title: 'Знак не знайдено',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astro-web-five.vercel.app';
  const canonicalUrl = `${baseUrl}/zodiac/${params.sign}`;
  const ogImage = `${baseUrl}/api/og/${params.sign}`;
  
  const title = `${zodiac.symbol} ${zodiac.name} — Характеристика знаку зодіаку | Зоря`;
  const description = `${zodiac.description} Дізнайтеся більше про знак ${zodiac.name}: сильні сторони, слабкості, сумісність.`;
  
  // High-traffic keywords for SEO
  const keywords = [
    `${zodiac.name}`,
    `знак зодіаку ${zodiac.name}`,
    `${zodiac.name} характеристика`,
    `${zodiac.name} гороскоп`,
    `${zodiac.name} сумісність`,
    `${zodiac.name} ${zodiac.dates}`,
    `${zodiac.element} знак`,
    zodiac.nameEn,
    `astrology ${zodiac.nameEn}`,
    'натальна карта',
    'астрологія',
  ];

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: 'Зоря' }],
    creator: 'Зоря',
    publisher: 'Зоря',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Зоря',
      locale: 'uk_UA',
      type: 'article',
      images: [{ 
        url: ogImage, 
        width: 1200, 
        height: 630,
        alt: `${zodiac.symbol} ${zodiac.name} — астрологічна характеристика`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@Зоря',
    },
  };
}

export default function ZodiacSignPage({ params }: { params: { sign: string } }) {
  const zodiac = ZODIAC_INFO[params.sign];

  if (!zodiac) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astro-web-five.vercel.app';
  const canonicalUrl = `${baseUrl}/zodiac/${params.sign}`;

  // JSON-LD structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${zodiac.symbol} ${zodiac.name} — Характеристика знаку зодіаку`,
    description: zodiac.description,
    image: `${baseUrl}/api/og/${params.sign}`,
    author: {
      '@type': 'Organization',
      name: 'Зоря',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Зоря',
      url: baseUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    datePublished: '2026-02-19',
    dateModified: '2026-02-19',
    keywords: `${zodiac.name}, знак зодіаку, астрологія, ${zodiac.element}, ${zodiac.nameEn}`,
    articleSection: 'Знаки зодіаку',
    inLanguage: 'uk-UA',
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen py-12 px-4" style={{ background: 'linear-gradient(to bottom, #0f0a1e, #1a0e35)' }}>
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-block mb-6"
            style={{
              filter: `drop-shadow(0 0 40px ${zodiac.color}80)`,
            }}
          >
            <ZodiacIcon sign={zodiac.nameEn} size={120} color={zodiac.color} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">{zodiac.name}</h1>
          <p className="text-xl text-white/60 mb-2">{zodiac.dates}</p>
          <div className="flex items-center justify-center gap-4 text-white/50">
            <span>{zodiac.element}</span>
            <span>•</span>
            <span>{zodiac.quality}</span>
            <span>•</span>
            <span>Правитель: {zodiac.ruler}</span>
          </div>
        </div>

        {/* Sign selector — navigate between all 12 signs */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-10">
          {ZODIAC_SIGNS.map((sign) => {
            const info = ZODIAC_INFO[sign];
            const isActive = params.sign === sign;
            return (
              <Link
                key={sign}
                href={`/zodiac/${sign}`}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-zorya-violet/20 border border-zorya-violet/40 scale-105'
                    : 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]'
                }`}
              >
                <ZodiacIcon sign={info.nameEn} size={20} color={isActive ? info.color : undefined} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-white/50'}`}>
                  {info.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Description */}
        <div className="p-8 rounded-3xl mb-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-lg text-white/80 leading-relaxed">{zodiac.description}</p>
        </div>

        {/* Strengths */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">💪 Сильні сторони</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {zodiac.strengths.map((strength, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl text-center"
                style={{ background: `${zodiac.color}15`, border: `1px solid ${zodiac.color}30` }}
              >
                <span className="text-white/90">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">⚠️ Виклики</h2>
          <div className="grid grid-cols-2 gap-3">
            {zodiac.weaknesses.map((weakness, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-white/70">{weakness}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compatibility */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">💕 Найкраща сумісність</h2>
          <div className="flex flex-wrap gap-3">
            {zodiac.compatibility.map((sign, idx) => (
              <div
                key={idx}
                className="px-6 py-3 rounded-full text-white"
                style={{ background: `${zodiac.color}25`, border: `1px solid ${zodiac.color}50` }}
              >
                {sign}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 rounded-3xl" style={{ background: `${zodiac.color}10`, border: `2px solid ${zodiac.color}30` }}>
          <h3 className="text-2xl font-bold text-white mb-4">Дізнайтесь більше про вашу натальну карту</h3>
          <p className="text-white/50 text-sm mb-6">Розрахуйте персональну карту та отримайте AI-аналіз вашої особистості</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/quiz"
              className="inline-block px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${zodiac.color} 0%, ${zodiac.color}dd 100%)` }}
            >
              Розрахувати натальну карту →
            </Link>
            <Link
              href="/horoscope/daily"
              className="inline-block px-8 py-4 rounded-2xl font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
            >
              Щоденний гороскоп
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
