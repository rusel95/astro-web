import { NatalChart, StoredChart, ChartInput, AIReport } from '@/types/astrology';

export const MOCK_CHART_INPUT: ChartInput = {
  name: 'Олена',
  birthDate: '1995-03-21',
  birthTime: '14:30',
  city: 'Kyiv',
  countryCode: 'UA',
  latitude: 50.4501,
  longitude: 30.5234,
};

export const MOCK_NATAL_CHART: NatalChart = {
  birthDate: '1995-03-21',
  birthTime: '14:30',
  latitude: 50.4501,
  longitude: 30.5234,
  locationName: 'Kyiv',
  ascendant: 128.45, // Leo
  midheaven: 38.72,  // Taurus
  calculatedAt: new Date().toISOString(),
  planets: [
    { name: 'Sun', longitude: 0.52, sign: 'Aries', house: 9, isRetrograde: false, speed: 0.99 },
    { name: 'Moon', longitude: 195.3, sign: 'Libra', house: 3, isRetrograde: false, speed: 13.2 },
    { name: 'Mercury', longitude: 348.1, sign: 'Pisces', house: 8, isRetrograde: false, speed: 1.5 },
    { name: 'Venus', longitude: 15.7, sign: 'Aries', house: 9, isRetrograde: false, speed: 1.2 },
    { name: 'Mars', longitude: 128.9, sign: 'Leo', house: 1, isRetrograde: false, speed: 0.7 },
    { name: 'Jupiter', longitude: 242.3, sign: 'Sagittarius', house: 5, isRetrograde: false, speed: 0.12 },
    { name: 'Saturn', longitude: 337.8, sign: 'Pisces', house: 8, isRetrograde: true, speed: -0.05 },
    { name: 'Uranus', longitude: 298.4, sign: 'Capricorn', house: 6, isRetrograde: false, speed: 0.03 },
    { name: 'Neptune', longitude: 295.1, sign: 'Capricorn', house: 6, isRetrograde: false, speed: 0.02 },
    { name: 'Pluto', longitude: 241.5, sign: 'Scorpio', house: 4, isRetrograde: false, speed: 0.01 },
    { name: 'TrueNode', longitude: 218.7, sign: 'Scorpio', house: 4, isRetrograde: false, speed: -0.05 },
    { name: 'SouthNode', longitude: 38.7, sign: 'Taurus', house: 10, isRetrograde: false, speed: 0.05 },
    { name: 'Lilith', longitude: 162.3, sign: 'Virgo', house: 2, isRetrograde: false, speed: 0.11 },
  ],
  houses: [
    { number: 1, cusp: 128.45, sign: 'Leo' },
    { number: 2, cusp: 152.3, sign: 'Virgo' },
    { number: 3, cusp: 180.1, sign: 'Libra' },
    { number: 4, cusp: 212.5, sign: 'Scorpio' },
    { number: 5, cusp: 245.8, sign: 'Sagittarius' },
    { number: 6, cusp: 280.2, sign: 'Capricorn' },
    { number: 7, cusp: 308.45, sign: 'Aquarius' },
    { number: 8, cusp: 332.3, sign: 'Pisces' },
    { number: 9, cusp: 0.1, sign: 'Aries' },
    { number: 10, cusp: 38.72, sign: 'Taurus' },
    { number: 11, cusp: 65.8, sign: 'Gemini' },
    { number: 12, cusp: 100.2, sign: 'Cancer' },
  ],
  aspects: [
    { planet1: 'Sun', planet2: 'Venus', type: 'Conjunction', orb: 0.82, isApplying: false },
    { planet1: 'Sun', planet2: 'Moon', type: 'Opposition', orb: 5.22, isApplying: true },
    { planet1: 'Moon', planet2: 'Jupiter', type: 'Sextile', orb: 2.7, isApplying: false },
    { planet1: 'Mercury', planet2: 'Saturn', type: 'Conjunction', orb: 4.3, isApplying: true },
    { planet1: 'Venus', planet2: 'Mars', type: 'Trine', orb: 3.2, isApplying: false },
    { planet1: 'Mars', planet2: 'Jupiter', type: 'Trine', orb: 6.6, isApplying: true },
    { planet1: 'Jupiter', planet2: 'Pluto', type: 'Conjunction', orb: 0.8, isApplying: false },
    { planet1: 'Saturn', planet2: 'Neptune', type: 'Conjunction', orb: 2.3, isApplying: true },
    { planet1: 'Uranus', planet2: 'Neptune', type: 'Conjunction', orb: 3.3, isApplying: false },
    { planet1: 'Sun', planet2: 'Jupiter', type: 'Trine', orb: 1.78, isApplying: true },
    { planet1: 'Moon', planet2: 'Mars', type: 'Sextile', orb: 6.4, isApplying: false },
    { planet1: 'Venus', planet2: 'Jupiter', type: 'Trine', orb: 2.6, isApplying: true },
    { planet1: 'Mercury', planet2: 'Neptune', type: 'Sextile', orb: 7.0, isApplying: false },
    { planet1: 'Sun', planet2: 'Pluto', type: 'Trine', orb: 1.02, isApplying: false },
    { planet1: 'Moon', planet2: 'Uranus', type: 'Square', orb: 3.1, isApplying: true },
  ],
  houseRulers: [
    { houseNumber: 1, rulingPlanet: 'Sun', rulerSign: 'Aries', rulerHouse: 9, rulerLongitude: 0.52 },
    { houseNumber: 7, rulingPlanet: 'Saturn', rulerSign: 'Pisces', rulerHouse: 8, rulerLongitude: 337.8 },
    { houseNumber: 10, rulingPlanet: 'Venus', rulerSign: 'Aries', rulerHouse: 9, rulerLongitude: 15.7 },
  ],
};

