// ============================================================
// Domain types (mirroring iOS app models)
// ============================================================

export type PlanetName =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'
  | 'TrueNode' | 'SouthNode' | 'Lilith';

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type AspectType =
  | 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'Sextile'
  | 'Quincunx' | 'Semisextile' | 'Semisquare' | 'Sesquisquare'
  | 'Quintile' | 'Biquintile';

export interface Planet {
  name: PlanetName;
  longitude: number;
  sign: ZodiacSign;
  house: number;
  isRetrograde: boolean;
  speed: number;
}

export interface House {
  number: number;
  cusp: number;
  sign: ZodiacSign;
}

export interface Aspect {
  planet1: PlanetName;
  planet2: PlanetName;
  type: AspectType;
  orb: number;
  isApplying: boolean;
}

export interface HouseRuler {
  houseNumber: number;
  rulingPlanet: PlanetName;
  rulerSign: ZodiacSign;
  rulerHouse: number;
  rulerLongitude: number;
}

export interface NatalChart {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  locationName: string;
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  houseRulers: HouseRuler[];
  ascendant: number;
  midheaven: number;
  calculatedAt: string;
  svgContent?: string;
}

export type ReportArea = 'general' | 'career' | 'relationships' | 'health' | 'finances' | 'spirituality';

export interface ReportAreaInfo {
  id: ReportArea;
  name: string;
  icon: string;
  description: string;
}

export interface AIReport {
  summary: string;
  key_influences: string[];
  detailed_analysis: string;
  recommendations: string[];
}

// ============================================================
// API request/response types (matching iOS AstrologyAPIModels)
// ============================================================

export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  city: string;
  country_code: string;
}

export interface APISubject {
  name: string;
  birth_data: BirthData;
}

export interface APIOptions {
  house_system: string;
  zodiac_type: string;
  active_points: string[];
  precision: number;
}

export interface APINatalChartRequest {
  subject: APISubject;
  options: APIOptions;
}

export interface APISVGRequest extends APINatalChartRequest {
  svg_options?: { theme: string; language: string };
}

export interface APIPlanetaryPosition {
  name: string;
  sign: string;
  degree: number;
  absolute_longitude: number;
  house: number;
  is_retrograde: boolean;
  speed: number;
}

export interface APIHouseCusp {
  house: number;
  sign: string;
  degree: number;
  absolute_longitude: number;
}

export interface APIAspect {
  point1: string;
  point2: string;
  aspect_type: string;
  orb: number;
}

export interface APICelestialBody {
  name: string;
  sign: string;
  position: number;
  abs_pos: number;
  house?: string;
  retrograde: boolean;
  emoji?: string;
}

export interface APISubjectData {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  city: string;
  nation: string;
  lng: number;
  lat: number;
  tz_str: string;
  ascendant?: APICelestialBody;
  medium_coeli?: APICelestialBody;
  [key: string]: unknown;
}

export interface APIChartData {
  planetary_positions: APIPlanetaryPosition[];
  house_cusps?: APIHouseCusp[];
  aspects?: APIAspect[];
}

export interface APINatalChartResponse {
  subject_data: APISubjectData;
  chart_data: APIChartData;
}

// ============================================================
// Chart input (form data)
// ============================================================

export interface ChartInput {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  city: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  gender?: 'male' | 'female';
}

// ============================================================
// Stored chart (includes ID for URL)
// ============================================================

export interface StoredChart {
  id: string;
  input: ChartInput;
  chart: NatalChart;
  createdAt: string;
}
