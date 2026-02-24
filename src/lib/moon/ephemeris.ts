/**
 * Astronomy calculations using astronomy-engine (pure JS)
 * Works on Vercel Edge Runtime (no native C++ dependencies)
 */

import * as Astronomy from 'astronomy-engine';

// Planet IDs matching astronomy-engine
const PLANETS = [
  'Sun', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

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
 * Get ecliptic longitude from equatorial coordinates
 */
function getEclipticLongitude(eq: Astronomy.EquatorVector): number {
  const ecl = Astronomy.Ecliptic(eq);
  let lon = ecl.elon;
  if (lon < 0) lon += 360;
  return lon;
}

/**
 * Get planet position at given time
 */
export function getPlanetPosition(planetName: string, date: Date): PlanetPosition {
  const time = new Astronomy.AstroTime(date);
  
  if (planetName === 'Moon') {
    const geoMoon = Astronomy.GeoMoon(time);
    const longitude = getEclipticLongitude(geoMoon);
    
    // Calculate speed (longitude change over 1 hour)
    const time2 = time.AddDays(1/24); // +1 hour
    const geoMoon2 = Astronomy.GeoMoon(time2);
    const longitude2 = getEclipticLongitude(geoMoon2);
    const speed = (longitude2 - longitude) * 24; // degrees per day
    
    return {
      longitude,
      latitude: 0, // astronomy-engine doesn't provide ecliptic latitude easily
      distance: geoMoon.t, // distance in AU
      speed,
    };
  }
  
  const helioVector = Astronomy.HelioVector(planetName as Astronomy.Body, time);
  const geoVector = Astronomy.GeoVector(planetName as Astronomy.Body, time, false);
  const longitude = getEclipticLongitude(geoVector);
  
  // Calculate speed
  const time2 = time.AddDays(1/24);
  const geoVector2 = Astronomy.GeoVector(planetName as Astronomy.Body, time2, false);
  const longitude2 = getEclipticLongitude(geoVector2);
  let speed = (longitude2 - longitude) * 24;
  if (Math.abs(speed) > 180) {
    speed = speed > 0 ? speed - 360 * 24 : speed + 360 * 24;
  }
  
  return {
    longitude,
    latitude: 0,
    distance: geoVector.t,
    speed,
  };
}

/**
 * Get Moon position
 */
export function getMoonPosition(date: Date): PlanetPosition {
  return getPlanetPosition('Moon', date);
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
  
  for (const planetName of PLANETS) {
    const planetPos = getPlanetPosition(planetName, startDate);
    const angle = angularDistance(moonPos.longitude, planetPos.longitude);
    const aspectInfo = isMajorAspect(angle);
    
    if (aspectInfo) {
      const exactTime = findExactAspectTime(moonPos, planetPos, startDate, aspectInfo.exactAngle);
      
      if (exactTime && exactTime >= startDate && exactTime <= endDate) {
        aspects.push({
          planet: planetName,
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
  const sunPos = getPlanetPosition('Sun', date);
  
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
