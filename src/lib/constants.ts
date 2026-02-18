import { ReportAreaInfo, ZodiacSign, PlanetName } from '@/types/astrology';

// Таблиця планетарних гідностей (від Світлани)
export const PLANETARY_DIGNITIES: Record<string, {
  rulership: ZodiacSign[];
  exaltation: ZodiacSign[];
  detriment: ZodiacSign[];
  fall: ZodiacSign[];
}> = {
  Sun:     { rulership: ['Leo'],                      exaltation: ['Aries'],       detriment: ['Aquarius'],               fall: ['Libra']      },
  Moon:    { rulership: ['Cancer'],                   exaltation: ['Taurus'],      detriment: ['Capricorn'],              fall: ['Scorpio']    },
  Mercury: { rulership: ['Gemini', 'Virgo'],          exaltation: ['Virgo'],       detriment: ['Sagittarius', 'Pisces'],  fall: ['Pisces']     },
  Venus:   { rulership: ['Taurus', 'Libra'],          exaltation: ['Pisces'],      detriment: ['Scorpio', 'Aries'],       fall: ['Virgo']      },
  Mars:    { rulership: ['Aries', 'Scorpio'],         exaltation: ['Capricorn'],   detriment: ['Libra', 'Taurus'],        fall: ['Cancer']     },
  Jupiter: { rulership: ['Sagittarius'],              exaltation: ['Cancer'],      detriment: ['Gemini'],                 fall: ['Capricorn']  },
  Saturn:  { rulership: ['Capricorn'],                exaltation: ['Libra'],       detriment: ['Cancer'],                 fall: ['Aries']      },
  Uranus:  { rulership: ['Aquarius'],                 exaltation: ['Scorpio'],     detriment: ['Leo'],                    fall: ['Taurus']     },
  Neptune: { rulership: ['Pisces'],                   exaltation: ['Aquarius'],    detriment: ['Virgo'],                  fall: ['Leo']        },
  Pluto:   { rulership: ['Scorpio'],                  exaltation: ['Leo'],         detriment: ['Taurus'],                 fall: ['Aquarius']   },
};

export const DIGNITY_NAMES_UK: Record<string, string> = {
  rulership:  '👑 Володарювання',
  exaltation: '⬆️ Екзальтація',
  detriment:  '⬇️ Вигнання',
  fall:       '🔻 Падіння',
};

export function getPlanetDignityStatus(planet: PlanetName, sign: ZodiacSign): string | null {
  const d = PLANETARY_DIGNITIES[planet as string];
  if (!d) return null;
  if (d.rulership.includes(sign)) return 'rulership';
  if (d.exaltation.includes(sign)) return 'exaltation';
  if (d.detriment.includes(sign)) return 'detriment';
  if (d.fall.includes(sign)) return 'fall';
  return null;
}

export const REPORT_AREAS: ReportAreaInfo[] = [
  { id: 'general', name: 'Особистість', icon: '⭐', description: 'Загальний портрет особистості' },
  { id: 'career', name: 'Кар\'єра', icon: '💼', description: 'Професійне покликання та шлях' },
  { id: 'relationships', name: 'Стосунки', icon: '❤️', description: 'Любов та партнерство' },
  { id: 'health', name: 'Здоров\'я', icon: '🏥', description: 'Фізичне та емоційне благополуччя' },
  { id: 'finances', name: 'Фінанси', icon: '💰', description: 'Матеріальний добробут' },
  { id: 'spirituality', name: 'Духовність', icon: '🔮', description: 'Духовний шлях та карма' },
];

export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export const ZODIAC_NAMES_UK: Record<ZodiacSign, string> = {
  Aries: 'Овен', Taurus: 'Телець', Gemini: 'Близнюки', Cancer: 'Рак',
  Leo: 'Лев', Virgo: 'Діва', Libra: 'Терези', Scorpio: 'Скорпіон',
  Sagittarius: 'Стрілець', Capricorn: 'Козеріг', Aquarius: 'Водолій', Pisces: 'Риби',
};

export const PLANET_SYMBOLS: Record<PlanetName, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  TrueNode: '☊', SouthNode: '☋', Lilith: '⚸',
};

export const PLANET_NAMES_UK: Record<PlanetName, string> = {
  Sun: 'Сонце', Moon: 'Місяць', Mercury: 'Меркурій', Venus: 'Венера', Mars: 'Марс',
  Jupiter: 'Юпітер', Saturn: 'Сатурн', Uranus: 'Уран', Neptune: 'Нептун', Pluto: 'Плутон',
  TrueNode: 'Пн. Вузол', SouthNode: 'Пд. Вузол', Lilith: 'Ліліт',
};

export const ASPECT_SYMBOLS: Record<string, string> = {
  Conjunction: '☌', Opposition: '☍', Trine: '△', Square: '□', Sextile: '⚹',
  Quincunx: '⚻', Semisextile: '⚺', Semisquare: '∠', Sesquisquare: '⊼',
  Quintile: 'Q', Biquintile: 'bQ',
};

export const ASPECT_NAMES_UK: Record<string, string> = {
  Conjunction: 'Кон\'юнкція', Opposition: 'Опозиція', Trine: 'Тригон',
  Square: 'Квадрат', Sextile: 'Секстиль', Quincunx: 'Квінконс',
  Semisextile: 'Семісекстиль', Semisquare: 'Семіквадрат',
  Sesquisquare: 'Сесквіквадрат', Quintile: 'Квінтиль', Biquintile: 'Біквінтиль',
};

export const DEFAULT_API_OPTIONS = {
  house_system: 'P',
  zodiac_type: 'Tropic',
  active_points: [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter',
    'Saturn', 'Uranus', 'Neptune', 'Pluto', 'True_Node',
    'True_South_Node', 'Mean_Lilith',
  ],
  precision: 2,
};
