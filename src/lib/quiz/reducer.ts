import { QuizState, QuizAction, TOTAL_STEPS } from './types';

const STORAGE_KEY = 'zorya_quiz_state';

export const initialQuizState: QuizState = {
  currentStep: 0,
  birthDay: null,
  birthMonth: null,
  birthYear: null,
  zodiacSign: null,
  city: '',
  countryCode: '',
  latitude: null,
  longitude: null,
  birthTime: '',
  birthTimeUnknown: false,
  name: '',
  gender: null,
  email: '',
  consentAccepted: false,
  completed: false,
  sessionId: '',
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  let newState: QuizState;

  switch (action.type) {
    case 'NEXT':
      newState = {
        ...state,
        currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS - 1),
      };
      break;

    case 'BACK':
      newState = {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
      break;

    case 'SET_BIRTH_DATE':
      newState = {
        ...state,
        birthDay: action.day,
        birthMonth: action.month,
        birthYear: action.year,
      };
      break;

    case 'SET_ZODIAC_SIGN':
      newState = { ...state, zodiacSign: action.sign };
      break;

    case 'SET_BIRTHPLACE':
      newState = {
        ...state,
        city: action.city,
        countryCode: action.countryCode,
        latitude: action.lat,
        longitude: action.lng,
      };
      break;

    case 'SET_BIRTH_TIME':
      newState = { ...state, birthTime: action.time };
      break;

    case 'SET_BIRTH_TIME_UNKNOWN':
      newState = {
        ...state,
        birthTimeUnknown: action.unknown,
        birthTime: action.unknown ? '12:00' : state.birthTime,
      };
      break;

    case 'SET_NAME':
      newState = { ...state, name: action.name };
      break;

    case 'SET_GENDER':
      newState = { ...state, gender: action.gender };
      break;

    case 'SET_EMAIL':
      newState = { ...state, email: action.email };
      break;

    case 'SET_CONSENT':
      newState = { ...state, consentAccepted: action.accepted };
      break;

    case 'SET_COMPLETED':
      newState = { ...state, completed: true };
      break;

    case 'RESET':
      newState = { ...initialQuizState };
      clearQuizState();
      return newState;

    case 'RESTORE':
      return action.state;

    default:
      return state;
  }

  // Persist to sessionStorage on every change
  saveQuizState(newState);
  return newState;
}

function saveQuizState(state: QuizState): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage unavailable (private browsing, storage full)
  }
}

function clearQuizState(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function loadQuizState(): QuizState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as QuizState;
  } catch {
    return null;
  }
}
