import { QuizState } from './types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStep(step: number, state: QuizState): boolean {
  switch (step) {
    case 0: // Birth date
      return (
        state.birthDay !== null &&
        state.birthMonth !== null &&
        state.birthYear !== null &&
        state.birthDay >= 1 &&
        state.birthDay <= 31 &&
        state.birthMonth >= 1 &&
        state.birthMonth <= 12 &&
        state.birthYear >= 1936 &&
        state.birthYear <= new Date().getFullYear()
      );

    case 1: // Zodiac sign (auto-calculated, always valid if step 0 passed)
      return state.zodiacSign !== null;

    case 2: // Birthplace
      return (
        state.city.trim().length > 0 &&
        state.latitude !== null &&
        state.longitude !== null
      );

    case 3: // Birth time
      return state.birthTimeUnknown || state.birthTime.length > 0;

    case 4: // Name & Gender
      return state.name.trim().length > 0 && state.gender !== null;

    case 5: // Email & Consent
      return (
        EMAIL_REGEX.test(state.email) &&
        state.consentAccepted
      );

    default:
      return false;
  }
}

export function getStepError(step: number, state: QuizState): string | null {
  switch (step) {
    case 0:
      if (state.birthDay === null || state.birthMonth === null || state.birthYear === null) {
        return 'Будь ласка, введіть повну дату народження';
      }
      return null;

    case 2:
      if (!state.city.trim()) return 'Будь ласка, вкажіть місце народження';
      if (state.latitude === null) return 'Оберіть місто зі списку';
      return null;

    case 3:
      if (!state.birthTimeUnknown && !state.birthTime) {
        return 'Вкажіть час або позначте "Я не знаю"';
      }
      return null;

    case 4:
      if (!state.name.trim()) return "Будь ласка, введіть ваше ім'я";
      if (!state.gender) return 'Будь ласка, оберіть стать';
      return null;

    case 5:
      if (!state.email) return 'Будь ласка, введіть email';
      if (!EMAIL_REGEX.test(state.email)) return 'Невірний формат email';
      if (!state.consentAccepted) return 'Необхідно прийняти угоду користувача';
      return null;

    default:
      return null;
  }
}
