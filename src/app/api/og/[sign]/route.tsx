// @ts-nocheck - next/og ImageResponse JSX types compatibility
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const ZODIAC_DATA: Record<string, { symbol: string; name: string; color: string; dates: string; element: string; traits: string }> = {
  aries: { 
    symbol: '♈', 
    name: 'Овен', 
    color: '#ef4444',
    dates: '21 березня — 19 квітня',
    element: 'Вогонь',
    traits: 'Енергійний • Сміливий • Лідер'
  },
  taurus: { 
    symbol: '♉', 
    name: 'Телець', 
    color: '#22c55e',
    dates: '20 квітня — 20 травня',
    element: 'Земля',
    traits: 'Надійний • Терплячий • Практичний'
  },
  gemini: { 
    symbol: '♊', 
    name: 'Близнюки', 
    color: '#eab308',
    dates: '21 травня — 20 червня',
    element: 'Повітря',
    traits: 'Комунікабельний • Допитливий • Гнучкий'
  },
  cancer: { 
    symbol: '♋', 
    name: 'Рак', 
    color: '#94a3b8',
    dates: '21 червня — 22 липня',
    element: 'Вода',
    traits: 'Емоційний • Дбайливий • Інтуїтивний'
  },
  leo: { 
    symbol: '♌', 
    name: 'Лев', 
    color: '#d4af37',
    dates: '23 липня — 22 серпня',
    element: 'Вогонь',
    traits: 'Харизматичний • Щедрий • Творчий'
  },
  virgo: { 
    symbol: '♍', 
    name: 'Діва', 
    color: '#14b8a6',
    dates: '23 серпня — 22 вересня',
    element: 'Земля',
    traits: 'Аналітичний • Старанний • Практичний'
  },
  libra: { 
    symbol: '♎', 
    name: 'Терези', 
    color: '#ec4899',
    dates: '23 вересня — 22 жовтня',
    element: 'Повітря',
    traits: 'Гармонійний • Дипломатичний • Соціальний'
  },
  scorpio: { 
    symbol: '♏', 
    name: 'Скорпіон', 
    color: '#dc2626',
    dates: '23 жовтня — 21 листопада',
    element: 'Вода',
    traits: 'Пристрасний • Глибокий • Трансформуючий'
  },
  sagittarius: { 
    symbol: '♐', 
    name: 'Стрілець', 
    color: '#f97316',
    dates: '22 листопада — 21 грудня',
    element: 'Вогонь',
    traits: 'Оптимістичний • Авантюрний • Філософський'
  },
  capricorn: { 
    symbol: '♑', 
    name: 'Козеріг', 
    color: '#92400e',
    dates: '22 грудня — 19 січня',
    element: 'Земля',
    traits: 'Амбітний • Дисциплінований • Відповідальний'
  },
  aquarius: { 
    symbol: '♒', 
    name: 'Водолій', 
    color: '#3b82f6',
    dates: '20 січня — 18 лютого',
    element: 'Повітря',
    traits: 'Інноваційний • Незалежний • Гуманітарний'
  },
  pisces: { 
    symbol: '♓', 
    name: 'Риби', 
    color: '#a855f7',
    dates: '19 лютого — 20 березня',
    element: 'Вода',
    traits: 'Чутливий • Креативний • Співчутливий'
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { sign: string } }
) {
  const { sign } = params;
  const zodiac = ZODIAC_DATA[sign.toLowerCase()];

  if (!zodiac) {
    return new Response('Sign not found', { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0f0a1e 0%, #1a0e35 100%)',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Decorative stars */}
        <div style={{ position: 'absolute', top: '80px', left: '100px', fontSize: '48px', opacity: 0.2 }}>✦</div>
        <div style={{ position: 'absolute', top: '150px', right: '120px', fontSize: '36px', opacity: 0.15 }}>✦</div>
        <div style={{ position: 'absolute', bottom: '180px', left: '140px', fontSize: '40px', opacity: 0.18 }}>✦</div>
        <div style={{ position: 'absolute', bottom: '240px', right: '110px', fontSize: '44px', opacity: 0.22 }}>✦</div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '80px',
          }}
        >
          {/* Zodiac symbol */}
          <div
            style={{
              fontSize: '280px',
              lineHeight: 1,
              color: zodiac.color,
              marginBottom: '40px',
              filter: `drop-shadow(0 0 60px ${zodiac.color}80)`,
            }}
          >
            {zodiac.symbol}
          </div>

          {/* Sign name */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              letterSpacing: '0.02em',
            }}
          >
            {zodiac.name}
          </div>

          {/* Dates */}
          <div
            style={{
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '40px',
            }}
          >
            {zodiac.dates}
          </div>

          {/* Element badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 32px',
              background: `${zodiac.color}20`,
              border: `2px solid ${zodiac.color}40`,
              borderRadius: '12px',
              marginBottom: '30px',
            }}
          >
            <div style={{ fontSize: '28px', color: zodiac.color }}>
              {zodiac.element === 'Вогонь' && '🔥'}
              {zodiac.element === 'Земля' && '🌍'}
              {zodiac.element === 'Повітря' && '💨'}
              {zodiac.element === 'Вода' && '💧'}
            </div>
            <div style={{ fontSize: '28px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>
              {zodiac.element}
            </div>
          </div>

          {/* Traits */}
          <div
            style={{
              fontSize: '28px',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            {zodiac.traits}
          </div>

          {/* Footer branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '32px' }}>✦</div>
            <div style={{ fontSize: '28px', color: 'rgba(255, 255, 255, 0.4)' }}>
              Зоря
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
