import { AstrologyClient, type Subject } from '@astro-api/astroapi-typescript';
import { ChartInput } from '@/types/astrology';
import { DEFAULT_API_OPTIONS } from './constants';

let _client: AstrologyClient | null = null;

export function getAstrologyClient(): AstrologyClient {
  if (!_client) {
    _client = new AstrologyClient({
      apiKey: process.env.ASTROLOGY_API_KEY,
      baseUrl: process.env.ASTROLOGY_API_BASE_URL || 'https://api.astrology-api.io',
      retry: { attempts: 2, delayMs: 500 },
    });
  }
  return _client;
}

export function toSdkSubject(input: ChartInput): Subject {
  return {
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
  };
}

export function toSdkChartOptions() {
  return {
    house_system: DEFAULT_API_OPTIONS.house_system as 'P',
    zodiac_type: DEFAULT_API_OPTIONS.zodiac_type as 'Tropic',
    active_points: DEFAULT_API_OPTIONS.active_points,
    precision: DEFAULT_API_OPTIONS.precision,
  };
}
