// @ts-nocheck - next/og ImageResponse JSX types compatibility
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { ZODIAC_SVG_PATHS } from '@/components/icons/ZodiacIcon';

export const runtime = 'edge';

const SIGN_EN_MAP: Record<string, string> = {
  'Овен': 'Aries', 'Телець': 'Taurus', 'Близнюки': 'Gemini', 'Рак': 'Cancer',
  'Лев': 'Leo', 'Діва': 'Virgo', 'Терези': 'Libra', 'Скорпіон': 'Scorpio',
  'Стрілець': 'Sagittarius', 'Козеріг': 'Capricorn', 'Водолій': 'Aquarius', 'Риби': 'Pisces',
};

const ZODIAC_DATA: Record<string, { color: string; phrase: string }> = {
  'Овен':     { color: '#ef4444', phrase: 'Я завойовую світ своєю сміливістю' },
  'Телець':   { color: '#22c55e', phrase: 'Я створюю красу і стабільність' },
  'Близнюки': { color: '#eab308', phrase: 'Я з\'єдную ідеї та людей' },
  'Рак':      { color: '#94a3b8', phrase: 'Я піклуюся і захищаю близьких' },
  'Лев':      { color: '#d4af37', phrase: 'Я сяю і надихаю інших' },
  'Діва':     { color: '#14b8a6', phrase: 'Я досконалість у деталях' },
  'Терези':   { color: '#ec4899', phrase: 'Я гармонія і справедливість' },
  'Скорпіон': { color: '#dc2626', phrase: 'Я трансформую глибини душі' },
  'Стрілець': { color: '#f97316', phrase: 'Я шукаю істину за горизонтом' },
  'Козеріг':  { color: '#92400e', phrase: 'Я будую свою імперію крок за кроком' },
  'Водолій':  { color: '#3b82f6', phrase: 'Я змінюю майбутнє своїми ідеями' },
  'Риби':     { color: '#a855f7', phrase: 'Я відчуваю світ глибше за інших' },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sign = searchParams.get('sign') || 'Овен';
    const name = searchParams.get('name') || '';

    const zodiac = ZODIAC_DATA[sign] || ZODIAC_DATA['Овен'];

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(160deg, #0a0414 0%, #1a0e35 50%, #0f0a1e 100%)`,
            fontFamily: 'system-ui, sans-serif',
            position: 'relative',
          }}
        >
          {/* Decorative stars */}
          <div style={{ position: 'absolute', top: '60px', left: '80px', fontSize: '40px', opacity: 0.3 }}>✦</div>
          <div style={{ position: 'absolute', top: '120px', right: '100px', fontSize: '28px', opacity: 0.25 }}>✦</div>
          <div style={{ position: 'absolute', bottom: '150px', left: '100px', fontSize: '32px', opacity: 0.2 }}>✦</div>
          <div style={{ position: 'absolute', bottom: '200px', right: '90px', fontSize: '36px', opacity: 0.28 }}>✦</div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '60px',
              padding: '80px',
            }}
          >
            {/* Zodiac symbol with glow */}
            <div
              style={{
                filter: `drop-shadow(0 0 80px ${zodiac.color})`,
              }}
            >
              <svg width="240" height="240" viewBox="0 0 24 24" fill="none"
                stroke={zodiac.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={ZODIAC_SVG_PATHS[SIGN_EN_MAP[sign] || 'Aries']} />
              </svg>
            </div>

            {/* Sign name */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: zodiac.color,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {sign}
            </div>

            {/* Phrase */}
            <div
              style={{
                fontSize: '42px',
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                maxWidth: '900px',
                lineHeight: 1.4,
                fontStyle: 'italic',
              }}
            >
              &ldquo;{zodiac.phrase}&rdquo;
            </div>

            {/* Name if provided */}
            {name && (
              <div
                style={{
                  fontSize: '36px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginTop: '20px',
                }}
              >
                — {name}
              </div>
            )}
          </div>

          {/* Footer watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                color: 'rgba(255, 255, 255, 0.35)',
                letterSpacing: '0.05em',
              }}
            >
              ✦ Зоря
            </div>
            <div
              style={{
                fontSize: '24px',
                color: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              Твоя натальна карта чекає на тебе
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1920,
      }
    );
  } catch (e: unknown) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
