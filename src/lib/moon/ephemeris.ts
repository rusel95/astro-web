/**
 * Swiss Ephemeris wrapper for Moon calculations
 * Handles Moon position, aspects, and ingress times
 */

import sweph from 'sweph';

// Swiss Ephemeris constants
const SE_MOON = 1;
const SE_SUN = 0;
const SE_MERCURY = 2;
const SE_VENUS = 3;
const SE_MARS = 4;
const SE_JUPITER = 5;
const SE_SATURN = 6;
const SE_URANUS = 7;
const SE_NEPTUNE = 8;
const SE_PLUTO = 9;

const PLANETS = [
  SE_SUN, SE_MERCURY, SE_VENUS, SE_MARS,
  SE_JUPITER, SE_SATURN, SE_URANUS, SE_NEPTUNE, SE_PLUTO
];

const PLANET_NAMES: Record<number, string> = {
  [SE_SUN]: 'Sun',
  [SE_MERCURY]: 'Mercury',
  [SE_VENUS]: 'Venus',
  [SE_MARS]: 'Mars',
  [SE_JUPITER]: 'Jupiter',
  [SE_SATURN]: 'Saturn',
  [SE_URANUS]: 'Uranus',
  [SE_NEPTUNE]: 'Neptune',
  [SE_PLUTO]: 'Pluto',
};

// Major aspects (0°, 60°, 90°, 120°, 180°)
const MAJOR_ASPECTS = [0, 60, 90, 120, 180];
const ASPECT_ORB = 1.0; // 1° orb for aspects

export interface PlanetPosition {
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
}

export interface Aspect {
  planet: string;
  type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  angle: number;
  exactTime: Date;
  orb: number;
}

export interface MoonIngress {
  fromSign: string;
  toSign: string;
  time: Date;
}

/**
 * Get Julian Day Number from Date
 */
function getJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  
  const jd = sweph.swe_julday(year, month, day, hour, sweph.SE_GREG_CAL);
  return jd;
}

/**
 * Get Date from Julian Day
 */
function getDateFromJulian(jd: number): Date {
  const result = sweph.swe_revjul(jd, sweph.SE_GREG_CAL);
  const date = new Date(Date.UTC(
    result.year,
    result.month - 1,
    result.day,
    Math.floor(result.hour),
    Math.floor((result.hour % 1) * 60),
    Math.floor(((result.hour * 60) % 1) * 60)
  ));
  return date;
}

/**
 * Get planet position at given time
 */
export function getPlanetPosition(planetId: number, date: Date): PlanetPosition {
  const jd = getJulianDay(date);
  const result = sweph.swe_calc_ut(jd, planetId, sweph.SEFLG_SPEED);
  
  return {
    longitude: result.longitude,
    latitude: result.latitude,
    distance: result.distance,
    speed: result.longitudeSpeed,
  };
}

/**
 * Get Moon position
 */
export function getMoonPosition(date: Date): PlanetPosition {
  return getPlanetPosition(SE_MOON, date);
}

/**
 * Calculate angular distance between two longitudes
 */
function angularDistance(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Check if angle is close to major aspect
 */
function isMajorAspect(angle: number): { isAspect: boolean; type: string; exactAngle: number } | null {
  for (const aspectAngle of MAJOR_ASPECTS) {
    const distance = angularDistance(angle, aspectAngle);
    if (distance <= ASPECT_ORB) {
      let type: string;
      switch (aspectAngle) {
        case 0: type = 'conjunction'; break;
        case 60: type = 'sextile'; break;
        case 90: type = 'square'; break;
        case 120: type = 'trine'; break;
        case 180: type = 'opposition'; break;
        default: type = 'unknown';
      }
      return { isAspect: true, type, exactAngle: aspectAngle };
    }
  }
  return null;
}

/**
 * Find exact time of aspect between Moon and planet
 */
function findExactAspectTime(
  moonPos1: PlanetPosition,
  planetPos: PlanetPosition,
  startDate: Date,
  targetAngle: number
): Date | null {
  const currentAngle = angularDistance(moonPos1.longitude, planetPos.longitude);
  let closestTime = startDate;
  let closestDistance = Math.abs(currentAngle - targetAngle);
  
  // Search within next 24 hours with 15-minute intervals
  for (let minutes = 0; minutes < 24 * 60; minutes += 15) {
    const testDate = new Date(startDate.getTime() + minutes * 60 * 1000);
    const moonPos = getMoonPosition(testDate);
    const angle = angularDistance(moonPos.longitude, planetPos.longitude);
    const distance = Math.abs(angle - targetAngle);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestTime = testDate;
    }
    
    if (distance < 0.01) break; // Close enough
  }
  
  return closestDistance < ASPECT_ORB ? closestTime : null;
}

