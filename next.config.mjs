import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // /daily → /horoscope/daily
      {
        source: '/daily',
        destination: '/horoscope/daily',
        permanent: true,
      },
      // /explore → /dashboard (demo page removed, all features have dedicated pages)
      {
        source: '/explore',
        destination: '/dashboard',
        permanent: true,
      },
      // /ascendant → /chart/new (old ascendant calculator now in chart creation flow)
      {
        source: '/ascendant',
        destination: '/chart/new',
        permanent: true,
      },
      // /horoscopes/* → /horoscope/* (old product pages to new API pages)
      {
        source: '/horoscopes/career',
        destination: '/horoscope/career',
        permanent: true,
      },
      {
        source: '/horoscopes/love',
        destination: '/horoscope/love',
        permanent: true,
      },
      {
        source: '/horoscopes/health',
        destination: '/horoscope/health',
        permanent: true,
      },
      {
        source: '/horoscopes/personality',
        destination: '/horoscope/personality',
        permanent: true,
      },
      {
        source: '/horoscopes/compatibility',
        destination: '/horoscope/love-compatibility',
        permanent: true,
      },
      {
        source: '/horoscopes/forecast',
        destination: '/horoscope/monthly',
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: 'ruslanpopesku',
  project: 'astro-web',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
