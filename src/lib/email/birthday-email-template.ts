/**
 * Birthday Forecast Email Template
 * 
 * Simple HTML email template (no React components)
 */

export interface BirthdayEmailProps {
  userName: string;
  age: number;
  daysUntilBirthday: number;
  forecastUrl: string;
}

export function renderBirthdayEmail({
  userName,
  age,
  daysUntilBirthday,
  forecastUrl,
}: BirthdayEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 28px; background: linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 10px 0;">
      ✨ Зоря
    </h1>
    <p style="color: #6b7280; font-size: 14px; margin: 0;">
      Твій персональний астрологічний гід
    </p>
  </div>

  <!-- Main content -->
  <div style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    
    <h2 style="font-size: 24px; margin-top: 0; margin-bottom: 16px; color: #1f2937;">
      🎂 Привіт, ${userName}!
    </h2>

    <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
      Через <strong>${daysUntilBirthday} ${daysWord(daysUntilBirthday)}</strong> тобі виповниться <strong>${age} ${yearsWord(age)}</strong>!
    </p>

    <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
      Ми підготували для тебе <strong>персональний астрологічний прогноз на наступний рік</strong> — 
      дізнайся, що приготували для тебе зірки! 🌟
    </p>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${forecastUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(108, 60, 225, 0.3);">
        Переглянути мій прогноз →
      </a>
    </div>

    <!-- What's included -->
    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-top: 24px;">
      <h3 style="font-size: 16px; margin-top: 0; margin-bottom: 12px; color: #374151;">
        Що тебе чекає в прогнозі:
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px;">
        <li style="margin-bottom: 8px;">
          📊 <strong>Загальний огляд року</strong> — головні теми та енергії
        </li>
        <li style="margin-bottom: 8px;">
          💼 <strong>Кар'єра та амбіції</strong> — професійні можливості
        </li>
        <li style="margin-bottom: 8px;">
          ❤️ <strong>Любов і стосунки</strong> — романтичні прогнози
        </li>
        <li style="margin-bottom: 8px;">
          💰 <strong>Фінанси та матеріальне</strong> — грошові можливості
        </li>
        <li style="margin-bottom: 8px;">
          📅 <strong>Місяць за місяцем</strong> — ключові події кожного місяця
        </li>
        <li>
          🔮 <strong>Поради на рік</strong> — як максимально використати свій потенціал
        </li>
      </ul>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    <p style="font-size: 14px; color: #9ca3af; margin: 0 0 8px 0;">
      Побажань від команди Зоря! 🌟
    </p>
    <p style="font-size: 12px; color: #d1d5db; margin: 0;">
      Якщо не хочеш отримувати ці листи, можеш 
      <a href="${forecastUrl}?unsubscribe=true" style="color: #9ca3af;">відписатися</a>
    </p>
  </div>

</body>
</html>
  `.trim();
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
