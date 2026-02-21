# Spec: #72 Onboarding Flow — Activation Optimization

## Мета
Максимізувати відсоток користувачів, які успішно завершують onboarding і отримують свій перший натальний чарт (activation rate 40% → 60%+).

## Бізнес-обґрунтування
- **Activation = Revenue:** Активовані користувачі конвертують у Premium у 5-10x більше
- **Co-Star benchmark:** 65-70% activation rate через smooth onboarding
- **Current problem:** Користувачі відвалюються на середині форми
- **Quick win:** 1 день роботи → +50% більше активованих користувачів

## Current State Analysis

**Припущення про поточний стан:**
- Користувач потрапляє на форму вводу birth data
- Немає візуального прогресу
- Немає мотиваційних елементів
- Немає exit prevention
- Імовірно статична форма без анімацій

**Drop-off points (hypothetical):**
- 30% — бачать форму, не починають
- 25% — починають, але не заповнюють повністю
- 15% — заповнили, але не submit

**Target after optimization:**
- 85%+ completion rate
- 60%+ activation rate

## Solution Components

### 1. Прогрес-бар (Progress Indicator)

**Design:**
```tsx
// components/onboarding/ProgressBar.tsx
export function OnboardingProgress({ currentStep, totalSteps }: Props) {
  const progress = (currentStep / totalSteps) * 100
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Крок {currentStep} з {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      {/* Step dots */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              i < currentStep ? "bg-purple-500" : "bg-secondary",
              i === currentStep - 1 && "ring-2 ring-purple-500 ring-offset-2"
            )}
          />
        ))}
      </div>
    </div>
  )
}
```

**Steps breakdown:**
1. **Ім'я** — "Як вас звати?"
2. **Дата народження** — "Коли ви народились?"
3. **Час народження** — "О котрій годині?" (optional skip)
4. **Місце народження** — "Де ви народились?"
5. **Підтвердження** — Preview + "Створити чарт"

**Psychology:**
- Показує, що процес майже завершений
- Створює commitment (якщо вже 60% — шкода кидати)
- Gamification відчуття (заповнюю прогрес-бар)

---

### 2. Мотиваційні копірайти

**Per-step motivational messages:**

```tsx
const STEP_MESSAGES = {
  1: {
    title: "Розкажіть про себе",
    subtitle: "Ми створимо ваш унікальний астрологічний профіль ✨",
    motivation: ""
  },
  2: {
    title: "Дата вашого народження",
    subtitle: "Позиція зірок у цей день визначила ваші таланти 🌟",
    motivation: "Ще 3 кроки до вашого чарту!"
  },
  3: {
    title: "Час народження",
    subtitle: "Точний час розкриває найглибші insights (можна пропустити)",
    motivation: "Майже готово! 🎯"
  },
  4: {
    title: "Місце народження",
    subtitle: "Географія змінює астрологічну карту",
    motivation: "Останній крок! 🚀"
  },
  5: {
    title: "Все готово!",
    subtitle: "Перевірте дані перед створенням вашого чарту",
    motivation: "Ваш унікальний чарт за 3 секунди..."
  }
}
```

**Micro-copy examples:**
```tsx
// Placeholder examples
<Input 
  placeholder="Наприклад: Олена" 
  label="Ваше ім'я"
/>

<DatePicker 
  placeholder="ДД.ММ.РРРР"
  helperText="Наприклад: 15.03.1995"
/>

<LocationSearch
  placeholder="Почніть вводити: Київ, Львів..."
  helperText="Ми знайдемо точні координати"
/>
```

**Encouragement banners:**
```tsx
{currentStep === 3 && (
  <Alert className="mb-4 bg-purple-500/10 border-purple-500/20">
    <Sparkles className="h-4 w-4" />
    <AlertTitle>Ви на правильному шляху! ✨</AlertTitle>
    <AlertDescription>
      Точний час народження відкриває на 80% більше insights
    </AlertDescription>
  </Alert>
)}
```

---

### 3. Анімації (Staggered Reveal)

**Framer Motion integration:**