export const MOCK_STORED_CHART: StoredChart = {
  id: 'demo',
  input: MOCK_CHART_INPUT,
  chart: MOCK_NATAL_CHART,
  createdAt: new Date().toISOString(),
};

export const MOCK_REPORT: AIReport = {
  summary: 'Ваша натальна карта відкриває динамічну та амбітну особистість з сильним вогняним началом. Сонце в Овні на куспіді 9-го дому дарує вам жагу до пізнання та подорожей.',
  key_influences: [
    '☉ Сонце в Овні (9 дім): Природжений лідер з потягом до філософії та пригод',
    '☽ Місяць у Терезах (3 дім): Емоційна потреба в гармонії та спілкуванні',
    '☿ Меркурій у Рибах (8 дім): Інтуїтивне мислення, глибоке проникнення у таємниці',
    '♀ Венера в Овні (9 дім): Пристрасна та імпульсивна у коханні, любов до подорожей',
    '♂ Марс у Леві (1 дім): Потужна харизма, драматичне самовираження',
    '♃ Юпітер у Стрільці (5 дім): Щастя через творчість та розширення горизонтів',
    '♄ Сатурн у Рибах ℞ (8 дім): Кармічні уроки через трансформацію та спільні ресурси',
    '♅ Уран у Козерозі (6 дім): Інноваційний підхід до роботи та здоров\'я',
    '♆ Нептун у Козерозі (6 дім): Духовна практика через щоденну дисципліну',
    '♇ Плутон у Скорпіоні (4 дім): Глибока трансформація через родину та корені',
  ],
  detailed_analysis: 'Ваша натальна карта розкриває яскраву та багатогранну особистість. Асцендент у Леві наділяє вас природною харизмою, творчим самовираженням та потребою бути поміченим.\n\nСонце в Овні у 9-му домі вказує на те, що ваше справжнє "я" розкривається через пізнання, подорожі та розширення світогляду. Кон\'юнкція Сонця з Венерою додає привабливості та артистизму вашій натурі.\n\nМісяць у Терезах у 3-му домі говорить про емоційну потребу в гармонійних стосунках з оточенням. Ви знаходите емоційний комфорт через спілкування, писемне слово та обмін ідеями.\n\nМарс у Леві на Асценденті — одна з найяскравіших позицій у вашій карті. Це дає вам неймовірну енергію, драйв та здатність надихати інших своїм прикладом.\n\nЮпітер у Стрільці у 5-му домі — це позиція великого щастя та розширення через творчість, романтику та дітей. Кон\'юнкція Юпітера з Плутоном посилює вашу здатність до глибоких трансформацій.\n\nСатурн ретроградний у Рибах у 8-му домі вказує на кармічні уроки, пов\'язані з довірою, спільними ресурсами та глибокою інтимністю. Це положення вимагає від вас навчитися відпускати контроль.',
  recommendations: [
    'Розвивайте свою природну лідерську харизму через публічні виступи та творчі проєкти',
    'Використовуйте інтуїцію Меркурія в Рибах для дослідження глибинних тем — психологія, окультизм, мистецтво',
    'Знайдіть баланс між імпульсивністю Овна та потребою в гармонії Терезів через медитацію та рефлексію',
    'Подорожуйте та навчайтеся — 9-й дім активований, і нові горизонти є ключем до вашого зростання',
  ],
};
