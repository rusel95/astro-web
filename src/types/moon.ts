import { AspectType, PlanetName, ZodiacSign } from './astrology';

export type MoonPhaseType = 
  | 'new_moon' 
  | 'waxing_crescent' 
  | 'first_quarter' 
  | 'waxing_gibbous'
  | 'full_moon' 
  | 'waning_gibbous' 
  | 'last_quarter' 
  | 'waning_crescent';

export interface MoonPhase {
  date: string;
  phase: MoonPhaseType;
  illumination: number;
  zodiac_sign: ZodiacSign;
  degree: number;
}

export interface VoidPeriod {
  start: string;
  end: string;
  last_aspect: {
    planet: PlanetName;
    type: AspectType;
    time: string;
  };
  sign_ingress: {
    to_sign: ZodiacSign;
    time: string;
  };
}

export interface CurrentMoon {
  longitude: number;
  sign: ZodiacSign;
  house: number;
  phase: MoonPhaseType;
  illumination: number;
  is_void: boolean;
  next_void?: VoidPeriod;
}

export interface MoonCalendarData {
  phases: MoonPhase[];
  void_periods: VoidPeriod[];
  current: CurrentMoon;
}