```tsx
// components/onboarding/AnimatedStep.tsx
import { motion, AnimatePresence } from 'framer-motion'

const stepVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.95,
    transition: { duration: 0.3 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

export function AnimatedOnboardingStep({ children, step }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        variants={stepVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-6"
      >
        {/* Title */}
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold">
            {STEP_MESSAGES[step].title}
          </h2>
          <p className="text-muted-foreground mt-2">
            {STEP_MESSAGES[step].subtitle}
          </p>
        </motion.div>

        {/* Form fields */}
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={onBack}>
              Назад
            </Button>
          )}
          <Button onClick={onNext} className="flex-1">
            {step === totalSteps ? 'Створити чарт ✨' : 'Далі'}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
```

**Hover states:**
```css
/* Enhanced button interactions */
.onboarding-button {
  @apply transition-all duration-200;
  @apply hover:scale-105 hover:shadow-lg;
  @apply active:scale-95;
}

/* Input focus states */
.onboarding-input {
  @apply transition-all duration-200;
  @apply focus:ring-2 focus:ring-purple-500 focus:ring-offset-2;
  @apply focus:scale-[1.02];
}
```

**Success micro-animation:**
```tsx
// When field is validated
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  className="absolute right-3 top-1/2 -translate-y-1/2"
>
  <Check className="h-5 w-5 text-green-500" />
</motion.div>
```

---

### 4. Exit-Intent Popup

**Implementation:**

```tsx
// hooks/useExitIntent.ts
export function useExitIntent(callback: () => void) {
  useEffect(() => {
    let hasShown = false
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves top of viewport
      if (e.clientY <= 0 && !hasShown) {
        hasShown = true
        callback()
      }
    }
    
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [callback])
}
```

```tsx
// components/onboarding/ExitIntentModal.tsx
export function ExitIntentModal({ onboardingData, currentStep }: Props) {
  const [open, setOpen] = useState(false)
  
  useExitIntent(() => {
    // Only show if user has started (step > 1) but not finished
    if (currentStep > 1 && currentStep < TOTAL_STEPS) {
      setOpen(true)
    }
  })
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Не йдіть! Ваш чарт майже готовий 🌟
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Ви вже пройшли {currentStep - 1} з {TOTAL_STEPS} кроків.
            Ще {TOTAL_STEPS - currentStep + 1} хвилина і ваш унікальний 
            астрологічний профіль буде готовий!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Progress visualization */}
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Ваш прогрес:</p>
            <OnboardingProgress 
              currentStep={currentStep} 
              totalSteps={TOTAL_STEPS} 
            />
          </div>
          
          {/* What they'll get */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Що вас чекає:</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-purple-500" />
                <span>Персональний астрологічний чарт</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-purple-500" />
                <span>AI-аналіз 6 сфер життя</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-purple-500" />
                <span>Insights про ваше призначення</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button 
            onClick={() => setOpen(false)}
            className="w-full"
            size="lg"
          >
            Продовжити створення чарту ✨
          </Button>
          <Button 
            onClick={() => {
              saveProgress(onboardingData)
              setOpen(false)
            }}
            variant="ghost"
            className="w-full"
          >
            Зберегти і вийти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**Save progress logic:**
```tsx
// Save to localStorage for returning users
function saveProgress(data: OnboardingData) {
  localStorage.setItem('astro_onboarding_progress', JSON.stringify({
    data,
    timestamp: Date.now(),
    step: currentStep
  }))
}

// Resume on return
function loadProgress(): OnboardingData | null {
  const saved = localStorage.getItem('astro_onboarding_progress')
  if (!saved) return null
  
  const { data, timestamp } = JSON.parse(saved)
  
  // Expire after 7 days
  if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
    localStorage.removeItem('astro_onboarding_progress')
    return null
  }
  
  return data
}
```

---

### 5. A/B Testing: 3-step vs 5-step Flow

**Варіант A: 5-step (current, detailed)**
1. Name
2. Birth date
3. Birth time (optional)
4. Birth location
5. Confirmation

**Варіант B: 3-step (streamlined)**
1. Basic info (Name + Birth date)
2. Birth details (Time + Location)
3. Confirmation

**Implementation:**

```tsx
// lib/experiments.ts
export function getOnboardingVariant(): 'A' | 'B' {
  // Simple A/B split based on user ID hash
  const userId = getOrCreateAnonymousId()
  return userId.charCodeAt(0) % 2 === 0 ? 'A' : 'B'
}