/**
 * Find all upcoming major aspects for Moon
 */
export function findUpcomingAspects(startDate: Date, endDate: Date): Aspect[] {
  const aspects: Aspect[] = [];
  const moonPos = getMoonPosition(startDate);
  
  for (const planetId of PLANETS) {
    const planetPos = getPlanetPosition(planetId, startDate);
    const angle = angularDistance(moonPos.longitude, planetPos.longitude);
    const aspectInfo = isMajorAspect(angle);
    
    if (aspectInfo) {
      const exactTime = findExactAspectTime(moonPos, planetPos, startDate, aspectInfo.exactAngle);
      
      if (exactTime && exactTime >= startDate && exactTime <= endDate) {
        aspects.push({
          planet: PLANET_NAMES[planetId],
          type: aspectInfo.type as Aspect['type'],
          angle: aspectInfo.exactAngle,
          exactTime,
          orb: Math.abs(angle - aspectInfo.exactAngle),
        });
      }
    }
  }
  
  // Sort by time
  aspects.sort((a, b) => a.exactTime.getTime() - b.exactTime.getTime());
  
  return aspects;
}

/**
 * Find next Moon sign ingress (change of zodiac sign)
 */
export function findNextMoonIngress(startDate: Date): MoonIngress {
  const moonPos = getMoonPosition(startDate);
  const currentSign = Math.floor(moonPos.longitude / 30);
  const nextSignLongitude = (currentSign + 1) * 30;
  
  // Binary search for exact ingress time
  let low = startDate.getTime();
  let high = low + 3 * 24 * 60 * 60 * 1000; // Max 3 days ahead
  
  while (high - low > 60 * 1000) { // 1 minute precision
    const mid = (low + high) / 2;
    const midDate = new Date(mid);
    const pos = getMoonPosition(midDate);
    
    if (pos.longitude < nextSignLongitude || pos.longitude >= nextSignLongitude + 30) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  const ingressTime = new Date(high);
  
  const SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  return {
    fromSign: SIGNS[currentSign],
    toSign: SIGNS[(currentSign + 1) % 12],
    time: ingressTime,
  };
}

/**
 * Calculate Moon phase (angle between Sun and Moon)
 */
export function getMoonPhase(date: Date): {
  phase: string;
  angle: number;
  illumination: number;
} {
  const moonPos = getMoonPosition(date);
  const sunPos = getPlanetPosition(SE_SUN, date);
  
  // Calculate elongation (angle between Sun and Moon)
  let angle = moonPos.longitude - sunPos.longitude;
  if (angle < 0) angle += 360;
  
  // Illumination percentage
  const illumination = (1 - Math.cos((angle * Math.PI) / 180)) / 2 * 100;
  
  // Determine phase name
  let phase: string;
  if (angle < 45 || angle >= 315) phase = 'new_moon';
  else if (angle >= 45 && angle < 90) phase = 'waxing_crescent';
  else if (angle >= 90 && angle < 135) phase = 'first_quarter';
  else if (angle >= 135 && angle < 180) phase = 'waxing_gibbous';
  else if (angle >= 180 && angle < 225) phase = 'full_moon';
  else if (angle >= 225 && angle < 270) phase = 'waning_gibbous';
  else if (angle >= 270 && angle < 315) phase = 'last_quarter';
  else phase = 'waning_crescent';
  
  return { phase, angle, illumination };
}

/**
 * Get zodiac sign from longitude
 */
export function getZodiacSign(longitude: number): string {
  const SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const signIndex = Math.floor(longitude / 30) % 12;
  return SIGNS[signIndex];
}
