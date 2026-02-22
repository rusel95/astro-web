/**
 * Birthday Forecast Email Template
 * 
 * Sent 7 days before user's birthday
 * Simple HTML template (no React rendering needed)
 */

export interface BirthdayForecastEmailProps {
  userName: string;
  age: number;
  daysUntilBirthday: number;
  forecastUrl: string;
}

export function renderBirthdayForecastEmail({
  userName,
  age,
  daysUntilBirthday,
  forecastUrl,
}: BirthdayForecastEmailProps): string {
  return `<!DOCTYPE html>
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9fafb',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
        }}>
          <h1 style={{
            fontSize: '28px',
            background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 10px 0',
          }}>
            ✨ Зоря
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Твій персональний астрологічний гід
          </p>
        </div>

        {/* Main content */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '24px',
            marginTop: 0,
            marginBottom: '16px',
            color: '#1f2937',
          }}>
            🎂 Привіт, {userName}!
          </h2>

          <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '20px' }}>
            Через <strong>{daysUntilBirthday} {daysWord(daysUntilBirthday)}</strong> тобі виповниться <strong>{age} {yearsWord(age)}</strong>!
          </p>

          <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '24px' }}>
            Ми підготували для тебе <strong>персональний астрологічний прогноз на наступний рік</strong> — 
            дізнайся, що приготували для тебе зірки! 🌟
          </p>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <a
              href={forecastUrl}
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(108, 60, 225, 0.3)',
              }}
            >
              Переглянути мій прогноз →
            </a>
          </div>

          {/* What's included */}
          <div style={{
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '24px',
          }}>
            <h3 style={{
              fontSize: '16px',
              marginTop: 0,
              marginBottom: '12px',
              color: '#374151',
            }}>
              Що тебе чекає в прогнозі:
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#6b7280',
              fontSize: '14px',
            }}>
              <li style={{ marginBottom: '8px' }}>
                📊 <strong>Загальний огляд року</strong> — головні теми та енергії
              </li>
              <li style={{ marginBottom: '8px' }}>
                💼 <strong>Кар'єра та амбіції</strong> — професійні можливості
              </li>
              <li style={{ marginBottom: '8px' }}>
                ❤️ <strong>Любов і стосунки</strong> — романтичні прогнози
              </li>
              <li style={{ marginBottom: '8px' }}>
                💰 <strong>Фінанси та матеріальне</strong> — грошові можливості
              </li>
              <li style={{ marginBottom: '8px' }}>
                📅 <strong>Місяць за місяцем</strong> — ключові події кожного місяця
              </li>
              <li>
                🔮 <strong>Поради на рік</strong> — як максимально використати свій потенціал
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid #e5e7eb',
        }}>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: '0 0 8px 0' }}>
            Побажань від команди Зоря! 🌟
          </p>
          <p style={{ fontSize: '12px', color: '#d1d5db', margin: 0 }}>
            Якщо не хочеш отримувати ці листи, можеш{' '}
            <a href={`${forecastUrl}?unsubscribe=true`} style={{ color: '#9ca3af' }}>
              відписатися
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}

function daysWord(days: number): string {
  if (days === 1) return 'день';
  if (days >= 2 && days <= 4) return 'дні';
  return 'днів';
}

function yearsWord(years: number): string {
  const lastDigit = years % 10;
  const lastTwoDigits = years % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'років';
  if (lastDigit === 1) return 'рік';
  if (lastDigit >= 2 && lastDigit <= 4) return 'роки';
  return 'років';
}

export function renderBirthdayForecastEmail(props: BirthdayForecastEmailProps): string {
  return `<!DOCTYPE html>${React.renderToStaticMarkup(<BirthdayForecastEmail {...props} />)}`;
}
