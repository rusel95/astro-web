declare module 'sweph' {
  export const SE_GREG_CAL: number;
  export const SEFLG_SPEED: number;
  
  export const SE_SUN: number;
  export const SE_MOON: number;
  export const SE_MERCURY: number;
  export const SE_VENUS: number;
  export const SE_MARS: number;
  export const SE_JUPITER: number;
  export const SE_SATURN: number;
  export const SE_URANUS: number;
  export const SE_NEPTUNE: number;
  export const SE_PLUTO: number;
  
  export function swe_julday(
    year: number,
    month: number,
    day: number,
    hour: number,
    calType: number
  ): number;
  
  export interface RevJulResult {
    year: number;
    month: number;
    day: number;
    hour: number;
  }
  
  export function swe_revjul(jd: number, calType: number): RevJulResult;
  
  export interface CalcResult {
    longitude: number;
    latitude: number;
    distance: number;
    longitudeSpeed: number;
    latitudeSpeed: number;
    distanceSpeed: number;
  }
  
  export function swe_calc_ut(
    jd: number,
    planetId: number,
    flags: number
  ): CalcResult;
}
