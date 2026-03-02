// Feature types for the full astrology API platform

export type FeatureType =
  | 'natal_report'
  | 'enhanced_natal'
  | 'transit'
  | 'natal_transits'
  | 'solar_return'
  | 'lunar_return'
  | 'progressions'
  | 'directions'
  | 'synastry'
  | 'composite'
  | 'compatibility'
  | 'daily_horoscope'
  | 'weekly_horoscope'
  | 'monthly_horoscope'
  | 'yearly_horoscope'
  | 'personal_horoscope'
  | 'chinese_horoscope'
  | 'career_analysis'
  | 'health_analysis'
  | 'karmic_analysis'
  | 'psychological'
  | 'spiritual'
  | 'vocational'
  | 'predictive'
  | 'lunar_analysis'
  | 'relocation'
  | 'tarot_daily'
  | 'tarot_single'
  | 'tarot_three_card'
  | 'tarot_celtic_cross'
  | 'tarot_houses'
  | 'tarot_tree_of_life'
  | 'tarot_synastry'
  | 'tarot_transit'
  | 'tarot_birth_cards'
  | 'bazi'
  | 'chinese_compatibility'
  | 'chinese_forecast'
  | 'numerology'
  | 'numerology_compatibility'
  | 'traditional'
  | 'profections'
  | 'firdaria'
  | 'zodiacal_releasing'
  | 'astrocartography'
  | 'astrocartography_location'
  | 'astrocartography_power_zones'
  | 'astrocartography_compare'
  | 'fixed_stars'
  | 'eclipses'
  | 'wellness'
  | 'financial'
  | 'business';

export interface FeatureResult {
  id: string;
  user_id: string;
  chart_id: string;
  feature_type: FeatureType;
  feature_params: Record<string, unknown>;
  result_data: Record<string, unknown>;
  expires_at: string;
  created_at: string;
}

export interface PartnerChart {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time: string | null;
  city: string;
  country_code: string;
  latitude: number;
  longitude: number;
  gender: 'male' | 'female' | null;
  created_at: string;
}

// Cache TTLs in milliseconds
export const CACHE_TTL: Record<FeatureType, number> = {
  natal_report: Infinity,
  enhanced_natal: Infinity,
  transit: 60 * 60 * 1000, // 1h
  natal_transits: 60 * 60 * 1000,
  solar_return: 365 * 24 * 60 * 60 * 1000,
  lunar_return: 30 * 24 * 60 * 60 * 1000,
  progressions: 30 * 24 * 60 * 60 * 1000,
  directions: 30 * 24 * 60 * 60 * 1000,
  synastry: 30 * 24 * 60 * 60 * 1000,
  composite: 30 * 24 * 60 * 60 * 1000,
  compatibility: 30 * 24 * 60 * 60 * 1000,
  daily_horoscope: 24 * 60 * 60 * 1000,
  weekly_horoscope: 7 * 24 * 60 * 60 * 1000,
  monthly_horoscope: 30 * 24 * 60 * 60 * 1000,
  yearly_horoscope: 365 * 24 * 60 * 60 * 1000,
  personal_horoscope: 24 * 60 * 60 * 1000,
  chinese_horoscope: 30 * 24 * 60 * 60 * 1000,
  career_analysis: 30 * 24 * 60 * 60 * 1000,
  health_analysis: 30 * 24 * 60 * 60 * 1000,
  karmic_analysis: 30 * 24 * 60 * 60 * 1000,
  psychological: 30 * 24 * 60 * 60 * 1000,
  spiritual: 30 * 24 * 60 * 60 * 1000,
  vocational: 30 * 24 * 60 * 60 * 1000,
  predictive: 7 * 24 * 60 * 60 * 1000,
  lunar_analysis: 30 * 24 * 60 * 60 * 1000,
  relocation: 30 * 24 * 60 * 60 * 1000,
  tarot_daily: 24 * 60 * 60 * 1000,
  tarot_single: 0, // no cache
  tarot_three_card: 0,
  tarot_celtic_cross: 0,
  tarot_houses: 0,
  tarot_tree_of_life: 0,
  tarot_synastry: 0,
  tarot_transit: 0,
  tarot_birth_cards: 30 * 24 * 60 * 60 * 1000,
  bazi: 30 * 24 * 60 * 60 * 1000,
  chinese_compatibility: 30 * 24 * 60 * 60 * 1000,
  chinese_forecast: 30 * 24 * 60 * 60 * 1000,
  numerology: 30 * 24 * 60 * 60 * 1000,
  numerology_compatibility: 30 * 24 * 60 * 60 * 1000,
  traditional: 30 * 24 * 60 * 60 * 1000,
  profections: 30 * 24 * 60 * 60 * 1000,
  firdaria: 30 * 24 * 60 * 60 * 1000,
  zodiacal_releasing: 30 * 24 * 60 * 60 * 1000,
  astrocartography: 30 * 24 * 60 * 60 * 1000,
  astrocartography_location: 30 * 24 * 60 * 60 * 1000,
  astrocartography_power_zones: 30 * 24 * 60 * 60 * 1000,
  astrocartography_compare: 30 * 24 * 60 * 60 * 1000,
  fixed_stars: 30 * 24 * 60 * 60 * 1000,
  eclipses: 7 * 24 * 60 * 60 * 1000,
  wellness: 24 * 60 * 60 * 1000,
  financial: 24 * 60 * 60 * 1000,
  business: 30 * 24 * 60 * 60 * 1000,
};

export type BirthDataFormVariant = 'basic' | 'full' | 'date-range' | 'location';
