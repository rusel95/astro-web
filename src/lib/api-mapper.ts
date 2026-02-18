import {
  ChartInput, NatalChart, Planet, House, Aspect,
  APINatalChartResponse, APIPlanetaryPosition, APIHouseCusp, APIAspect,
  PlanetName, ZodiacSign, AspectType,
} from '@/types/astrology';
import { DEFAULT_API_OPTIONS } from './constants';

// Map API planet name to our PlanetName type
function toPlanetName(name: string): PlanetName | null {
  const map: Record<string, PlanetName> = {
    sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars',
    jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
    'true node': 'TrueNode', 'true_node': 'TrueNode', truenode: 'TrueNode',
    'south node': 'SouthNode', 'south_node': 'SouthNode', southnode: 'SouthNode',
    lilith: 'Lilith', 'mean lilith': 'Lilith', 'mean_lilith': 'Lilith', 'black moon': 'Lilith',
  };
  return map[name.toLowerCase()] ?? null;
}

function toZodiacSign(name: string): ZodiacSign {
  const map: Record<string, ZodiacSign> = {
    ari: 'Aries', aries: 'Aries', tau: 'Taurus', taurus: 'Taurus',
    gem: 'Gemini', gemini: 'Gemini', can: 'Cancer', cancer: 'Cancer',
    leo: 'Leo', vir: 'Virgo', virgo: 'Virgo', lib: 'Libra', libra: 'Libra',
    sco: 'Scorpio', scorpio: 'Scorpio', sag: 'Sagittarius', sagittarius: 'Sagittarius',
    cap: 'Capricorn', capricorn: 'Capricorn', aqu: 'Aquarius', aquarius: 'Aquarius',
    pis: 'Pisces', pisces: 'Pisces',
  };
  return map[name.toLowerCase()] ?? 'Aries';
}

function toAspectType(name: string): AspectType | null {
  const map: Record<string, AspectType> = {
    conjunction: 'Conjunction', opposition: 'Opposition', trine: 'Trine',
    square: 'Square', sextile: 'Sextile', quincunx: 'Quincunx', inconjunct: 'Quincunx',
    semisextile: 'Semisextile', 'semi-sextile': 'Semisextile',
    semisquare: 'Semisquare', 'semi-square': 'Semisquare',
    sesquisquare: 'Sesquisquare', 'sesqui-square': 'Sesquisquare',
    quintile: 'Quintile', biquintile: 'Biquintile', 'bi-quintile': 'Biquintile',
  };
  return map[name.toLowerCase()] ?? null;
}

export function mapAPIResponse(response: APINatalChartResponse, input: ChartInput): NatalChart {
  const planets: Planet[] = response.chart_data.planetary_positions
    .map((p: APIPlanetaryPosition) => {
      const name = toPlanetName(p.name);
      if (!name) return null;
      return {
        name,
        longitude: p.absolute_longitude,
        sign: toZodiacSign(p.sign),
        house: p.house,
        isRetrograde: p.is_retrograde,
        speed: p.speed,
      };
    })
    .filter((p): p is Planet => p !== null);

  // Add south node if missing
  const trueNode = planets.find(p => p.name === 'TrueNode');
  if (trueNode && !planets.find(p => p.name === 'SouthNode')) {
    const snLng = (trueNode.longitude + 180) % 360;
    planets.push({
      name: 'SouthNode',
      longitude: snLng,
      sign: zodiacFromDegree(snLng),
      house: ((trueNode.house + 5) % 12) + 1,
      isRetrograde: false,
      speed: -trueNode.speed,
    });
  }

  const houses: House[] = (response.chart_data.house_cusps ?? []).map((h: APIHouseCusp) => ({
    number: h.house,
    cusp: h.absolute_longitude,
    sign: toZodiacSign(h.sign),
  }));

  const aspects: Aspect[] = (response.chart_data.aspects ?? [])
    .map((a: APIAspect) => {
      const p1 = toPlanetName(a.point1);
      const p2 = toPlanetName(a.point2);
      const type = toAspectType(a.aspect_type);
      if (!p1 || !p2 || !type) return null;
      return { planet1: p1, planet2: p2, type, orb: a.orb, isApplying: false };
    })
    .filter((a): a is Aspect => a !== null)
    .sort((a, b) => a.orb - b.orb)
    .slice(0, 20);

  return {
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    latitude: response.subject_data.lat,
    longitude: response.subject_data.lng,
    locationName: response.subject_data.city,
    planets,
    houses,
    aspects,
    houseRulers: [],
    ascendant: response.subject_data.ascendant?.abs_pos ?? 0,
    midheaven: response.subject_data.medium_coeli?.abs_pos ?? 0,
    calculatedAt: new Date().toISOString(),
  };
}

function zodiacFromDegree(deg: number): ZodiacSign {
  const signs: ZodiacSign[] = [
    'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
    'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
  ];
  return signs[Math.floor((deg % 360) / 30)];
}

export function buildAPIRequest(input: ChartInput) {
  return {
    subject: {
      name: input.name,
      birth_data: {
        year: parseInt(input.birthDate.split('-')[0]),
        month: parseInt(input.birthDate.split('-')[1]),
        day: parseInt(input.birthDate.split('-')[2]),
        hour: parseInt(input.birthTime.split(':')[0]),
        minute: parseInt(input.birthTime.split(':')[1]),
        second: 0,
        city: input.city,
        country_code: input.countryCode,
      },
    },
    options: DEFAULT_API_OPTIONS,
  };
}