// Track variant assignment
analytics.track('onboarding_variant_assigned', {
  variant: getOnboardingVariant(),
  userId
})
```

**Analytics events:**
```tsx
// Track each step
analytics.track('onboarding_step_viewed', {
  step: currentStep,
  variant: getOnboardingVariant()
})

analytics.track('onboarding_step_completed', {
  step: currentStep,
  variant: getOnboardingVariant(),
  timeSpent: elapsedTime
})

// Final activation
analytics.track('onboarding_completed', {
  variant: getOnboardingVariant(),
  totalTime: totalElapsedTime,
  stepsCompleted: totalSteps
})
```

**Analysis after 2 weeks:**
```sql
-- Compare completion rates
SELECT 
  variant,
  COUNT(DISTINCT user_id) as started,
  COUNT(DISTINCT CASE WHEN completed = true THEN user_id END) as completed,
  ROUND(
    COUNT(DISTINCT CASE WHEN completed = true THEN user_id END) * 100.0 / 
    COUNT(DISTINCT user_id), 
    2
  ) as completion_rate
FROM onboarding_analytics
WHERE created_at > NOW() - INTERVAL '14 days'
GROUP BY variant;
```

**Winner selection criteria:**
- Статистична значущість (p < 0.05)
- Мінімум 1000 users per variant
- +5% absolute improvement або більше

---

## UI/UX Enhancements

### Visual Design

**Color palette:**
```css
/* Gradient accents */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-success: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);

/* Glow effects */
.glow-purple {
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}
```

**Typography:**
```tsx
// Headings with personality
<h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
  Розкажіть про себе
</h2>
```

**Background elements:**
```tsx
// Subtle star particles
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  <StarField density={20} />
</div>
```

### Mobile Optimization

**Touch-friendly:**
- Buttons min 44px height
- Input fields min 48px height
- Spacing between clickable elements min 8px

**Keyboard behavior:**
```tsx
// Auto-advance on date complete
<DatePicker
  onChange={(date) => {
    setDate(date)
    if (isValidDate(date)) {
      setTimeout(() => nextStep(), 500)
    }
  }}
/>
```

---

## Technical Implementation

### File Structure

```
app/onboarding/
├── page.tsx                 # Main onboarding page
├── layout.tsx               # Minimal layout (no nav)
└── components/
    ├── OnboardingFlow.tsx   # Main orchestrator
    ├── ProgressBar.tsx      # Progress indicator
    ├── AnimatedStep.tsx     # Step wrapper with animations
    ├── ExitIntentModal.tsx  # Exit prevention
    ├── steps/
    │   ├── StepName.tsx
    │   ├── StepBirthDate.tsx
    │   ├── StepBirthTime.tsx
    │   ├── StepLocation.tsx
    │   └── StepConfirmation.tsx
    └── StarField.tsx        # Background decoration
```

### State Management

```tsx
// lib/onboarding/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OnboardingStore {
  currentStep: number
  data: {
    name: string
    birthDate: Date | null
    birthTime: string | null
    birthLocation: {
      name: string
      lat: number
      lon: number
    } | null
  }
  variant: 'A' | 'B'
  setStep: (step: number) => void
  updateData: (data: Partial<OnboardingStore['data']>) => void
  reset: () => void
}

export const useOnboarding = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      data: {
        name: '',
        birthDate: null,
        birthTime: null,
        birthLocation: null
      },
      variant: getOnboardingVariant(),
      setStep: (step) => set({ currentStep: step }),
      updateData: (newData) => set((state) => ({
        data: { ...state.data, ...newData }
      })),
      reset: () => set({ currentStep: 1, data: initialData })
    }),
    {
      name: 'astro-onboarding'
    }
  )
)
```

### Validation

```tsx
// lib/onboarding/validation.ts
export const onboardingSchema = z.object({
  name: z.string().min(2, "Ім'я має бути довше 2 символів"),
  birthDate: z.date()
    .min(new Date('1900-01-01'), "Дата занадто рання")
    .max(new Date(), "Дата не може бути в майбутньому"),
  birthTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  birthLocation: z.object({
    name: z.string(),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180)
  })
})

