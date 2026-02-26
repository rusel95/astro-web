export const TOTAL_STEPS = 6;

export interface QuizState {
  currentStep: number;
  // Step 1: Birth date
  birthDay: number | null;
  birthMonth: number | null;
  birthYear: number | null;
  // Step 2: Zodiac sign (calculated)
  zodiacSign: string | null;
  // Step 3: Birthplace
  city: string;
  countryCode: string;
  latitude: number | null;
  longitude: number | null;
  // Step 4: Birth time
  birthTime: string;
  birthTimeUnknown: boolean;
  // Step 5: Name & Gender
  name: string;
  gender: 'male' | 'female' | null;
  // Step 6: Email
  email: string;
  consentAccepted: boolean;
  // Result
  completed: boolean;
  sessionId: string;
}

export type QuizAction =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SET_BIRTH_DATE'; day: number; month: number; year: number }
  | { type: 'SET_ZODIAC_SIGN'; sign: string }
  | { type: 'SET_BIRTHPLACE'; city: string; countryCode: string; lat: number; lng: number }
  | { type: 'SET_BIRTH_TIME'; time: string }
  | { type: 'SET_BIRTH_TIME_UNKNOWN'; unknown: boolean }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_GENDER'; gender: 'male' | 'female' }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_CONSENT'; accepted: boolean }
  | { type: 'SET_COMPLETED' }
  | { type: 'RESET' }
  | { type: 'RESTORE'; state: QuizState };

export interface QuizStepProps {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  onNext: () => void;
  onBack: () => void;
}