// Per-step validation
export function validateStep(step: number, data: OnboardingData): boolean {
  switch (step) {
    case 1:
      return data.name.length >= 2
    case 2:
      return data.birthDate !== null
    case 3:
      return true // Optional
    case 4:
      return data.birthLocation !== null
    case 5:
      return onboardingSchema.safeParse(data).success
  }
}
```

---

## Analytics & Success Metrics

### Key Events to Track

```tsx
// Funnel events
- onboarding_started
- onboarding_step_viewed (step: 1-5)
- onboarding_step_completed (step: 1-5)
- onboarding_completed
- onboarding_abandoned (step: X)
- exit_intent_shown
- exit_intent_retained
- exit_intent_exited
- onboarding_progress_saved
- onboarding_progress_resumed
```

### Dashboard Metrics

```sql
-- Weekly activation funnel
SELECT 
  step,
  COUNT(DISTINCT user_id) as users,
  ROUND(
    COUNT(DISTINCT user_id) * 100.0 / 
    FIRST_VALUE(COUNT(DISTINCT user_id)) OVER (ORDER BY step), 
    2
  ) as retention_rate
FROM (
  SELECT user_id, MAX(step) as step
  FROM onboarding_events
  WHERE event = 'onboarding_step_completed'
  GROUP BY user_id
) steps
GROUP BY step
ORDER BY step;
```

**Target benchmarks:**
- Step 1→2: 90%+
- Step 2→3: 85%+
- Step 3→4: 80%+
- Step 4→5: 90%+
- Overall completion: 60%+

---

## Implementation Plan

### Day 1: Complete Implementation

**Morning (4 hours):**
- [ ] Setup base onboarding page structure
- [ ] Implement ProgressBar component
- [ ] Add Framer Motion animations
- [ ] Create individual step components
- [ ] Implement state management (Zustand)

**Afternoon (4 hours):**
- [ ] Motivational copy integration
- [ ] Exit-intent modal
- [ ] Progress save/resume logic
- [ ] A/B test variant assignment
- [ ] Analytics integration
- [ ] Mobile responsiveness
- [ ] Testing & QA

**Evening (optional polish):**
- [ ] StarField background
- [ ] Micro-interactions polish
- [ ] Performance optimization

---

## Success Criteria

**Week 1:**
- [ ] Onboarding completion rate > 50%
- [ ] 0 critical bugs
- [ ] Mobile completion rate > 45%

**Week 2:**
- [ ] A/B test results statistically significant
- [ ] Completion rate > 55%
- [ ] Exit-intent retention > 30%

**Month 1:**
- [ ] Completion rate > 60%
- [ ] Time to complete < 3 minutes (median)
- [ ] Activated users → Premium conversion baseline established

---

## Risks & Mitigations

**Risk 1: Too many steps (user fatigue)**
- Mitigation: A/B test 3-step variant
- Show progress clearly
- Motivational messaging

**Risk 2: Exit-intent annoying**
- Mitigation: Show only once per session
- Genuine value messaging (not manipulative)
- Easy dismissal

**Risk 3: Mobile keyboard UX**
- Mitigation: Proper input types
- Auto-advance when valid
- Native date/time pickers

**Risk 4: Performance (animations lag)**
- Mitigation: Lazy load Framer Motion
- CSS animations fallback
- Reduce motion preference support

---

## Out of Scope (v2)

- Email/SMS verification
- Social signup (Google/Facebook)
- Video introduction to astrology
- Voice input for birth data
- Multi-language onboarding
- Gamification (achievements, points)

---

**Готовність до імплементації:** Після approval
**Estimated effort:** 1 день
**Priority:** CRITICAL (activation = monetization foundation)
